const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get all events
  router.get('/', async (req, res) => {
    try {
      const [events] = await db.query(`
        SELECT 
          e.*,
          c.name as community_name,
          COUNT(uep.participation_id) as participant_count
        FROM events e
        JOIN communities c ON e.community_id = c.community_id
        LEFT JOIN user_event_participation uep ON e.event_id = uep.event_id AND uep.status = 'joined'
        GROUP BY e.event_id
        ORDER BY e.event_date ASC
      `);
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // Get events for a specific community
  router.get('/community/:community_id', async (req, res) => {
    try {
      const { community_id } = req.params;
      const [events] = await db.query(`
        SELECT 
          e.*,
          c.name as community_name,
          COUNT(uep.participation_id) as participant_count
        FROM events e
        JOIN communities c ON e.community_id = c.community_id
        LEFT JOIN user_event_participation uep ON e.event_id = uep.event_id AND uep.status = 'joined'
        WHERE e.community_id = ?
        GROUP BY e.event_id
        ORDER BY e.event_date ASC
      `, [community_id]);
      res.json(events);
    } catch (error) {
      console.error('Error fetching community events:', error);
      res.status(500).json({ error: 'Failed to fetch community events' });
    }
  });

  // Get events user has joined
  router.get('/user/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const [events] = await db.query(`
        SELECT 
          e.*,
          c.name as community_name,
          uep.participation_id,
          uep.joined_at,
          COUNT(uep2.participation_id) as participant_count
        FROM events e
        JOIN communities c ON e.community_id = c.community_id
        JOIN user_event_participation uep ON e.event_id = uep.event_id AND uep.user_id = ? AND uep.status = 'joined'
        LEFT JOIN user_event_participation uep2 ON e.event_id = uep2.event_id AND uep2.status = 'joined'
        GROUP BY e.event_id
        ORDER BY e.event_date ASC
      `, [user_id]);
      res.json(events);
    } catch (error) {
      console.error('Error fetching user events:', error);
      res.status(500).json({ error: 'Failed to fetch user events' });
    }
  });

  // Join an event
  router.post('/join', async (req, res) => {
    try {
      const { user_id, event_id } = req.body;

      // Validate inputs
      if (!user_id || !event_id) {
        return res.status(400).json({ error: 'user_id and event_id are required' });
      }

      // Check if event exists and get points reward
      const [event] = await db.query('SELECT points_reward FROM events WHERE event_id = ?', [event_id]);
      if (event.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const pointsReward = event[0].points_reward;

      // Check if user already joined
      const [existing] = await db.query(
        'SELECT participation_id FROM user_event_participation WHERE user_id = ? AND event_id = ?',
        [user_id, event_id]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'User already joined this event' });
      }

      // Add user to event
      await db.query(
        'INSERT INTO user_event_participation (user_id, event_id) VALUES (?, ?)',
        [user_id, event_id]
      );

      // Update user score
      await db.query(
        'UPDATE users SET score = score + ? WHERE user_id = ?',
        [pointsReward, user_id]
      );

      res.json({ 
        success: true, 
        message: `Event joined! You earned ${pointsReward} points!`,
        points_earned: pointsReward
      });
    } catch (error) {
      console.error('Error joining event:', error);
      res.status(500).json({ error: 'Failed to join event' });
    }
  });

  // Leave an event
  router.post('/leave', async (req, res) => {
    try {
      const { user_id, event_id } = req.body;

      if (!user_id || !event_id) {
        return res.status(400).json({ error: 'user_id and event_id are required' });
      }

      // Get points reward to reverse it
      const [event] = await db.query('SELECT points_reward FROM events WHERE event_id = ?', [event_id]);
      if (event.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const pointsReward = event[0].points_reward;

      // Mark participation as cancelled
      await db.query(
        'UPDATE user_event_participation SET status = ? WHERE user_id = ? AND event_id = ?',
        ['cancelled', user_id, event_id]
      );

      // Reverse user score
      await db.query(
        'UPDATE users SET score = score - ? WHERE user_id = ?',
        [pointsReward, user_id]
      );

      res.json({ 
        success: true, 
        message: `Event left. ${pointsReward} points removed.`,
        points_deducted: pointsReward
      });
    } catch (error) {
      console.error('Error leaving event:', error);
      res.status(500).json({ error: 'Failed to leave event' });
    }
  });

  // Create a new event (admin only)
  router.post('/', async (req, res) => {
    try {
      const { community_id, title, description, event_date, event_time, location, points_reward, created_by } = req.body;

      if (!community_id || !title) {
        return res.status(400).json({ error: 'community_id and title are required' });
      }

      const [result] = await db.query(
        `INSERT INTO events (community_id, title, description, event_date, event_time, location, points_reward, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [community_id, title, description, event_date, event_time, location, points_reward || 10, created_by]
      );

      res.status(201).json({ 
        success: true, 
        event_id: result.insertId,
        message: 'Event created successfully'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  return router;
};
