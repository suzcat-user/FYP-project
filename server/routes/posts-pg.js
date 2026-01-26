const express = require('express');
const pool = require('../aiven-db');

const router = express.Router();

// Create a post
router.post('/', async (req, res) => {
  const { user_id, title, content, description, community_id } = req.body;

  if (!user_id || !title || !content || !community_id) {
    return res.status(400).json({ error: 'user_id, community_id, title, and content are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, community_id, title, content) VALUES ($1, $2, $3, $4) RETURNING post_id',
      [user_id, community_id, title, content || description]
    );

    res.json({
      success: true,
      message: 'Post created',
      post_id: result.rows[0].post_id,
      post: {
        post_id: result.rows[0].post_id,
        user_id,
        community_id,
        title,
        content: content || description,
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { community_id } = req.query;
    if (community_id) {
      const result = await pool.query(
        'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id WHERE p.community_id = $1 ORDER BY p.created_at DESC LIMIT 100',
        [community_id]
      );
      return res.json(result.rows);
    }

    const result = await pool.query(
      'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id ORDER BY p.created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get post by ID
router.get('/:post_id', async (req, res) => {
  const { post_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.user_id WHERE p.post_id = $1',
      [post_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update post
router.put('/:post_id', async (req, res) => {
  const { post_id } = req.params;
  const { user_id, title, content, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE post_id = $3 AND user_id = $4',
      [title, content || description, post_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Post not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Post updated'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:post_id', async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.body;

  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE post_id = $1 AND user_id = $2',
      [post_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Post not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Post deleted'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
