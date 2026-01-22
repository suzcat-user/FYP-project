const express = require('express');
const cors = require('cors');
const pool = require('./aiven-db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users-pg');
const answersRoutes = require('./routes/answers-pg');
const postsRoutes = require('./routes/posts-pg');
const commentsRoutes = require('./routes/comments-pg');

app.use('/api/users', userRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running with Aiven PostgreSQL!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Using Aiven PostgreSQL database`);
});
