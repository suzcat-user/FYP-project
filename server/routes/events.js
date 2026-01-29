const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // TEST ENDPOINT: Manually insert into user_communities
  router.post('/test-join-community', async (req, res) => {
    try {
      const { user_id, community_id } = req.body;
      
      console.log(`[TEST] Attempting to insert into user_communities: user_id=${user_id}, community_id=${community_id}`);
      
      const result = await db.query(
        'INSERT IGNORE INTO user_communities (user_id, community_id) VALUES (?, ?)',
        [user_id, community_id]
      );
      
      console.log(`[TEST] Insert result:`, result);
      
      // Check if it was actually inserted
      const [check] = await db.query(
        'SELECT * FROM user_communities WHERE user_id = ? AND community_id = ?',
        [user_id, community_id]
      );
      
      console.log(`[TEST] Verification - records found:`, check.length);
      
      res.json({ 
        success: true, 
        result: result,
        verification: check
      });
    } catch (error) {
      console.error('[TEST] Error:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });

  // TEST ENDPOINT: Check events and communities
  router.get('/test-check-data', async (req, res) => {
    try {
      const [events] = await db.query('SELECT event_id, community_id, title FROM events LIMIT 5');
      const [communities] = await db.query('SELECT * FROM communities');
      const [userComms] = await db.query('SELECT * FROM user_communities LIMIT 10');
      
      console.log(`[TEST] Events:`, events);
      console.log(`[TEST] Communities:`, communities);
      console.log(`[TEST] User Communities:`, userComms);
      
      res.json({
        events,
        communities,
        user_communities: userComms
      });
    } catch (error) {
      console.error('[TEST] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

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
      let { user_id, event_id } = req.body;

      // Convert to integers if they're strings
      user_id = parseInt(user_id, 10);
      event_id = parseInt(event_id, 10);

      console.log(`[DEBUG] Join event request - user_id: ${user_id}, event_id: ${event_id}`);

      // Validate inputs
      if (!user_id || isNaN(user_id) || !event_id || isNaN(event_id)) {
        return res.status(400).json({ error: 'user_id and event_id must be valid integers' });
      }

      // Check if event exists and get points reward and community_id
      const [event] = await db.query('SELECT points_reward, community_id FROM events WHERE event_id = ?', [event_id]);
      if (event.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const pointsReward = event[0].points_reward;
      const communityId = event[0].community_id;
      
      console.log(`[DEBUG] Event found - points: ${pointsReward}, community_id: ${communityId}`);

      // Check if user already joined with status 'joined'
      const [existing] = await db.query(
        'SELECT participation_id FROM user_event_participation WHERE user_id = ? AND event_id = ? AND status = ?',
        [user_id, event_id, 'joined']
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'User already joined this event' });
      }

      // Check if user has a cancelled record and update it, or insert new one
      const [cancelled] = await db.query(
        'SELECT participation_id FROM user_event_participation WHERE user_id = ? AND event_id = ? AND status = ?',
        [user_id, event_id, 'cancelled']
      );

      if (cancelled.length > 0) {
        // Update cancelled record to joined
        await db.query(
          'UPDATE user_event_participation SET status = ? WHERE user_id = ? AND event_id = ?',
          ['joined', user_id, event_id]
        );
        console.log(`[DEBUG] Updated cancelled participation to joined`);
      } else {
        // Create new participation record
        await db.query(
          'INSERT INTO user_event_participation (user_id, event_id, status) VALUES (?, ?, ?)',
          [user_id, event_id, 'joined']
        );
        console.log(`[DEBUG] Created new participation record`);
      }

      // Also add user to the community (for the My Communities page)
      if (communityId) {
        try {
          const result = await db.query(
            'INSERT IGNORE INTO user_communities (user_id, community_id) VALUES (?, ?)',
            [user_id, communityId]
          );
          console.log(`[DEBUG] Inserted into user_communities - user_id: ${user_id}, community_id: ${communityId}`, result);
        } catch (communityError) {
          console.error(`[DEBUG] Error inserting into user_communities:`, communityError);
        }
      } else {
        console.log(`[DEBUG] No community_id found for this event`);
      }

      // Update user score
      await db.query(
        'UPDATE users SET score = score + ? WHERE user_id = ?',
        [pointsReward, user_id]
      );

      console.log(`[DEBUG] Updated user score by ${pointsReward}`);

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
      let { user_id, event_id } = req.body;

      // Convert to integers if they're strings
      user_id = parseInt(user_id, 10);
      event_id = parseInt(event_id, 10);

      if (!user_id || isNaN(user_id) || !event_id || isNaN(event_id)) {
        return res.status(400).json({ error: 'user_id and event_id must be valid integers' });
      }

      // Get points reward and community_id to reverse it
      const [event] = await db.query('SELECT points_reward, community_id FROM events WHERE event_id = ?', [event_id]);
      if (event.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const pointsReward = event[0].points_reward;
      const communityId = event[0].community_id;

      // Mark participation as cancelled
      await db.query(
        'UPDATE user_event_participation SET status = ? WHERE user_id = ? AND event_id = ?',
        ['cancelled', user_id, event_id]
      );

      // Check if user has any other joined events in this community
      if (communityId) {
        const [otherEvents] = await db.query(
          `SELECT COUNT(*) as count FROM user_event_participation uep
           JOIN events e ON uep.event_id = e.event_id
           WHERE uep.user_id = ? AND e.community_id = ? AND uep.status = 'joined'`,
          [user_id, communityId]
        );

        // If no more joined events in this community, remove from user_communities
        if (otherEvents[0].count === 0) {
          await db.query(
            'DELETE FROM user_communities WHERE user_id = ? AND community_id = ?',
            [user_id, communityId]
          );
        }
      }

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
