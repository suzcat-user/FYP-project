const pool = require('./aiven-db');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        console.log('📦 Setting up PostgreSQL database...');
        
        const schema = fs.readFileSync(path.join(__dirname, 'schema-postgres.sql'), 'utf8');
        
        await pool.query(schema);
        
        console.log('✅ Database schema created successfully!');
        console.log('✅ Tables: users, user_answers, posts, comments');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
