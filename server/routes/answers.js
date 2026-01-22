const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Store user answer to a question
  router.post('/', async (req, res) => {
    try {
      const { user_id, game_type, question_id, answer_choice, trait_awarded } = req.body;

      if (!user_id || !game_type || !answer_choice) {
        return res.status(400).json({ error: 'user_id, game_type, and answer_choice are required' });
      }

      const [result] = await db.execute(
        'INSERT INTO user_answers (user_id, game_type, question_id, answer_choice, trait_awarded) VALUES (?, ?, ?, ?, ?)',
        [user_id, game_type, question_id || null, answer_choice, trait_awarded || null]
      );

      res.json({ success: true, message: 'Answer saved', answer_id: result.insertId });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save answer' });
    }
  });

  // Get all answers for a user
  router.get('/user/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const [results] = await db.execute(
        'SELECT * FROM user_answers WHERE user_id = ? ORDER BY created_at DESC',
        [user_id]
      );
      res.json(results);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch answers' });
    }
  });

  // Get answers by game type
  router.get('/game/:game_type', async (req, res) => {
    try {
      const { game_type } = req.params;
      const [results] = await db.execute(
        'SELECT * FROM user_answers WHERE game_type = ? ORDER BY created_at DESC LIMIT 100',
        [game_type]
      );
      res.json(results);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch answers' });
    }
  });

  return router;
};
