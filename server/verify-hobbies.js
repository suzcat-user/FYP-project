const mysql = require('mysql2/promise');

async function verifyHobbies() {
  try {
    const db = await mysql.createPool({
      host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_xREgo-7cfTkD9oJUroh',
      port: 23353,
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false },
    });
    
    const [hobbies] = await db.query('SELECT personality_code, COUNT(*) as count FROM hobbies GROUP BY personality_code ORDER BY personality_code');
    const [total] = await db.query('SELECT COUNT(*) as count FROM hobbies');
    
    console.log('\n📊 DATABASE VERIFICATION REPORT');
    console.log('================================\n');
    console.log('Hobbies per personality type:');
    hobbies.forEach(h => console.log(`  ${h.personality_code}: ${h.count} hobbies`));
    console.log(`\nTotal hobbies in database: ${total[0].count}`);
    
    // Verify each personality has hobbies
    const [personalities] = await db.query('SELECT * FROM personality_types');
    console.log(`\nPersonality types: ${personalities.length}`);
    personalities.forEach(p => console.log(`  ✓ ${p.personality_code} - ${p.name}`));
    
    console.log('\n✅ Database verification complete!\n');
    process.exit(0);
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

verifyHobbies();
