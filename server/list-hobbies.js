const mysql = require('mysql2/promise');

async function listAllHobbies() {
  try {
    const db = await mysql.createPool({
      host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_xREgo-7cfTkD9oJUroh',
      port: 23353,
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false },
    });
    
    const [result] = await db.query('SELECT name, personality_code FROM hobbies ORDER BY personality_code, hobby_id');
    console.log(`\nTotal hobbies in database: ${result.length}\n`);
    
    let currentCode = '';
    result.forEach((r, i) => {
      if (r.personality_code !== currentCode) {
        currentCode = r.personality_code;
        console.log(`\n${currentCode}:`);
      }
      console.log(`  ${i+1}. ${r.name}`);
    });
    
    db.end();
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

listAllHobbies();
