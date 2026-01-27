const mysql = require('mysql2/promise');

async function populateHobbies() {
  const db = await mysql.createPool({
    host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_xREgo-7cfTkD9oJUroh',
    port: 23353,
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 Creating hobbies tables...');

    // Create personality_types table
    await db.query(`
      CREATE TABLE IF NOT EXISTS personality_types (
        personality_code CHAR(1) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create hobbies table
    await db.query(`
      CREATE TABLE IF NOT EXISTS hobbies (
        hobby_id INT AUTO_INCREMENT PRIMARY KEY,
        personality_code CHAR(1) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        community_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personality_code) REFERENCES personality_types(personality_code) ON DELETE CASCADE,
        INDEX idx_hobbies_personality (personality_code)
      )
    `);

    // Create personality_communities table
    await db.query(`
      CREATE TABLE IF NOT EXISTS personality_communities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        personality_code CHAR(1) NOT NULL,
        community_name VARCHAR(100) NOT NULL,
        FOREIGN KEY (personality_code) REFERENCES personality_types(personality_code) ON DELETE CASCADE,
        INDEX idx_personality_communities (personality_code)
      )
    `);

    console.log('✅ Tables created successfully');

    // Clear existing data
    await db.query('DELETE FROM hobbies');
    await db.query('DELETE FROM personality_communities');
    await db.query('DELETE FROM personality_types');
    console.log('🧹 Cleared existing data');

    // Insert personality types
    const personalityTypes = [
      ['F', 'Fitness', '🏃', 'You thrive on movement, competition, and pushing your limits. Physical challenges energize you, and you feel most confident when you are actively improving your strength, stamina, or agility.'],
      ['C', 'Creatives', '🎨', 'You are driven by imagination and love turning ideas into something tangible. Creative outlets help you express emotions, explore new styles, and find inspiration in everyday moments.'],
      ['N', 'Nature', '🌿', 'You feel most balanced when surrounded by the outdoors and quiet spaces. Nature helps you recharge, stay grounded, and appreciate the simple beauty of the world around you.'],
      ['S', 'Social', '🤝', 'You draw energy from connecting with people and sharing experiences. Group activities, teamwork, and lively conversations help you feel engaged and motivated.'],
      ['L', 'Lifestyle', '🧘', 'You value comfort, balance, and the small routines that make life feel steady. Relaxing hobbies and familiar rituals help you recharge and create a peaceful everyday flow.']
    ];

    for (const [code, name, emoji, description] of personalityTypes) {
      await db.query(
        'INSERT INTO personality_types (personality_code, name, emoji, description) VALUES (?, ?, ?, ?)',
        [code, name, emoji, description]
      );
    }
    console.log('✅ Inserted 5 personality types');

    // Insert communities
    const communities = [
      ['F', 'Outdoor & Fitness'],
      ['C', 'Arts'],
      ['C', 'Crafts'],
      ['C', 'Music'],
      ['N', 'Outdoor & Fitness'],
      ['S', 'Culinary'],
      ['S', 'Gaming'],
      ['L', 'Culinary'],
      ['L', 'Arts'],
      ['L', 'Music']
    ];

    for (const [code, name] of communities) {
      await db.query(
        'INSERT INTO personality_communities (personality_code, community_name) VALUES (?, ?)',
        [code, name]
      );
    }
    console.log('✅ Inserted community mappings');

    // Insert hobbies
    const hobbies = [
      // Fitness (F)
      ['F', 'Running', 'Steady-paced runs that build endurance and keep your heart strong. It is an easy habit to start, works well with music or podcasts, and helps clear your mind after a busy day.', 1],
      ['F', 'Hiking', 'Trail walks that combine fitness with scenic exploration and fresh air. You can choose gentle routes or steep climbs, making it a flexible way to stay active and enjoy nature.', 2],
      ['F', 'Gym', 'Strength and conditioning sessions using weights or machines to reach clear goals. Tracking progress over time keeps motivation high while improving power, posture, and overall health.', 3],
      ['F', 'Cycling', 'Road or park rides that boost stamina and leg strength while letting you explore your surroundings. It is low-impact, great for long sessions, and easy to scale in intensity.', 4],
      ['F', 'Bootcamp', 'Group circuits that mix cardio and strength challenges for a fun, high-energy workout. The variety keeps boredom away while the group vibe pushes you to go further.', 5],
      ['F', 'Yoga', 'Flexibility and balance practice with mindful breathing to relax the body and sharpen focus. Regular sessions improve mobility and recovery while reducing stress.', 6],
      ['F', 'High-Intensity Interval Training (HIIT)', 'Short, intense intervals designed for maximum calorie burn in minimal time. It is perfect for busy schedules and delivers a big fitness boost quickly.', 7],
      ['F', 'Outdoor challenges', 'Obstacle or adventure-style events that test agility, strength, and grit. Training for these challenges adds purpose to workouts and builds confidence through achievement.', 8],
      
      // Creatives (C)
      ['C', 'Drawing', 'Sketching ideas and scenes with pencil or pen to capture imagination. It builds observation skills, improves hand control, and is an easy way to express feelings visually.', 9],
      ['C', 'Painting', 'Creating artwork with acrylics, watercolor, or oils to explore color and texture. Each piece becomes a personal statement, and practice unlocks new creative styles.', 10],
      ['C', 'Pottery', 'Shaping clay into functional or decorative pieces using wheel or hand-building methods. The tactile process is calming, and finished work feels uniquely personal.', 11],
      ['C', 'Calligraphy', 'Stylized lettering for cards, art, or journaling that turns words into visual art. It is a relaxing craft that rewards patience and steady practice.', 12],
      ['C', 'Jewellery making', 'Designing wearable pieces with beads or wire to create custom accessories. You can experiment with colors, textures, and patterns for a signature look.', 13],
      ['C', 'Guitar', 'Learning chords and songs on acoustic or electric guitar to build rhythm and confidence. It is versatile for solo play or jamming with others.', 14],
      ['C', 'Piano', 'Playing melodies and building technique on the keys with structured practice. It develops musical understanding and lets you interpret songs with your own style.', 15],
      ['C', 'Singing', 'Vocal practice for expression, harmony, and confidence across different genres. It improves breathing control and helps you connect emotionally with music.', 16],
      
      // Nature (N)
      ['N', 'Gardening', 'Growing plants and creating calm, green spaces that bring daily peace. It teaches patience, connects you with seasons, and rewards you with visible progress.', 17],
      ['N', 'Nature walks', 'Slow strolls to unwind and observe wildlife, trees, and changing weather. It is a gentle routine that supports mental clarity and everyday balance.', 18],
      ['N', 'Nature photography', 'Capturing landscapes, plants, and outdoor moments to preserve beauty and detail. It encourages you to slow down, notice light, and appreciate small scenes.', 19],
      ['N', 'Hiking', 'Exploring trails for exercise and fresh air while discovering quiet, scenic places. Each route offers a new experience and a refreshing break from screens.', 20],
      ['N', 'Beach clean-ups', 'Community efforts to protect coastlines and habitats through hands-on action. It is meaningful, social, and leaves a visible positive impact on nature.', 21],
      
      // Social (S)
      ['S', 'Badminton matches', 'Friendly rallies that keep you active together while boosting coordination. It is fast-paced, easy to learn, and perfect for social play.', 22],
      ['S', 'Group cooking', 'Sharing recipes and preparing meals as a team to bond and learn. It turns everyday food into a fun event and encourages creative collaboration.', 23],
      ['S', 'Multiplayer games', 'Co-op or competitive play with friends that builds teamwork and friendly rivalry. It is a great way to stay connected and share memorable moments.', 24],
      ['S', 'Board games', 'Tabletop sessions that spark conversation, laughter, and strategy. From party games to deep tactics, there is always something new to try together.', 25],
      
      // Lifestyle (L)
      ['L', 'Cooking', 'Trying recipes and building everyday kitchen skills you can rely on. It brings comfort through routine while giving space to experiment with flavors.', 26],
      ['L', 'Baking', 'Creating breads and desserts with relaxing precision and a cozy payoff. Measuring, mixing, and timing make it a satisfying and mindful process.', 27],
      ['L', 'Journaling', 'Reflective writing for clarity and routine, helping you track goals and feelings. It is a peaceful habit that supports self-awareness over time.', 28],
      ['L', 'DIY decor', 'Personalizing your space with simple crafts that make home feel special. Small projects add warmth and let your personality show through details.', 29],
      ['L', 'Playing instruments', 'Practicing music to unwind and improve focus with steady progress. It builds patience and gives you a creative outlet whenever you need a reset.', 30],
      ['L', 'Making playlists', 'Curating music to match moods and moments for study, relaxation, or workouts. It is a simple ritual that can boost energy or bring calm.', 31]
    ];

    for (const [code, name, description, communityId] of hobbies) {
      await db.query(
        'INSERT INTO hobbies (personality_code, name, description, community_id) VALUES (?, ?, ?, ?)',
        [code, name, description, communityId]
      );
    }
    console.log(`✅ Inserted ${hobbies.length} hobbies`);

    // Verify
    const [hobbyCount] = await db.query('SELECT COUNT(*) as count FROM hobbies');
    const [personalityCount] = await db.query('SELECT COUNT(*) as count FROM personality_types');
    console.log(`\n📊 Database now contains:`);
    console.log(`   - ${personalityCount[0].count} personality types`);
    console.log(`   - ${hobbyCount[0].count} hobbies`);

    console.log('\n✅ Hobbies database population complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating hobbies:', error);
    process.exit(1);
  }
}

populateHobbies();
