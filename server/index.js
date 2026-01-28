const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
// Enable CORS for all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize MySQL pool (promise API)
async function start() {
  try {
    const db = await mysql.createPool({
      host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_xREgo-7cfTkD9oJUroh',
      port: 23353,
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    db.on('connection', (connection) => {
      connection.query('SET time_zone = "+08:00"');
    });

    await db.query('SET time_zone = "+08:00"');
    await db.query('SELECT 1');
    console.log('✅ Connected to MySQL database: fypdatabase');

    // Import routes
    console.log('Importing routes...');
    const userRoutes = require('./routes/users');
    console.log('✓ User routes imported');
    const answersRoutes = require('./routes/answers');
    console.log('✓ Answers routes imported');
    const postsRoutes = require('./routes/posts');
    console.log('✓ Posts routes imported');
    const commentsRoutes = require('./routes/comments');
    console.log('✓ Comments routes imported');
    const questionsRoutes = require('./routes/questions');
    console.log('✓ Questions routes imported');
    const gameQuestionsRoutes = require('./routes/game-questions');
    console.log('✓ Game questions routes imported');
    const uploadsRoutes = require('./routes/uploads');
    console.log('✓ Uploads routes imported');
    const hobbiesRoutes = require('./routes/hobbies');
    console.log('✓ Hobbies routes imported');
    const eventsRoutes = require('./routes/events');
    console.log('✓ Events routes imported');

    // Mount routes with promise pool
    console.log('Mounting routes...');
    app.use('/api/users', userRoutes(db));
    app.use('/api/answers', answersRoutes(db));
    app.use('/api/posts', postsRoutes(db));
    app.use('/api/comments', commentsRoutes(db));
    app.use('/api/questions', questionsRoutes(db));
    app.use('/api/game-questions', gameQuestionsRoutes(db));
    app.use('/api/uploads', uploadsRoutes(db));
    app.use('/api/hobbies', hobbiesRoutes(db));
    app.use('/api/events', eventsRoutes(db));
    console.log('✓ All routes mounted');

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Server is running!' });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

start();
