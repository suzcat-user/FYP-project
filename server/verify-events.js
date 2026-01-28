const mysql = require('mysql2/promise');

async function verifyEvents() {
  try {
    const db = await mysql.createPool({
      host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_xREgo-7cfTkD9oJUroh',
      port: 23353,
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false },
    });
    
    console.log('\n📊 EVENTS SYSTEM VERIFICATION\n');
    console.log('================================\n');

    // Check communities
    const [communities] = await db.query('SELECT * FROM communities');
    console.log(`Communities: ${communities.length}`);
    communities.forEach(c => console.log(`  ✓ ${c.name}`));

    // Check events
    const [events] = await db.query(`
      SELECT e.*, c.name as community_name, COUNT(uep.participation_id) as participant_count
      FROM events e
      LEFT JOIN communities c ON e.community_id = c.community_id
      LEFT JOIN user_event_participation uep ON e.event_id = uep.event_id AND uep.status = 'joined'
      GROUP BY e.event_id
      ORDER BY e.event_date
    `);
    console.log(`\nEvents: ${events.length}`);
    events.forEach(e => console.log(`  ✓ ${e.title} (${e.community_name}) - ${e.points_reward} pts`));

    // Check tables exist
    const [tables] = await db.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'defaultdb' 
      AND TABLE_NAME IN ('events', 'user_event_participation', 'user_communities')
    `);
    console.log(`\nDatabase Tables: ${tables.length}/3`);
    tables.forEach(t => console.log(`  ✓ ${t.TABLE_NAME}`));

    console.log('\n✅ Events system is ready!\n');
    db.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyEvents();
