const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (db) => {
  const router = express.Router();

  // SIGNUP: Create a new user account
  router.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate all required fields
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are all required' });
      }

      // Trim and validate username
      const trimmedUsername = username.trim();
      if (trimmedUsername.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
      }

      // Validate password
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Check if username already exists
      const [existing] = await db.execute('SELECT user_id FROM users WHERE username = ?', [trimmedUsername]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Check if email already exists
      const [emailExists] = await db.execute('SELECT user_id FROM users WHERE email = ?', [email]);
      if (emailExists.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash, score, created_at, updated_at) VALUES (?, ?, ?, 0, CONVERT_TZ(UTC_TIMESTAMP(), \'+00:00\', \'Asia/Singapore\'), CONVERT_TZ(UTC_TIMESTAMP(), \'+00:00\', \'Asia/Singapore\'))',
        [trimmedUsername, email, passwordHash]
      );

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          user_id: result.insertId,
          username: trimmedUsername,
          email: email,
          score: 0,
        },
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create account' });
    }
  });

  // LOGIN: Authenticate existing user
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user by email
      const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email.trim()]);

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const user = results[0];

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      await db.execute(
        'UPDATE users SET updated_at = CONVERT_TZ(UTC_TIMESTAMP(), \'+00:00\', \'Asia/Singapore\') WHERE user_id = ?',
        [user.user_id]
      );

      // Login successful
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          score: user.score,
        },
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
  });

  // Get user by ID
  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const [results] = await db.execute('SELECT user_id, username, email, score, created_at FROM users WHERE user_id = ?', [userId]);

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

  // Get leaderboard - top users ranked by score
  router.get('/leaderboard/top', async (req, res) => {
    try {
      console.log('📊 Leaderboard endpoint called');
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
      console.log('🎯 Limit requested:', limit || 'none (all users)');
      
      // Fetch all users sorted by score (highest first)
      const [users] = await db.query('SELECT user_id, username, score FROM users ORDER BY score DESC');
      console.log('🔍 Found', users.length, 'users in database');
      
      // Apply limit if specified
      const limitedUsers = limit ? users.slice(0, limit) : users;
      
      // Add rank and emblem to each user
      const leaderboard = limitedUsers.map((user, index) => ({
        user_id: user.user_id,
        username: user.username,
        score: user.score,
        rank: index + 1,
        emblem: index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '✨',
      }));

      console.log('✅ Returning leaderboard with', leaderboard.length, 'entries');
      res.json(leaderboard);
    } catch (err) {
      console.error('❌ Leaderboard endpoint error:', err);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  return router;
};
