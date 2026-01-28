const mysql = require('mysql2/promise');

async function addArtsEvent() {
  const db = await mysql.createPool({
    host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_xREgo-7cfTkD9oJUroh',
    port: 23353,
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false },
  });

  try {
    const [comm] = await db.query('SELECT community_id FROM communities WHERE name = ?', ['Arts']);
    
    if (comm.length > 0) {
      const communityId = comm[0].community_id;
      const eventDate = new Date(Date.now() + 11*24*60*60*1000).toISOString().split('T')[0];
      
      await db.query(`
        INSERT INTO events (community_id, title, description, event_date, event_time, location, points_reward)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [communityId, 'Drawing & Sketching Class', 'Improve your drawing skills with professional artists', eventDate, '15:00:00', 'Art Gallery', 18]);
      
      console.log('✅ Added Drawing & Sketching Class to Arts community');
    }
    
    const [final] = await db.query(`
      SELECT c.name, COUNT(e.event_id) as event_count
      FROM communities c
      LEFT JOIN events e ON c.community_id = e.community_id
      GROUP BY c.community_id, c.name
      ORDER BY c.name
    `);
    
    console.log('\n✅ Final event distribution:');
    final.forEach(c => console.log(`  • ${c.name}: ${c.event_count} events`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addArtsEvent();
