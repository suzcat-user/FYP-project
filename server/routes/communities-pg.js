// Communities API routes for PostgreSQL
const express = require('express');
const router = express.Router();

// Get all communities
router.get('/', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const result = await pool.query(
      'SELECT * FROM communities ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get community by ID
router.get('/:community_id', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { community_id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM communities WHERE community_id = $1',
      [community_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// Get communities for a personality type
router.get('/personality/:personality_code', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { personality_code } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, pcm.is_primary 
       FROM communities c
       JOIN personality_community_mapping pcm ON c.community_id = pcm.community_id
       WHERE pcm.personality_code = $1
       ORDER BY pcm.is_primary DESC, c.name`,
      [personality_code.toUpperCase()]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching communities for personality:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get communities for a user based on their quiz results
router.get('/user/:user_id/recommended', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { user_id } = req.params;
    
    // Get the user's most common personality traits from their answers
    const traitsResult = await pool.query(
      `SELECT trait_awarded, COUNT(*) as count
       FROM user_answers
       WHERE user_id = $1 AND trait_awarded IS NOT NULL
       GROUP BY trait_awarded
       ORDER BY count DESC
       LIMIT 3`,
      [user_id]
    );
    
    if (traitsResult.rows.length === 0) {
      return res.json([]);
    }
    
    // Get communities for these personality types
    const personalityCodes = traitsResult.rows.map(t => t.trait_awarded);
    const placeholders = personalityCodes.map((_, i) => `$${i + 1}`).join(',');
    
    const communitiesResult = await pool.query(
      `SELECT DISTINCT c.*, pcm.is_primary
       FROM communities c
       JOIN personality_community_mapping pcm ON c.community_id = pcm.community_id
       WHERE pcm.personality_code IN (${placeholders})
       ORDER BY pcm.is_primary DESC, c.name`,
      personalityCodes
    );
    
    res.json(communitiesResult.rows);
  } catch (error) {
    console.error('Error fetching recommended communities:', error);
    res.status(500).json({ error: 'Failed to fetch recommended communities' });
  }
});

module.exports = router;
