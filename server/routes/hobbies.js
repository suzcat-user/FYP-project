const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Debug endpoint - Get all communities and user communities
  router.get('/debug/communities/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      
      // Get all communities
      const [allComms] = await db.query('SELECT * FROM communities');
      
      // Get user's communities
      const [userComms] = await db.query(
        'SELECT uc.*, c.name FROM user_communities uc LEFT JOIN communities c ON uc.community_id = c.community_id WHERE uc.user_id = ?',
        [user_id]
      );
      
      // Get user's events
      const [userEvents] = await db.query(
        `SELECT e.event_id, e.community_id, e.title, c.name as community_name, uep.status 
         FROM user_event_participation uep
         JOIN events e ON uep.event_id = e.event_id
         LEFT JOIN communities c ON e.community_id = c.community_id
         WHERE uep.user_id = ?`,
        [user_id]
      );
      
      res.json({ 
        user_id,
        all_communities: allComms,
        user_communities: userComms,
        user_events: userEvents
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's hobbies/communities they have joined (more specific - must be before /:code)
  router.get('/user/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      
      console.log(`[DEBUG] Fetching communities for user ${user_id}`);
      
      // First get the communities the user has joined
      const [userCommunities] = await db.query(
        `SELECT uc.community_id, c.name, c.description 
         FROM user_communities uc
         JOIN communities c ON uc.community_id = c.community_id
         WHERE uc.user_id = ?`,
        [user_id]
      );
      
      console.log(`[DEBUG] Found ${userCommunities.length} communities for user ${user_id}:`, userCommunities.map(c => c.name));
      
      if (userCommunities.length === 0) {
        return res.json([]);
      }
      
      // Now get hobbies that belong to these communities
      const communityIds = userCommunities.map(c => c.community_id);
      const placeholders = communityIds.map(() => '?').join(',');
      
      const [hobbies] = await db.query(
        `SELECT DISTINCT h.hobby_id, h.name, h.description, h.personality_code, p.emoji
         FROM hobbies h
         JOIN personality_types p ON h.personality_code = p.personality_code
         WHERE h.community_id IN (${placeholders})
         ORDER BY h.name`,
        communityIds
      );
      
      console.log(`[DEBUG] Fetched ${hobbies.length} hobbies for these communities`);
      res.json(hobbies);
    } catch (error) {
      console.error('Error fetching user hobbies:', error);
      res.status(500).json({ error: 'Failed to fetch user hobbies', details: error.message });
    }
  });

  // Leave a hobby/community (remove user from community and related events)
  router.delete('/user/:user_id/:hobby_id', async (req, res) => {
    try {
      const { user_id, hobby_id } = req.params;
      
      // Get the community_id for this hobby
      const [hobby] = await db.query(
        'SELECT community_id FROM hobbies WHERE hobby_id = ?',
        [hobby_id]
      );
      
      if (hobby.length === 0) {
        return res.status(404).json({ error: 'Hobby not found' });
      }

      const communityId = hobby[0].community_id;

      // Get all events in this community that the user joined and sum their points
      const [events] = await db.query(
        `SELECT SUM(e.points_reward) as total_points FROM events e
         WHERE e.community_id = ? AND e.event_id IN (
           SELECT event_id FROM user_event_participation 
           WHERE user_id = ? AND status = 'joined'
         )`,
        [communityId, user_id]
      );

      const totalPoints = events[0].total_points || 0;

      // Remove user from the community
      await db.query(
        'DELETE FROM user_communities WHERE user_id = ? AND community_id = ?',
        [user_id, communityId]
      );

      // Also remove from all events in this community
      await db.query(
        `UPDATE user_event_participation SET status = 'cancelled'
         WHERE user_id = ? AND event_id IN (
           SELECT event_id FROM events WHERE community_id = ?
         ) AND status = 'joined'`,
        [user_id, communityId]
      );

      // Deduct the points from user score
      if (totalPoints > 0) {
        await db.query(
          'UPDATE users SET score = score - ? WHERE user_id = ?',
          [totalPoints, user_id]
        );
      }

      res.json({ success: true, message: 'Left hobby community', points_deducted: totalPoints });
    } catch (error) {
      console.error('Error leaving hobby:', error);
      res.status(500).json({ error: 'Failed to leave hobby' });
    }
  });

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
