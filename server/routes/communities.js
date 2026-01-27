// Communities API routes for MySQL
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get all communities
  router.get('/', async (req, res) => {
    try {
      const [communities] = await db.execute(
      'SELECT * FROM communities ORDER BY name'
    );
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get community by ID
router.get('/:community_id', async (req, res) => {
  try {
    const { community_id } = req.params;
    
    const [communities] = await db.execute(
      'SELECT * FROM communities WHERE community_id = ?',
      [community_id]
    );
    
    if (communities.length === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }
    
    res.json(communities[0]);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// Get communities for a personality type
router.get('/personality/:personality_code', async (req, res) => {
  try {
    const { personality_code } = req.params;
    
    const [communities] = await db.execute(
      `SELECT c.*, pcm.is_primary 
       FROM communities c
       JOIN personality_community_mapping pcm ON c.community_id = pcm.community_id
       WHERE pcm.personality_code = ?
       ORDER BY pcm.is_primary DESC, c.name`,
      [personality_code.toUpperCase()]
    );
    
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities for personality:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get communities for a user based on their quiz results
router.get('/user/:user_id/recommended', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Get the user's most common personality traits from their answers
    const [traits] = await db.execute(
      `SELECT trait_awarded, COUNT(*) as count
       FROM user_answers
       WHERE user_id = ? AND trait_awarded IS NOT NULL
       GROUP BY trait_awarded
       ORDER BY count DESC
       LIMIT 3`,
      [user_id]
    );
    
    if (traits.length === 0) {
      return res.json([]);
    }
    
    // Get communities for these personality types
    const personalityCodes = traits.map(t => t.trait_awarded);
    const placeholders = personalityCodes.map(() => '?').join(',');
    
    const [communities] = await db.execute(
      `SELECT DISTINCT c.*, pcm.is_primary
       FROM communities c
       JOIN personality_community_mapping pcm ON c.community_id = pcm.community_id
       WHERE pcm.personality_code IN (${placeholders})
       ORDER BY pcm.is_primary DESC, c.name`,
      personalityCodes
    );
    
    res.json(communities);
  } catch (error) {
    console.error('Error fetching recommended communities:', error);
    res.status(500).json({ error: 'Failed to fetch recommended communities' });
  }
});

  return router;
};
