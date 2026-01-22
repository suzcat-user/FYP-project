const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../aiven-db');

const router = express.Router();

// Login or create user (upsert)
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userCheck.rows.length > 0) {
      // User exists, update password
      await pool.query(
        'UPDATE users SET email = $1, password_hash = $2 WHERE username = $3',
        [email, hashedPassword, username]
      );

      const user = userCheck.rows[0];
      res.json({
        success: true,
        message: 'User updated successfully',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          score: user.score || 0
        }
      });
    } else {
      // Create new user
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, score',
        [username, email, hashedPassword]
      );

      res.json({
        success: true,
        message: 'User created successfully',
        user: {
          user_id: result.rows[0].user_id,
          username: result.rows[0].username,
          email: result.rows[0].email,
          score: result.rows[0].score || 0
        }
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to process user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, username, email, score FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
