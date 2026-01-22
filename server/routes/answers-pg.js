const express = require('express');
const pool = require('../aiven-db');

const router = express.Router();

// Save answer
router.post('/', async (req, res) => {
  const { user_id, game_type, question_id, answer_choice, trait_awarded } = req.body;

  if (!user_id || !game_type) {
    return res.status(400).json({ error: 'user_id and game_type are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO user_answers (user_id, game_type, question_id, answer_choice, trait_awarded) VALUES ($1, $2, $3, $4, $5) RETURNING answer_id',
      [user_id, game_type, question_id, answer_choice, trait_awarded]
    );

    res.json({
      success: true,
      message: 'Answer saved',
      answer_id: result.rows[0].answer_id
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

// Get answers by user
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM user_answers WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// Get answers by game type
router.get('/game/:game_type', async (req, res) => {
  const { game_type } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM user_answers WHERE game_type = $1 ORDER BY created_at DESC',
      [game_type]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

module.exports = router;
