const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Create a post
  router.post('/', (req, res) => {
    const { user_id, title, content, description } = req.body;

    if (!user_id || !title || !content) {
      return res.status(400).json({ error: 'user_id, title, and content are required' });
    }

    const query = 'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)';
    
    db.query(query, [user_id, title, content || description], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create post' });
      }

      res.json({
        success: true,
        message: 'Post created',
        post_id: result.insertId,
        post: {
          post_id: result.insertId,
          user_id,
          title,
          content: content || description,
          created_at: new Date().toISOString()
        }
      });
    });
  });

  // Get all posts
  router.get('/', (req, res) => {
    const query = 'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id ORDER BY p.created_at DESC LIMIT 100';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch posts' });
      }

      res.json(results);
    });
  });

  // Get post by ID
  router.get('/:post_id', (req, res) => {
    const { post_id } = req.params;

    const query = 'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id WHERE p.post_id = ?';
    
    db.query(query, [post_id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch post' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json(results[0]);
    });
  });

  // Update post
  router.put('/:post_id', (req, res) => {
    const { post_id } = req.params;
    const { user_id, title, content, description } = req.body;

    const query = 'UPDATE posts SET title = ?, content = ? WHERE post_id = ? AND user_id = ?';
    
    db.query(query, [title, content || description, post_id, user_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update post' });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Post not found or unauthorized' });
      }

      res.json({
        success: true,
        message: 'Post updated'
      });
    });
  });

  // Delete post
  router.delete('/:post_id', (req, res) => {
    const { post_id } = req.params;
    const { user_id } = req.body;

    const query = 'DELETE FROM posts WHERE post_id = ? AND user_id = ?';
    
    db.query(query, [post_id, user_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete post' });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Post not found or unauthorized' });
      }

      res.json({
        success: true,
        message: 'Post deleted'
      });
    });
  });

  return router;
};
