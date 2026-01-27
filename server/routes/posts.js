const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Create a post
  router.post('/', async (req, res) => {
    try {
      const { user_id, title, content, description, community_id, image_urls } = req.body;

      if (!user_id || !title || !content || !community_id) {
        return res.status(400).json({ error: 'user_id, community_id, title, and content are required' });
      }

      const normalizedImages = Array.isArray(image_urls) && image_urls.length
        ? JSON.stringify(image_urls)
        : null;

      const [result] = await db.execute('INSERT INTO posts (user_id, community_id, title, content, image_urls) VALUES (?, ?, ?, ?, ?)', [
        user_id,
        community_id,
        title,
        content || description,
        normalizedImages,
      ]);

      res.json({
        success: true,
        message: 'Post created',
        post_id: result.insertId,
        post: {
          post_id: result.insertId,
          user_id,
          community_id,
          title,
          content: content || description,
          image_urls: normalizedImages,
          created_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Get all posts
  router.get('/', async (req, res) => {
    try {
      const { community_id } = req.query;
      if (community_id) {
        const [results] = await db.execute(
          'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id WHERE p.community_id = ? ORDER BY p.created_at DESC LIMIT 100',
          [community_id]
        );
        return res.json(results);
      }

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

  // Get post image by ID
  router.get('/:post_id/images/:image_id', async (req, res) => {
    try {
      const { post_id, image_id } = req.params;
      const [rows] = await db.execute(
        'SELECT mime_type, image_data FROM post_images WHERE post_id = ? AND image_id = ? LIMIT 1',
        [post_id, image_id]
      );

      if (!rows.length) {
        return res.status(404).json({ error: 'Image not found' });
      }

      const { mime_type, image_data } = rows[0];
      res.setHeader('Content-Type', mime_type);
      res.send(image_data);
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch image' });
    }
  });

  // Update post
  router.put('/:post_id', async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id, title, content, description, image_urls } = req.body;

      const normalizedImages = Array.isArray(image_urls) && image_urls.length
        ? JSON.stringify(image_urls)
        : null;

      const [result] = await db.execute('UPDATE posts SET title = ?, content = ?, image_urls = ? WHERE post_id = ? AND user_id = ?', [
        title,
        content || description,
        normalizedImages,
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

      await db.execute('DELETE FROM post_images WHERE post_id = ?', [post_id]);

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
