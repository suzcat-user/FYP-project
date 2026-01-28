const mysql = require('mysql2/promise');

async function setupEventsSystem() {
  const db = await mysql.createPool({
    host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_xREgo-7cfTkD9oJUroh',
    port: 23353,
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 Setting up events system...\n');

    // First ensure communities table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS communities (
        community_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_communities_name (name)
      )
    `);
    console.log('✅ Communities table ready');

    // Create events table
    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        community_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        event_time TIME,
        location VARCHAR(255),
        points_reward INT DEFAULT 10,
        max_participants INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
        INDEX idx_events_community_id (community_id),
        INDEX idx_events_date (event_date),
        INDEX idx_events_created_at (created_at)
      )
    `);
    console.log('✅ Events table created');

    // Create user event participation table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_event_participation (
        participation_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('joined', 'cancelled') DEFAULT 'joined',
        UNIQUE KEY unique_user_event (user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
        INDEX idx_participation_user_id (user_id),
        INDEX idx_participation_event_id (event_id),
        INDEX idx_participation_status (status)
      )
    `);
    console.log('✅ User event participation table created');

    // Create user communities table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_communities (
        membership_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        community_id INT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_community (user_id, community_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
        INDEX idx_user_communities_user_id (user_id),
        INDEX idx_user_communities_community_id (community_id)
      )
    `);
    console.log('✅ User communities table created');

    // Get existing communities or create some
    const [communities] = await db.query('SELECT COUNT(*) as count FROM communities');
    
    if (communities[0].count === 0) {
      console.log('\n📝 Inserting sample communities...');
      const communityData = [
        { name: 'Outdoor & Fitness', description: 'For fitness enthusiasts and outdoor lovers' },
        { name: 'Arts', description: 'For creative and artistic souls' },
        { name: 'Crafts', description: 'For those who love hands-on crafting' },
        { name: 'Music', description: 'For music lovers and musicians' },
        { name: 'Culinary', description: 'For food and cooking enthusiasts' }
      ];

      for (const comm of communityData) {
        await db.query('INSERT IGNORE INTO communities (name, description) VALUES (?, ?)', 
          [comm.name, comm.description]);
      }
      console.log('✅ Sample communities inserted');
    }

    // Get existing events or create sample ones
    const [eventCount] = await db.query('SELECT COUNT(*) as count FROM events');
    
    if (eventCount[0].count === 0) {
      console.log('\n📝 Inserting sample events...');
      const sampleEvents = [
        { 
          community_name: 'Outdoor & Fitness',
          title: 'Weekly Fitness Challenge', 
          description: 'Join us for a weekly fitness meetup and competition', 
          event_date: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
          event_time: '18:00:00',
          location: 'Community Gym',
          points_reward: 15
        },
        { 
          community_name: 'Arts',
          title: 'Art Workshop', 
          description: 'Learn new painting techniques from experienced artists',
          event_date: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
          event_time: '19:00:00',
          location: 'Art Studio',
          points_reward: 20
        },
        { 
          community_name: 'Outdoor & Fitness',
          title: 'Nature Trail Walk', 
          description: 'Guided nature walk to observe local flora and fauna',
          event_date: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
          event_time: '08:00:00',
          location: 'Central Park',
          points_reward: 12
        },
        { 
          community_name: 'Culinary',
          title: 'Community Potluck Dinner', 
          description: 'Bring your favorite dish and connect with community members',
          event_date: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
          event_time: '19:30:00',
          location: 'Community Center',
          points_reward: 18
        },
        { 
          community_name: 'Culinary',
          title: 'Cooking Class', 
          description: 'Master the art of cooking with our expert chefs',
          event_date: new Date(Date.now() + 8*24*60*60*1000).toISOString().split('T')[0],
          event_time: '17:00:00',
          location: 'Culinary Academy',
          points_reward: 25
        }
      ];

      for (const event of sampleEvents) {
        const [comm] = await db.query('SELECT community_id FROM communities WHERE name = ?', [event.community_name]);
        if (comm.length > 0) {
          await db.query(`
            INSERT INTO events (community_id, title, description, event_date, event_time, location, points_reward)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [comm[0].community_id, event.title, event.description, event.event_date, event.event_time, event.location, event.points_reward]);
        }
      }
      console.log('✅ Sample events inserted');
    }

    console.log('\n✅ Events system setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up events:', error.message);
    process.exit(1);
  }
}

setupEventsSystem();
