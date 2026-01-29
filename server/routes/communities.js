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
    
    // Get the user's most common personality codes from their answers
    const [traits] = await db.execute(
      `SELECT personality_code, COUNT(*) as count
       FROM user_answers
       WHERE user_id = ? AND personality_code IS NOT NULL
       GROUP BY personality_code
       ORDER BY count DESC
       LIMIT 3`,
      [user_id]
    );
    
    if (traits.length === 0) {
      return res.json([]);
    }
    
    // Get communities for these personality types
    const personalityCodes = traits.map(t => t.personality_code);
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

  // Join a community
  router.post('/join', async (req, res) => {
    try {
      const { user_id, community_id } = req.body;

      if (!user_id || !community_id) {
        return res.status(400).json({ error: 'user_id and community_id are required' });
      }

      console.log(`[Communities] User ${user_id} joining community ${community_id}`);

      // Insert into user_communities with INSERT IGNORE to handle duplicates
      const [result] = await db.execute(
        `INSERT INTO user_communities (user_id, community_id, joined_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE joined_at = NOW()`,
        [user_id, community_id]
      );

      console.log(`[Communities] Join result:`, result);

      res.json({ 
        success: true, 
        message: 'Successfully joined community',
        result 
      });
    } catch (error) {
      console.error('[Communities] Error joining community:', error);
      res.status(500).json({ error: 'Failed to join community' });
    }
  });

  // Check if user is a member of a community
  router.get('/:community_id/member/:user_id', async (req, res) => {
    try {
      const { community_id, user_id } = req.params;

      console.log(`[Communities] Checking membership for user ${user_id} in community ${community_id}`);

      const [rows] = await db.execute(
        `SELECT membership_id FROM user_communities 
         WHERE user_id = ? AND community_id = ?`,
        [user_id, community_id]
      );

      const isMember = rows.length > 0;
      console.log(`[Communities] Membership result:`, { isMember, rows });

      res.json({ isMember });
    } catch (error) {
      console.error('[Communities] Error checking membership:', error);
      res.status(500).json({ error: 'Failed to check membership' });
    }
  });

  // Leave a community
  router.post('/leave', async (req, res) => {
    try {
      const { user_id, community_id } = req.body;

      if (!user_id || !community_id) {
        return res.status(400).json({ error: 'user_id and community_id are required' });
      }

      console.log(`[Communities] User ${user_id} leaving community ${community_id}`);

      const [result] = await db.execute(
        `DELETE FROM user_communities 
         WHERE user_id = ? AND community_id = ?`,
        [user_id, community_id]
      );

      console.log(`[Communities] Leave result:`, result);

      res.json({ 
        success: true, 
        message: 'Successfully left community',
        result 
      });
    } catch (error) {
      console.error('[Communities] Error leaving community:', error);
      res.status(500).json({ error: 'Failed to leave community' });
    }
  });

  return router;
};
