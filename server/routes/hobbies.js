const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all personality types with their hobbies
  router.get('/', async (req, res) => {
    try {
      // Get all personality types
      const [personalities] = await db.query('SELECT * FROM personality_types ORDER BY personality_code');
      
      // Get all hobbies
      const [hobbies] = await db.query('SELECT * FROM hobbies ORDER BY personality_code, hobby_id');
      
      // Get all communities
      const [communities] = await db.query('SELECT * FROM personality_communities ORDER BY personality_code');
      
      // Group hobbies and communities by personality
      const result = personalities.map(p => ({
        code: p.personality_code,
        name: p.name,
        emoji: p.emoji,
        description: p.description,
        communities: communities
          .filter(c => c.personality_code === p.personality_code)
          .map(c => c.community_name),
        hobbies: hobbies
          .filter(h => h.personality_code === p.personality_code)
          .map(h => ({
            name: h.name,
            description: h.description,
            communityId: h.community_id
          }))
      }));
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching hobbies:', error);
      res.status(500).json({ error: 'Failed to fetch hobbies' });
    }
  });

  // Get hobbies by personality code
  router.get('/personality/:code', async (req, res) => {
    try {
      const { code } = req.params;
      
      // Get personality type
      const [personalities] = await db.query(
        'SELECT * FROM personality_types WHERE personality_code = ?',
        [code.toUpperCase()]
      );
      
      if (personalities.length === 0) {
        return res.status(404).json({ error: 'Personality type not found' });
      }
      
      const personality = personalities[0];
      
      // Get hobbies for this personality
      const [hobbies] = await db.query(
        'SELECT * FROM hobbies WHERE personality_code = ? ORDER BY hobby_id',
        [code.toUpperCase()]
      );
      
      // Get communities for this personality
      const [communities] = await db.query(
        'SELECT community_name FROM personality_communities WHERE personality_code = ?',
        [code.toUpperCase()]
      );
      
      res.json({
        code: personality.personality_code,
        name: personality.name,
        emoji: personality.emoji,
        description: personality.description,
        communities: communities.map(c => c.community_name),
        hobbies: hobbies.map(h => ({
          name: h.name,
          description: h.description,
          communityId: h.community_id
        }))
      });
    } catch (error) {
      console.error('Error fetching hobbies by personality:', error);
      res.status(500).json({ error: 'Failed to fetch hobbies' });
    }
  });

  // Get a single hobby by name
  router.get('/hobby/:name', async (req, res) => {
    try {
      const { name } = req.params;
      
      const [hobbies] = await db.query(
        'SELECT h.*, p.name as personality_name, p.emoji FROM hobbies h JOIN personality_types p ON h.personality_code = p.personality_code WHERE LOWER(h.name) = LOWER(?)',
        [name]
      );
      
      if (hobbies.length === 0) {
        return res.status(404).json({ error: 'Hobby not found' });
      }
      
      const hobby = hobbies[0];
      res.json({
        name: hobby.name,
        description: hobby.description,
        communityId: hobby.community_id,
        personalityCode: hobby.personality_code,
        personalityName: hobby.personality_name,
        emoji: hobby.emoji
      });
    } catch (error) {
      console.error('Error fetching hobby:', error);
      res.status(500).json({ error: 'Failed to fetch hobby' });
    }
  });

  return router;
};
