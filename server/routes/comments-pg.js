const express = require('express');
const pool = require('../aiven-db');

const router = express.Router();

// Create comment
router.post('/', async (req, res) => {
  const { user_id, post_id, content } = req.body;

  if (!user_id || !post_id || !content) {
    return res.status(400).json({ error: 'user_id, post_id, and content are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING comment_id',
      [user_id, post_id, content]
    );

    res.json({
      success: true,
      message: 'Comment created',
      comment_id: result.rows[0].comment_id
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get all comments for a post
router.get('/post/:post_id', async (req, res) => {
  const { post_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.post_id = $1 ORDER BY c.created_at ASC',
      [post_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Update comment
router.put('/:comment_id', async (req, res) => {
  const { comment_id } = req.params;
  const { user_id, content } = req.body;

  try {
    const result = await pool.query(
      'UPDATE comments SET content = $1 WHERE comment_id = $2 AND user_id = $3',
      [content, comment_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Comment not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Comment updated'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/:comment_id', async (req, res) => {
  const { comment_id } = req.params;
  const { user_id } = req.body;

  try {
    const result = await pool.query(
      'DELETE FROM comments WHERE comment_id = $1 AND user_id = $2',
      [comment_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Comment not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
