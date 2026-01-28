const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
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

    await db.query('SELECT 1');
    console.log('✅ Connected to MySQL database: fypdatabase');

    // Import routes
    const userRoutes = require('./routes/users');
    const answersRoutes = require('./routes/answers');
    const postsRoutes = require('./routes/posts');
    const commentsRoutes = require('./routes/comments');
    const questionsRoutes = require('./routes/questions');
    const gameQuestionsRoutes = require('./routes/game-questions');
    const uploadsRoutes = require('./routes/uploads');
    const hobbiesRoutes = require('./routes/hobbies');
    const eventsRoutes = require('./routes/events');

    // Mount routes with promise pool
    app.use('/api/users', userRoutes(db));
    app.use('/api/answers', answersRoutes(db));
    app.use('/api/posts', postsRoutes(db));
    app.use('/api/comments', commentsRoutes(db));
    app.use('/api/questions', questionsRoutes(db));
    app.use('/api/game-questions', gameQuestionsRoutes(db));
    app.use('/api/uploads', uploadsRoutes(db));
    app.use('/api/hobbies', hobbiesRoutes(db));
    app.use('/api/events', eventsRoutes(db));

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Server is running!' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

start();
