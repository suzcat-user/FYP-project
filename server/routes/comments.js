const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Create a comment on a post
  router.post('/', (req, res) => {
    const { user_id, post_id, content } = req.body;

    if (!user_id || !post_id || !content) {
      return res.status(400).json({ error: 'user_id, post_id, and content are required' });
    }

    const query = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
    
    db.query(query, [user_id, post_id, content], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create comment' });
      }

      res.json({
        success: true,
        message: 'Comment created',
        comment_id: result.insertId,
        comment: {
          comment_id: result.insertId,
          user_id,
          post_id,
          content,
          created_at: new Date().toISOString()
        }
      });
    });
  });

  // Get all comments for a post
  router.get('/post/:post_id', (req, res) => {
    const { post_id } = req.params;

    const query = 'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.post_id = ? ORDER BY c.created_at DESC';
    
    db.query(query, [post_id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }

      res.json(results);
    });
  });

  // Update comment
  router.put('/:comment_id', (req, res) => {
    const { comment_id } = req.params;
    const { user_id, content } = req.body;

    const query = 'UPDATE comments SET content = ? WHERE comment_id = ? AND user_id = ?';
    
    db.query(query, [content, comment_id, user_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update comment' });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Comment not found or unauthorized' });
      }

      res.json({
        success: true,
        message: 'Comment updated'
      });
    });
  });

  // Delete comment
  router.delete('/:comment_id', (req, res) => {
    const { comment_id } = req.params;
    const { user_id } = req.body;

    const query = 'DELETE FROM comments WHERE comment_id = ? AND user_id = ?';
    
    db.query(query, [comment_id, user_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete comment' });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Comment not found or unauthorized' });
      }

      res.json({
        success: true,
        message: 'Comment deleted'
      });
    });
  });

  return router;
};
