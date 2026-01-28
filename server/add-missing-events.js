const mysql = require('mysql2/promise');

async function addMissingEvents() {
  const db = await mysql.createPool({
    host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_xREgo-7cfTkD9oJUroh',
    port: 23353,
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 Adding missing events to communities...\n');

    // Check which communities have events
    const [communitiesData] = await db.query(`
      SELECT c.community_id, c.name, COUNT(e.event_id) as event_count
      FROM communities c
      LEFT JOIN events e ON c.community_id = e.community_id
      GROUP BY c.community_id, c.name
      ORDER BY c.name
    `);

    console.log('📊 Current event distribution:');
    communitiesData.forEach(comm => {
      console.log(`  • ${comm.name}: ${comm.event_count} events`);
    });

    // Events to add for communities that need them
    const eventsToAdd = [
      {
        community_name: 'Music',
        events: [
          {
            title: 'Weekly Jam Session',
            description: 'Come jam with fellow musicians and discover new sounds',
            event_date: new Date(Date.now() + 6*24*60*60*1000).toISOString().split('T')[0],
            event_time: '19:00:00',
            location: 'Music Studio',
            points_reward: 20
          },
          {
            title: 'Open Mic Night',
            description: 'Showcase your musical talent and perform in front of an audience',
            event_date: new Date(Date.now() + 12*24*60*60*1000).toISOString().split('T')[0],
            event_time: '20:00:00',
            location: 'Local Venue',
            points_reward: 25
          }
        ]
      },
      {
        community_name: 'Crafts',
        events: [
          {
            title: 'DIY Crafts Workshop',
            description: 'Learn to create beautiful handmade crafts and decorations',
            event_date: new Date(Date.now() + 9*24*60*60*1000).toISOString().split('T')[0],
            event_time: '14:00:00',
            location: 'Craft Studio',
            points_reward: 18
          },
          {
            title: 'Pottery & Ceramics Session',
            description: 'Explore the art of pottery and create your own masterpiece',
            event_date: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
            event_time: '16:00:00',
            location: 'Pottery Workshop',
            points_reward: 22
          }
        ]
      }
    ];

    // Add events
    console.log('\n➕ Adding events...');
    for (const communityGroup of eventsToAdd) {
      const [comm] = await db.query('SELECT community_id FROM communities WHERE name = ?', [communityGroup.community_name]);
      
      if (comm.length > 0) {
        const communityId = comm[0].community_id;
        
        // Check how many events this community already has
        const [existingEvents] = await db.query('SELECT COUNT(*) as count FROM events WHERE community_id = ?', [communityId]);
        
        if (existingEvents[0].count === 0) {
          console.log(`\n  📍 ${communityGroup.community_name}:`);
          for (const event of communityGroup.events) {
            await db.query(`
              INSERT INTO events (community_id, title, description, event_date, event_time, location, points_reward)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [communityId, event.title, event.description, event.event_date, event.event_time, event.location, event.points_reward]);
            console.log(`    ✅ Added: "${event.title}"`);
          }
        } else {
          console.log(`\n  ℹ️  ${communityGroup.community_name} already has ${existingEvents[0].count} event(s)`);
        }
      }
    }

    // Show final distribution
    console.log('\n\n📊 Final event distribution:');
    const [finalData] = await db.query(`
      SELECT c.community_id, c.name, COUNT(e.event_id) as event_count
      FROM communities c
      LEFT JOIN events e ON c.community_id = e.community_id
      GROUP BY c.community_id, c.name
      ORDER BY c.name
    `);

    finalData.forEach(comm => {
      console.log(`  ✅ ${comm.name}: ${comm.event_count} events`);
    });

    console.log('\n✅ All communities now have events!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding events:', error.message);
    process.exit(1);
  }
}

addMissingEvents();
