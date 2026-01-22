const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Store user answer to a question
  router.post('/', (req, res) => {
    const { user_id, game_type, question_id, answer_choice, trait_awarded } = req.body;

    if (!user_id || !game_type || !answer_choice) {
      return res.status(400).json({ error: 'user_id, game_type, and answer_choice are required' });
    }

    const query = 'INSERT INTO user_answers (user_id, game_type, question_id, answer_choice, trait_awarded) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [user_id, game_type, question_id || null, answer_choice, trait_awarded || null], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save answer' });
      }

      res.json({
        success: true,
        message: 'Answer saved',
        answer_id: result.insertId
      });
    });
  });

  // Get all answers for a user
  router.get('/user/:user_id', (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT * FROM user_answers WHERE user_id = ? ORDER BY created_at DESC';
    
    db.query(query, [user_id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch answers' });
      }

      res.json(results);
    });
  });

  // Get answers by game type
  router.get('/game/:game_type', (req, res) => {
    const { game_type } = req.params;

    const query = 'SELECT * FROM user_answers WHERE game_type = ? ORDER BY created_at DESC LIMIT 100';
    
    db.query(query, [game_type], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch answers' });
      }

      res.json(results);
    });
  });

  return router;
};
