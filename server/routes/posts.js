const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Create a post
  router.post('/', async (req, res) => {
    try {
      const { user_id, title, content, description } = req.body;

      if (!user_id || !title || !content) {
        return res.status(400).json({ error: 'user_id, title, and content are required' });
      }

      const [result] = await db.execute('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)', [
        user_id,
        title,
        content || description,
      ]);

      res.json({
        success: true,
        message: 'Post created',
        post_id: result.insertId,
        post: {
          post_id: result.insertId,
          user_id,
          title,
          content: content || description,
          created_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Get all posts
  router.get('/', async (_req, res) => {
    try {
      const [results] = await db.execute(
        'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id ORDER BY p.created_at DESC LIMIT 100'
      );
      res.json(results);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // Get post by ID
  router.get('/:post_id', async (req, res) => {
    try {
      const { post_id } = req.params;
      const [results] = await db.execute(
        'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id WHERE p.post_id = ?',
        [post_id]
      );

      if (results.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json(results[0]);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  // Update post
  router.put('/:post_id', async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id, title, content, description } = req.body;

      const [result] = await db.execute('UPDATE posts SET title = ?, content = ? WHERE post_id = ? AND user_id = ?', [
        title,
        content || description,
        post_id,
        user_id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Post not found or unauthorized' });
      }

      res.json({ success: true, message: 'Post updated' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  });

  // Delete post
  router.delete('/:post_id', async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id } = req.body;

      const [result] = await db.execute('DELETE FROM posts WHERE post_id = ? AND user_id = ?', [post_id, user_id]);

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'Post not found or unauthorized' });
      }

      res.json({ success: true, message: 'Post deleted' });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  return router;
};
