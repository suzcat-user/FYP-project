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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

  // Create game_question_sets table
  const gameQuestionSetsTable = `
    CREATE TABLE IF NOT EXISTS game_question_sets (
      game_name VARCHAR(100) PRIMARY KEY,
      questions JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
      image_urls JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  // Create post_media table (DB stored media)
  const postMediaTable = `
    CREATE TABLE IF NOT EXISTS post_media (
      media_id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      media_data LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
      INDEX idx_post_media_post_id (post_id)
    )
  `;

  // Create emoji catalog table
  const emojiCatalogTable = `
    CREATE TABLE IF NOT EXISTS emoji_catalog (
      emoji_id INT AUTO_INCREMENT PRIMARY KEY,
      emoji VARCHAR(16) NOT NULL UNIQUE
    )
  `;

  // Create gif catalog table
  const gifCatalogTable = `
    CREATE TABLE IF NOT EXISTS gif_catalog (
      gif_id INT AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(512) NOT NULL UNIQUE
    )
  `;

  // Create media catalog table (JSON arrays)
  const mediaCatalogTable = `
    CREATE TABLE IF NOT EXISTS media_catalog (
      catalog_type VARCHAR(16) PRIMARY KEY,
      items JSON NOT NULL
    )
  `;

  // Create comments table
  const commentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      comment_id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      gifs JSON NULL,
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

  db.query(postMediaTable, (err) => {
    if (err) {
      console.error('Error creating post_media table:', err);
      return;
    }
    console.log('✅ Post media table created');
  });

  db.query(emojiCatalogTable, (err) => {
    if (err) {
      console.error('Error creating emoji_catalog table:', err);
      return;
    }
    console.log('✅ Emoji catalog table created');
  });

  db.query(gifCatalogTable, (err) => {
    if (err) {
      console.error('Error creating gif_catalog table:', err);
      return;
    }
    console.log('✅ GIF catalog table created');
  });

  db.query(mediaCatalogTable, (err) => {
    if (err) {
      console.error('Error creating media_catalog table:', err);
      return;
    }
    console.log('✅ Media catalog table created');
  });

  db.query(gameQuestionSetsTable, (err) => {
    if (err) {
      console.error('Error creating game_question_sets table:', err);
      return;
    }
    console.log('✅ Game question sets table created');
  });

    db.query(commentsTable, (err) => {
    if (err) {
      console.error('Error creating comments table:', err);
      db.end();
      return;
    }
    console.log('✅ Comments table created');
    console.log('\n✅ All tables created successfully!');

      const defaultEmojis = [
        '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','😉',
        '😍','😘','😜','🤪','😎','🥳','🤩','😴','🤔','🫡','😤','😭',
        '😮','😱','😬','😷','🤒','🤕','🥶','🥵','🤗','🙃','😵‍💫','😡',
        '🙌','👏','🫶','🙏','🤝','👍','👎','💪','✌️','🤘','👌','🤙',
        '🔥','✨','💥','💫','🌟','🌈','⚡','☀️','🌙','🌧️','❄️','🌊',
        '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💘','💯',
        '🎉','🎊','🎈','🎁','🎂','🎯','🏆','🏅','🎮','🎨','🎵','🎬',
        '📌','📣','📢','📷','📸','🧠','💡','📚','✏️','📝','🧩','🛠️',
        '🚀','🛸','🏝️','🗺️','🍀','🌸','🌻','🍕','🍔','🍟','🍣','☕',
        '🍩','🍪','🍰','🍫','🍿','🥤','🧋','🍹','🍺','🥂','🍎','🍉',
        '🍓','🍒','🍇','🍍','🥑','🥦','🥕','🌽','🌮','🌯','🥗',
        '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸',
        '🐵','🐥','🐧','🐦','🦄','🐢','🐠','🐬','🦋','🐝','🌼','🌺',
        '🏀','⚽','🏈','⚾','🎾','🏐','🏓','🎳','🛼','🚴','🏃','🧘',
        '⌛','⏰','📍','🧭','🧳','🎒','🛍️','🎧','📱','💻','🖥️','🖱️',
        '🔮','🧿','💎','🪄','🧸','🪅','🪩','🎀','🧵','🧶','🧷','🪡',
        '✅','❌','⚠️','❗','❓','➕','➖','➗','✖️','🔔','🔒','🔑'
      ];

      const defaultGifs = [
        "https://media1.tenor.com/m/ULDjjjbmgt4AAAAd/yeyeskies-cynthia-erivo.gif",
        "https://media1.tenor.com/m/pwgQhX123s4AAAAC/cynthia-erivo-shocked.gif",
        "https://media1.tenor.com/m/uxC9pNjuaAIAAAAd/ariana-grande-hair-flip.gif",
        "https://media1.tenor.com/m/Wt1mxxqzC1gAAAAC/phatearl.gif",
        "https://media1.tenor.com/m/dhwxCmcCKAUAAAAd/stan-twitter-nurse-britney.gif",
        "https://media1.tenor.com/m/-t4PlsIvMjkAAAAC/kill-me-shoot-me.gif",
        "https://media1.tenor.com/m/t-Imk589wNcAAAAC/stan-twitter.gif",
        "https://media1.tenor.com/m/T5xyQ6PNiEcAAAAd/stan-twitter.gif",
        "https://media1.tenor.com/m/6COMq6z3l5oAAAAC/bosnov-67.gif",
        "https://media1.tenor.com/m/O-MmXat9u54AAAAC/benson-boone-coachella.gif",
        "https://media1.tenor.com/m/MuL00oOUHpAAAAAC/wicked-glinda-wicked-for-good.gif",
        "https://media1.tenor.com/m/rxjtdE-oKtMAAAAC/little-mermaid-laughing.gif"
      ];

      const emojiValues = defaultEmojis.map(e => [e]);
      const gifValues = defaultGifs.map(g => [g]);

      db.query('INSERT IGNORE INTO emoji_catalog (emoji) VALUES ?', [emojiValues], (emojiErr) => {
        if (emojiErr) {
          console.error('Error seeding emoji_catalog:', emojiErr);
        } else {
          console.log('✅ Seeded emoji catalog');
        }
      });

      db.query('INSERT IGNORE INTO gif_catalog (url) VALUES ?', [gifValues], (gifErr) => {
        if (gifErr) {
          console.error('Error seeding gif_catalog:', gifErr);
        } else {
          console.log('✅ Seeded gif catalog');
        }
      });

      const mediaValues = [
        ['emoji', JSON.stringify(defaultEmojis)],
        ['gif', JSON.stringify(defaultGifs)]
      ];

      db.query('INSERT INTO media_catalog (catalog_type, items) VALUES ? ON DUPLICATE KEY UPDATE items = VALUES(items)', [mediaValues], (mediaErr) => {
        if (mediaErr) {
          console.error('Error seeding media_catalog:', mediaErr);
        } else {
          console.log('✅ Seeded media catalog');
        }
      });

    const wouldYouRatherQuestions = [
      { question: 'Would you rather...', options: ['Build a giant pillow fort', 'Explore a secret garden'], colors: ['bg-[#84D2F6]', 'bg-[#90F1AC]'] },
      { question: 'Would you rather have the power to...', options: ['Talk to animals', 'Invent a flying car'], colors: ['bg-[#F8A07E]', 'bg-[#FDE24F]'] },
      { question: 'How would you spend a free afternoon?', options: ['At a bustling arcade', 'In a cozy library'], colors: ['bg-[#FF8FAB]', 'bg-[#A78BFA]'] },
      { question: 'What would be your dream pet?', options: ['A tiny dragon', 'A loyal robot dog'], colors: ['bg-[#FDE24F]', 'bg-[#90F1AC]'] },
      { question: 'You find a mysterious old map. Do you...', options: ['Follow it immediately', 'Research it at the library first'], colors: ['bg-[#F8A07E]', 'bg-[#A78BFA]'] },
      { question: 'For your birthday party, would you prefer...', options: ['A huge party with all your friends', 'A small gathering with your closest pals'], colors: ['bg-[#FF8FAB]', 'bg-[#84D2F6]'] },
      { question: 'Would you rather have a room that is...', options: ['Perfectly organized and tidy', 'A creative, beautiful mess'], colors: ['bg-[#84D2F6]', 'bg-[#F8A07E]'] },
      { question: "You're directing a movie. It would be...", options: ['A hilarious comedy', 'An epic action-adventure'], colors: ['bg-[#FDE24F]', 'bg-[#F8A07E]'] },
      { question: 'Would you rather have a notebook that...', options: ['Brings your drawings to life', 'Answers any question you write in it'], colors: ['bg-[#F8A07E]', 'bg-[#84D2F6]'] },
      { question: 'Would you rather explore...', options: ['The deepest part of the ocean', 'The farthest reaches of outer space'], colors: ['bg-[#84D2F6]', 'bg-[#333] text-white'] }
    ];

    const seedQuery = `
      INSERT INTO game_question_sets (game_name, questions)
      VALUES ('would_you_rather', ?)
      ON DUPLICATE KEY UPDATE questions = VALUES(questions)
    `;

    db.query(seedQuery, [JSON.stringify(wouldYouRatherQuestions)], (seedErr) => {
      if (seedErr) {
        console.error('Error seeding Would You Rather questions:', seedErr);
        db.end();
        return;
      }
      console.log('✅ Seeded Would You Rather questions');
      db.end();
    });
  });
});
