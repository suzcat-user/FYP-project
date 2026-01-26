const mysql = require('mysql2');

// Connect to Aiven MySQL
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
    console.error('Connection failed:', err);
    return;
  }
  console.log('✅ Connected to Aiven MySQL');

  // Create users table
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255),
      password_hash VARCHAR(255),
      score INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create user_answers table
  const answersTable = `
    CREATE TABLE IF NOT EXISTS user_answers (
      answer_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      game_type VARCHAR(50) NOT NULL,
      question_id INT,
      answer_choice TEXT,
      trait_awarded VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  // Create posts table
  const postsTable = `
    CREATE TABLE IF NOT EXISTS posts (
      post_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      community_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  // Create comments table
  const commentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      comment_id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  // Execute all table creations
  db.query(usersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('✅ Users table created');
  });

  db.query(answersTable, (err) => {
    if (err) {
      console.error('Error creating user_answers table:', err);
      return;
    }
    console.log('✅ User answers table created');
  });

  db.query(postsTable, (err) => {
    if (err) {
      console.error('Error creating posts table:', err);
      return;
    }
    console.log('✅ Posts table created');
  });

  db.query(commentsTable, (err) => {
    if (err) {
      console.error('Error creating comments table:', err);
      db.end();
      return;
    }
    console.log('✅ Comments table created');
    console.log('\n✅ All tables created successfully!');
    db.end();
  });
});
