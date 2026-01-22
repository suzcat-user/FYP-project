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

      const [existing] = await db.execute('SELECT * FROM users WHERE username = ?', [resolvedUsername]);
      const passwordHash = await bcrypt.hash(password, 10);

      if (existing.length > 0) {
        const user = existing[0];
        await db.execute('UPDATE users SET email = ?, password_hash = ? WHERE user_id = ?', [email, passwordHash, user.user_id]);

        return res.json({
          success: true,
          message: 'User updated',
          user: {
            user_id: user.user_id,
            username: user.username,
            score: user.score,
          },
        });
      }

      const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash, score) VALUES (?, ?, ?, 0)',
        [resolvedUsername, email, passwordHash]
      );

      return res.json({
        success: true,
        message: 'User registered successfully',
        user: {
          user_id: result.insertId,
          username: resolvedUsername,
          score: 0,
        },
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Unexpected server error' });
    }
  });

  // Get user by ID
  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const [results] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(results[0]);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  });

  // Update user score
  router.put('/:userId/score', async (req, res) => {
    try {
      const { userId } = req.params;
      const { score } = req.body;

      await db.execute('UPDATE users SET score = score + ? WHERE user_id = ?', [score, userId]);
      res.json({ success: true, message: 'Score updated' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
};
