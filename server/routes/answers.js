const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Store user answer to a question
  router.post('/', async (req, res) => {
    try {
      const { user_id, game_type, question_id, answer_choice, personality_code } = req.body;

      if (!user_id || !game_type || !answer_choice) {
        return res.status(400).json({ error: 'user_id, game_type, and answer_choice are required' });
      }

      let safeQuestionId = question_id ?? null;

      if (safeQuestionId !== null && safeQuestionId !== undefined) {
        const [questionRows] = await db.execute(
          'SELECT question_id FROM questions WHERE question_id = ? LIMIT 1',
          [safeQuestionId]
        );

        if (!questionRows.length) {
          safeQuestionId = null;
        }
      }

      const [result] = await db.execute(
        'INSERT INTO user_answers (user_id, game_type, question_id, answer_choice, personality_code) VALUES (?, ?, ?, ?, ?)',
        [user_id, game_type, safeQuestionId, answer_choice, personality_code || null]
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
