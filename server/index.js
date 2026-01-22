const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection - Aiven Cloud
const db = mysql.createConnection({
  host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_xREgo-7cfTkD9oJUroh',
  port: 23353,
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database: fypdatabase');
});

// Import routes
const userRoutes = require('./routes/users');
const answersRoutes = require('./routes/answers');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

app.use('/api/users', userRoutes(db));
app.use('/api/answers', answersRoutes(db));
app.use('/api/posts', postsRoutes(db));
app.use('/api/comments', commentsRoutes(db));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
