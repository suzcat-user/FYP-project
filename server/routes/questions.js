const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET all questions for a specific game type
  router.get('/game/:gameType', async (req, res) => {
    try {
      const { gameType } = req.params;
      
      const query = `
        SELECT 
          q.question_id,
          q.game_type,
          q.question_text,
          q.question_title,
          q.question_subtitle,
          q.question_order,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'option_id', qo.option_id,
                'option_text', qo.option_text,
                'option_icon', qo.option_icon,
                'personality_type', qo.personality_type
              )
            ),
            JSON_ARRAY()
          ) as options,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'choice_id', c.choice_id,
                'choice_text', c.choice_text,
                'points', c.points
              )
            ),
            JSON_ARRAY()
          ) as choices
        FROM questions q
        LEFT JOIN question_options qo ON q.question_id = qo.question_id
        LEFT JOIN choices c ON q.question_id = c.question_id
        WHERE UPPER(q.game_type) = UPPER(?)
        GROUP BY q.question_id, q.game_type, q.question_text, q.question_title, q.question_subtitle, q.question_order
        ORDER BY q.question_order, q.question_id
      `;

      const [rows] = await db.query(query, [gameType]);
      
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: `No questions found for game type: ${gameType}` });
      }

      res.json(rows);
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
    }
  });

  // GET a single question by ID with all its options
  router.get('/:questionId', async (req, res) => {
    try {
      const { questionId } = req.params;
      
      const query = `
        SELECT 
          q.question_id,
          q.game_type,
          q.question_text,
          q.question_title,
          q.question_subtitle,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'option_id', qo.option_id,
                'option_text', qo.option_text,
                'option_icon', qo.option_icon,
                'personality_type', qo.personality_type
              )
            ),
            JSON_ARRAY()
          ) as options
        FROM questions q
        LEFT JOIN question_options qo ON q.question_id = qo.question_id
        WHERE q.question_id = ?
        GROUP BY q.question_id, q.game_type, q.question_text, q.question_title, q.question_subtitle
      `;

      const [rows] = await db.query(query, [questionId]);
      
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: `Question not found: ${questionId}` });
      }

      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching question:', err);
      res.status(500).json({ error: 'Failed to fetch question', details: err.message });
    }
  });

  // POST create new question
  router.post('/', async (req, res) => {
    try {
      const { game_type, question_text, question_title, question_subtitle, question_order } = req.body;
      
      if (!game_type || !question_text) {
        return res.status(400).json({ error: 'game_type and question_text are required' });
      }

      const insertQuery = `
        INSERT INTO questions (game_type, question_text, question_title, question_subtitle, question_order)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(insertQuery, [
        game_type,
        question_text,
        question_title || null,
        question_subtitle || null,
        question_order || null
      ]);

      res.status(201).json({
        question_id: result.insertId,
        game_type,
        question_text,
        question_title,
        question_subtitle,
        question_order
      });
    } catch (err) {
      console.error('Error creating question:', err);
      res.status(500).json({ error: 'Failed to create question', details: err.message });
    }
  });

  // POST add option to question
  router.post('/:questionId/options', async (req, res) => {
    try {
      const { questionId } = req.params;
      const { option_text, option_icon, personality_type } = req.body;
      
      if (!option_text) {
        return res.status(400).json({ error: 'option_text is required' });
      }

      const insertQuery = `
        INSERT INTO question_options (question_id, option_text, option_icon, personality_type)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.query(insertQuery, [
        questionId,
        option_text,
        option_icon || null,
        personality_type || null
      ]);

      res.status(201).json({
        option_id: result.insertId,
        question_id: questionId,
        option_text,
        option_icon,
        personality_type
      });
    } catch (err) {
      console.error('Error adding option:', err);
      res.status(500).json({ error: 'Failed to add option', details: err.message });
    }
  });

  return router;
};
