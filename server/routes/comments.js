const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Create a comment on a post
  router.post('/', async (req, res) => {
    try {
      const { user_id, post_id, content } = req.body;

      if (!user_id || !post_id || !content) {
        return res.status(400).json({ error: 'user_id, post_id, and content are required' });
      }

      const [result] = await db.execute('INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)', [
        user_id,
        post_id,
        content,
      ]);

      res.json({
        success: true,
        message: 'Comment created',
        comment_id: result.insertId,
        comment: {
          comment_id: result.insertId,
          user_id,
          post_id,
          content,
          created_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  // Get all comments for a post
  router.get('/post/:post_id', async (req, res) => {
    try {
      const { post_id } = req.params;
      const [results] = await db.execute(
        'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.post_id = ? ORDER BY c.created_at DESC',
        [post_id]
      );
      res.json(results);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // Update comment
  router.put('/:comment_id', async (req, res) => {
    try {
      const { comment_id } = req.params;
      const { user_id, content } = req.body;

      const [result] = await db.execute('UPDATE comments SET content = ? WHERE comment_id = ? AND user_id = ?', [
        content,
        comment_id,
        user_id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Comment not found or unauthorized' });
      }

      res.json({ success: true, message: 'Comment updated' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update comment' });
    }
  });

  // Delete comment
  router.delete('/:comment_id', async (req, res) => {
    try {
      const { comment_id } = req.params;
      const { user_id } = req.body;

      const [result] = await db.execute('DELETE FROM comments WHERE comment_id = ? AND user_id = ?', [comment_id, user_id]);

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Comment not found or unauthorized' });
      }

      res.json({ success: true, message: 'Comment deleted' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete comment' });
    }
  });

  return router;
};
