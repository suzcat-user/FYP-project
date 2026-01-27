const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get game questions by game name
  router.get('/:game_name', async (req, res) => {
    try {
      const { game_name } = req.params;
      const [rows] = await db.execute(
        'SELECT game_name, questions FROM game_question_sets WHERE game_name = ? LIMIT 1',
        [game_name]
      );

      if (!rows.length) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const record = rows[0];
      const questions = typeof record.questions === 'string'
        ? JSON.parse(record.questions)
        : record.questions;

      res.json({ game_name: record.game_name, questions });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch game questions' });
    }
  });

  // Upsert game questions (optional admin usage)
  router.post('/:game_name', async (req, res) => {
    try {
      const { game_name } = req.params;
      const { questions } = req.body;

      if (!Array.isArray(questions)) {
        return res.status(400).json({ error: 'questions must be an array' });
      }

      await db.execute(
        'INSERT INTO game_question_sets (game_name, questions) VALUES (?, ?) ON DUPLICATE KEY UPDATE questions = VALUES(questions)',
        [game_name, JSON.stringify(questions)]
      );

      res.json({ success: true, game_name });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save game questions' });
    }
  });

  return router;
};
