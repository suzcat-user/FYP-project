const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (db) => {
  const router = express.Router();

  // Upsert user: always capture email, username, password (no strict login/signup split)
  router.post('/login', async (req, res) => {
    try {
      const { email = '', username, password } = req.body;
      const resolvedUsername = (username && username.trim()) || (email ? email.split('@')[0] : '');

      if (!resolvedUsername || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const checkQuery = 'SELECT * FROM users WHERE username = ?';
      db.query(checkQuery, [resolvedUsername], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // If user exists, update email and password hash, then return
        if (results.length > 0) {
          const user = results[0];
          const updateQuery = 'UPDATE users SET email = ?, password_hash = ? WHERE user_id = ?';

          return db.query(updateQuery, [email, passwordHash, user.user_id], (updateErr) => {
            if (updateErr) {
              console.error('Database error:', updateErr);
              return res.status(500).json({ error: 'Failed to update user' });
            }

            return res.json({
              success: true,
              message: 'User updated',
              user: {
                user_id: user.user_id,
                username: user.username,
                score: user.score
              }
            });
          });
        }

        // Create new user
        const insertQuery = 'INSERT INTO users (username, email, password_hash, score) VALUES (?, ?, ?, 0)';

        db.query(insertQuery, [resolvedUsername, email, passwordHash], (insertErr, result) => {
          if (insertErr) {
            console.error('Database error:', insertErr);
            return res.status(500).json({ error: 'Failed to create user' });
          }

          return res.json({
            success: true,
            message: 'User registered successfully',
            user: {
              user_id: result.insertId,
              username: resolvedUsername,
              score: 0
            }
          });
        });
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Unexpected server error' });
    }
  });

  // Get user by ID
  router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(results[0]);
    });
  });

  // Update user score
  router.put('/:userId/score', (req, res) => {
    const { userId } = req.params;
    const { score } = req.body;

    const query = 'UPDATE users SET score = score + ? WHERE user_id = ?';
    db.query(query, [score, userId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ success: true, message: 'Score updated' });
    });
  });

  return router;
};
