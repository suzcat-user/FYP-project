const mysql = require('mysql2/promise');

async function setupHobbyCommunitiesWithEvents() {
  const db = await mysql.createPool({
    host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_xREgo-7cfTkD9oJUroh',
    port: 23353,
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 Setting up hobby-specific communities and events...\n');

    // All 40 hobbies with their details
    const hobbies = [
      // Fitness (F) - 8 hobbies
      { name: 'Running', description: 'Steady-paced runs that build endurance and keep your heart strong', communityId: 1 },
      { name: 'Hiking', description: 'Trail walks that combine fitness with scenic exploration', communityId: 2 },
      { name: 'Gym', description: 'Strength and conditioning sessions using weights', communityId: 3 },
      { name: 'Cycling', description: 'Road or park rides that boost stamina and leg strength', communityId: 4 },
      { name: 'Bootcamp', description: 'Group circuits that mix cardio and strength challenges', communityId: 5 },
      { name: 'Yoga', description: 'Flexibility and balance practice with mindful breathing', communityId: 6 },
      { name: 'High-Intensity Interval Training (HIIT)', description: 'Short, intense intervals for maximum calorie burn', communityId: 7 },
      { name: 'Outdoor challenges', description: 'Obstacle or adventure-style events that test agility and strength', communityId: 8 },
      // Creative (C) - 8 hobbies
      { name: 'Drawing', description: 'Sketching ideas and scenes with pencil or pen', communityId: 9 },
      { name: 'Painting', description: 'Creating artwork with acrylics, watercolor, or oils', communityId: 10 },
      { name: 'Pottery', description: 'Shaping clay into functional or decorative pieces', communityId: 11 },
      { name: 'Calligraphy', description: 'Stylized lettering that turns words into visual art', communityId: 12 },
      { name: 'Jewellery making', description: 'Designing wearable pieces with beads or wire', communityId: 13 },
      { name: 'Guitar', description: 'Learning chords and songs on acoustic or electric guitar', communityId: 14 },
      { name: 'Piano', description: 'Playing melodies and building technique on the keys', communityId: 15 },
      { name: 'Singing', description: 'Vocal practice for expression, harmony, and confidence', communityId: 16 },
      // Nature (N) - 8 hobbies
      { name: 'Gardening', description: 'Growing plants and creating calm, green spaces', communityId: 17 },
      { name: 'Nature walks', description: 'Slow strolls to unwind and observe wildlife', communityId: 18 },
      { name: 'Nature photography', description: 'Capturing landscapes, plants, and outdoor moments', communityId: 19 },
      { name: 'Trail Exploration', description: 'Exploring trails for exercise and fresh air', communityId: 20 },
      { name: 'Beach clean-ups', description: 'Community efforts to protect coastlines and habitats', communityId: 21 },
      { name: 'Birdwatching', description: 'Observing and identifying birds in natural habitats', communityId: 32 },
      { name: 'Camping', description: 'Outdoor overnight trips that immerse you in nature', communityId: 33 },
      { name: 'Foraging', description: 'Learning to identify and gather edible plants', communityId: 34 },
      // Social (S) - 8 hobbies
      { name: 'Badminton matches', description: 'Friendly rallies that keep you active together', communityId: 22 },
      { name: 'Group cooking', description: 'Sharing recipes and preparing meals as a team', communityId: 23 },
      { name: 'Multiplayer games', description: 'Co-op or competitive play with friends', communityId: 24 },
      { name: 'Board games', description: 'Tabletop sessions that spark conversation', communityId: 25 },
      { name: 'Team sports', description: 'Joining recreational leagues for soccer, volleyball', communityId: 35 },
      { name: 'Karaoke nights', description: 'Singing with friends in a supportive environment', communityId: 36 },
      { name: 'Potluck dinners', description: 'Gathering with friends where everyone brings a dish', communityId: 37 },
      { name: 'Escape rooms', description: 'Collaborative puzzle-solving adventures', communityId: 38 },
      // Lifestyle (L) - 8 hobbies
      { name: 'Cooking', description: 'Trying recipes and building everyday kitchen skills', communityId: 26 },
      { name: 'Baking', description: 'Creating breads and desserts with relaxing precision', communityId: 27 },
      { name: 'Journaling', description: 'Reflective writing for clarity and routine', communityId: 28 },
      { name: 'DIY decor', description: 'Personalizing your space with simple crafts', communityId: 29 },
      { name: 'Playing instruments', description: 'Practicing music to unwind and improve focus', communityId: 30 },
      { name: 'Making playlists', description: 'Curating music to match moods and moments', communityId: 31 },
      { name: 'Reading', description: 'Diving into books for relaxation and knowledge', communityId: 39 },
      { name: 'Meditation', description: 'Daily mindfulness practice to center yourself', communityId: 40 }
    ];

    // Event templates for each hobby type
    const eventTemplates = {
      'Running': [
        { title: '5K Community Run', description: 'Join us for a 5K fun run to build endurance and community', time: '07:00:00', location: 'Central Park', points: 15 },
        { title: 'Marathon Training Session', description: 'Prepare for a marathon with experienced runners', time: '06:30:00', location: 'Running Track', points: 20 }
      ],
      'Trail Exploration': [
        { title: 'Trail Hiking Adventure', description: 'Explore scenic trails for exercise and discovery', time: '09:00:00', location: 'Mountain Trail', points: 18 },
        { title: 'Trail Navigation Workshop', description: 'Learn navigation and trail safety skills', time: '10:00:00', location: 'Trail Head', points: 16 }
      ],
      'Gym': [
        { title: 'Strength Training Workshop', description: 'Learn proper lifting techniques from certified trainers', time: '17:00:00', location: 'Community Gym', points: 18 },
        { title: 'Fitness Challenge', description: 'Test your strength and endurance in a friendly competition', time: '18:00:00', location: 'Community Gym', points: 20 }
      ],
      'Cycling': [
        { title: 'Weekend Bike Ride', description: 'Casual cycling tour through scenic routes', time: '10:00:00', location: 'Riverside Path', points: 14 },
        { title: 'Speed Cycling Challenge', description: 'Competitive cycling race for advanced riders', time: '09:00:00', location: 'Cycling Track', points: 22 }
      ],
      'Bootcamp': [
        { title: 'HIIT Bootcamp Session', description: 'High-intensity workout combining cardio and strength', time: '06:00:00', location: 'Outdoor Field', points: 16 },
        { title: 'Weekend Bootcamp', description: 'Fun bootcamp workout with group motivation', time: '08:00:00', location: 'Park Area', points: 18 }
      ],
      'Yoga': [
        { title: 'Beginner Yoga Class', description: 'Relaxing yoga session for beginners to learn basics', time: '09:00:00', location: 'Yoga Studio', points: 13 },
        { title: 'Advanced Yoga Workshop', description: 'Deep stretching and advanced poses with experienced instructor', time: '18:00:00', location: 'Yoga Studio', points: 17 }
      ],
      'High-Intensity Interval Training (HIIT)': [
        { title: 'HIIT Training Session', description: 'Intense interval training for maximum results in short time', time: '17:30:00', location: 'Fitness Center', points: 19 },
        { title: 'HIIT Challenge Meetup', description: 'Friendly HIIT competition with prizes and celebration', time: '18:00:00', location: 'Fitness Center', points: 21 }
      ],
      'Outdoor challenges': [
        { title: 'Obstacle Course Event', description: 'Test yourself through various outdoor obstacles', time: '09:00:00', location: 'Adventure Park', points: 25 },
        { title: 'Adventure Relay Race', description: 'Team-based adventure race with multiple challenges', time: '10:00:00', location: 'Adventure Park', points: 28 }
      ],
      'Drawing': [
        { title: 'Sketching Workshop', description: 'Learn fundamental drawing techniques from artists', time: '14:00:00', location: 'Art Studio', points: 15 },
        { title: 'Life Drawing Session', description: 'Draw live models in a supportive environment', time: '19:00:00', location: 'Art Studio', points: 17 }
      ],
      'Painting': [
        { title: 'Oil Painting Class', description: 'Master oil painting techniques with expert guidance', time: '15:00:00', location: 'Art Studio', points: 18 },
        { title: 'Landscape Painting Workshop', description: 'Learn to paint beautiful landscapes', time: '10:00:00', location: 'Outdoor Location', points: 17 }
      ],
      'Pottery': [
        { title: 'Pottery Wheel Basics', description: 'Learn to throw pottery on the wheel', time: '14:00:00', location: 'Pottery Workshop', points: 16 },
        { title: 'Hand-Building Pottery', description: 'Create unique pottery using hand-building techniques', time: '15:30:00', location: 'Pottery Workshop', points: 15 }
      ],
      'Calligraphy': [
        { title: 'Calligraphy Basics Course', description: 'Learn beautiful lettering techniques', time: '16:00:00', location: 'Art Center', points: 14 },
        { title: 'Decorative Calligraphy Workshop', description: 'Create stunning decorative pieces with calligraphy', time: '14:00:00', location: 'Art Center', points: 16 }
      ],
      'Jewellery making': [
        { title: 'Beading Workshop', description: 'Design and create beautiful beaded jewelry', time: '13:00:00', location: 'Craft Studio', points: 17 },
        { title: 'Wire Jewelry Crafting', description: 'Learn wire wrapping and wire art jewelry techniques', time: '15:00:00', location: 'Craft Studio', points: 18 }
      ],
      'Guitar': [
        { title: 'Guitar Lessons Group Session', description: 'Learn guitar fundamentals in a group setting', time: '18:00:00', location: 'Music Studio', points: 16 },
        { title: 'Open Jam Session', description: 'Play guitar with fellow musicians in a casual jam', time: '19:00:00', location: 'Music Venue', points: 18 }
      ],
      'Piano': [
        { title: 'Piano Technique Workshop', description: 'Improve your piano playing technique and skill', time: '17:00:00', location: 'Music School', points: 17 },
        { title: 'Piano Recital Preparation', description: 'Prepare and perform your piano pieces', time: '19:00:00', location: 'Concert Hall', points: 20 }
      ],
      'Singing': [
        { title: 'Vocal Training Class', description: 'Improve your singing voice with professional coaching', time: '18:00:00', location: 'Vocal Studio', points: 16 },
        { title: 'Choir Practice', description: 'Sing in harmony with a group of singers', time: '19:30:00', location: 'Concert Hall', points: 18 }
      ],
      'Gardening': [
        { title: 'Garden Design Workshop', description: 'Learn to design and plan your garden', time: '10:00:00', location: 'Garden Center', points: 14 },
        { title: 'Plant Propagation Session', description: 'Learn to grow new plants from cuttings', time: '14:00:00', location: 'Community Garden', points: 15 }
      ],
      'Nature walks': [
        { title: 'Guided Nature Walk', description: 'Peaceful guided walk through natural areas', time: '08:00:00', location: 'Nature Trail', points: 12 },
        { title: 'Wildlife Observation Walk', description: 'Walk and observe local birds and wildlife', time: '09:00:00', location: 'Nature Reserve', points: 13 }
      ],
      'Nature photography': [
        { title: 'Landscape Photography Workshop', description: 'Capture stunning landscape photos', time: '06:00:00', location: 'Scenic Location', points: 17 },
        { title: 'Wildlife Photography Outing', description: 'Learn to photograph wildlife in nature', time: '07:00:00', location: 'Wildlife Area', points: 19 }
      ],
      'Beach clean-ups': [
        { title: 'Beach Cleanup Drive', description: 'Join us in cleaning and protecting our beaches', time: '09:00:00', location: 'Beach', points: 15 },
        { title: 'Coastal Habitat Restoration', description: 'Help restore and protect coastal ecosystems', time: '10:00:00', location: 'Beach Area', points: 17 }
      ],
      'Birdwatching': [
        { title: 'Beginner Birdwatching Tour', description: 'Learn to identify and observe birds', time: '06:30:00', location: 'Nature Reserve', points: 14 },
        { title: 'Advanced Birdwatching Expedition', description: 'Search for rare bird species in nature', time: '07:00:00', location: 'Wildlife Sanctuary', points: 18 }
      ],
      'Camping': [
        { title: 'Camping Survival Skills', description: 'Learn essential camping and survival skills', time: '09:00:00', location: 'Camping Ground', points: 20 },
        { title: 'Group Camping Adventure', description: 'Camp overnight with fellow nature lovers', time: '17:00:00', location: 'Camping Site', points: 22 }
      ],
      'Foraging': [
        { title: 'Edible Plant Identification', description: 'Learn to identify edible plants and mushrooms', time: '09:00:00', location: 'Forest Area', points: 16 },
        { title: 'Foraging and Cooking Class', description: 'Forage ingredients and cook a wild meal', time: '10:00:00', location: 'Nature Area', points: 20 }
      ],
      'Badminton matches': [
        { title: 'Badminton Tournament', description: 'Competitive badminton matches with prizes', time: '17:00:00', location: 'Sports Court', points: 16 },
        { title: 'Casual Badminton Meetup', description: 'Friendly badminton games with fellow players', time: '18:00:00', location: 'Sports Court', points: 14 }
      ],
      'Group cooking': [
        { title: 'International Cuisine Night', description: 'Cook and enjoy international dishes together', time: '18:00:00', location: 'Community Kitchen', points: 18 },
        { title: 'Cooking Class & Feast', description: 'Learn cooking techniques and share a meal', time: '17:30:00', location: 'Culinary Space', points: 20 }
      ],
      'Multiplayer games': [
        { title: 'Gaming Tournament', description: 'Competitive multiplayer gaming event with prizes', time: '19:00:00', location: 'Gaming Lounge', points: 17 },
        { title: 'Cooperative Gaming Night', description: 'Play cooperative games with fellow gamers', time: '20:00:00', location: 'Gaming Arena', points: 15 }
      ],
      'Board games': [
        { title: 'Board Game Night', description: 'Play classic and modern board games with others', time: '19:00:00', location: 'Game Cafe', points: 14 },
        { title: 'Strategy Game Tournament', description: 'Compete in strategic board games', time: '18:00:00', location: 'Game Hall', points: 16 }
      ],
      'Team sports': [
        { title: 'Soccer Match', description: 'Friendly soccer game for all skill levels', time: '17:00:00', location: 'Sports Field', points: 16 },
        { title: 'Volleyball Game', description: 'Join our weekly volleyball matches', time: '18:00:00', location: 'Sports Court', points: 15 }
      ],
      'Karaoke nights': [
        { title: 'Karaoke Singing Night', description: 'Sing your favorite songs in a fun atmosphere', time: '19:00:00', location: 'Karaoke Bar', points: 17 },
        { title: 'Battle of the Singers', description: 'Friendly karaoke competition with prizes', time: '20:00:00', location: 'Karaoke Venue', points: 19 }
      ],
      'Potluck dinners': [
        { title: 'Community Potluck', description: 'Share dishes and connect with community members', time: '18:00:00', location: 'Community Center', points: 16 },
        { title: 'Themed Potluck Dinner', description: 'Potluck with a fun theme and activities', time: '17:30:00', location: 'Park Pavilion', points: 17 }
      ],
      'Escape rooms': [
        { title: 'Escape Room Challenge', description: 'Solve puzzles and escape in a thrilling experience', time: '17:00:00', location: 'Escape Room Studio', points: 18 },
        { title: 'Escape Room Tournament', description: 'Compete against other teams in escape rooms', time: '18:00:00', location: 'Escape Room Facility', points: 20 }
      ],
      'Cooking': [
        { title: 'Weekly Cooking Workshop', description: 'Learn new cooking techniques and recipes', time: '17:00:00', location: 'Community Kitchen', points: 17 },
        { title: 'Cuisine Exploration Night', description: 'Explore and cook recipes from different cuisines', time: '18:00:00', location: 'Culinary Center', points: 18 }
      ],
      'Baking': [
        { title: 'Baking Class', description: 'Learn to bake delicious breads and pastries', time: '14:00:00', location: 'Baking Studio', points: 16 },
        { title: 'Dessert Decoration Workshop', description: 'Master cake and dessert decoration techniques', time: '15:00:00', location: 'Baking Studio', points: 17 }
      ],
      'Journaling': [
        { title: 'Journaling Circle', description: 'Share and discuss reflective writing with others', time: '19:00:00', location: 'Quiet Space', points: 12 },
        { title: 'Creative Writing Workshop', description: 'Explore creative writing through journaling', time: '18:00:00', location: 'Writing Center', points: 14 }
      ],
      'DIY decor': [
        { title: 'DIY Home Decor Workshop', description: 'Create beautiful decorations for your home', time: '14:00:00', location: 'Craft Studio', points: 15 },
        { title: 'Upcycling & DIY Project Night', description: 'Transform old items into home decor', time: '15:00:00', location: 'Craft Center', points: 16 }
      ],
      'Playing instruments': [
        { title: 'Instrument Workshop', description: 'Learn and practice various musical instruments', time: '17:00:00', location: 'Music Studio', points: 16 },
        { title: 'Ensemble Practice', description: 'Play instruments together in an ensemble', time: '18:00:00', location: 'Concert Hall', points: 17 }
      ],
      'Making playlists': [
        { title: 'Playlist Curation Workshop', description: 'Learn to create perfect playlists for any mood', time: '19:00:00', location: 'Music Lounge', points: 12 },
        { title: 'Music Sharing Circle', description: 'Share and discuss your favorite playlists', time: '18:00:00', location: 'Music Cafe', points: 13 }
      ],
      'Reading': [
        { title: 'Book Club Meeting', description: 'Discuss and share your favorite books', time: '18:00:00', location: 'Library', points: 13 },
        { title: 'Author Discussion Night', description: 'Meet and discuss with visiting authors', time: '19:00:00', location: 'Bookstore', points: 16 }
      ],
      'Meditation': [
        { title: 'Guided Meditation Session', description: 'Peaceful meditation session for relaxation', time: '09:00:00', location: 'Meditation Center', points: 12 },
        { title: 'Advanced Meditation Workshop', description: 'Deepen your meditation practice', time: '18:00:00', location: 'Yoga Studio', points: 14 }
      ]
    };

    // Clear existing communities and events (keep user_communities and user_event_participation)
    console.log('🗑️  Clearing old communities and events...');
    await db.query('DELETE FROM events');
    await db.query('DELETE FROM communities');
    console.log('✅ Cleared\n');

    // Create 40 communities (one for each hobby)
    console.log('📝 Creating 40 hobby-specific communities...');
    for (const hobby of hobbies) {
      await db.query(
        'INSERT INTO communities (community_id, name, description) VALUES (?, ?, ?)',
        [hobby.communityId, hobby.name, hobby.description]
      );
    }
    console.log('✅ Created 40 communities\n');

    // Add events to each community
    console.log('🎉 Creating hobby-specific events...\n');
    let totalEventsAdded = 0;
    
    for (const hobby of hobbies) {
      const templates = eventTemplates[hobby.name] || [
        { title: `${hobby.name} Meetup`, description: `Join us for a ${hobby.name} gathering`, time: '18:00:00', location: 'Community Center', points: 15 },
        { title: `${hobby.name} Workshop`, description: `Learn and practice ${hobby.name} with others`, time: '17:00:00', location: 'Workshop Space', points: 17 }
      ];

      for (let i = 0; i < templates.length; i++) {
        const template = templates[i];
        const eventDate = new Date(Date.now() + (5 + i * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        await db.query(`
          INSERT INTO events (community_id, title, description, event_date, event_time, location, points_reward)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [hobby.communityId, template.title, template.description, eventDate, template.time, template.location, template.points]);
        
        totalEventsAdded++;
      }
      
      console.log(`  ✅ ${hobby.name}: 2 events added`);
    }

    console.log(`\n✅ Successfully created ${totalEventsAdded} events across 40 hobby communities!`);
    
    // Show summary
    const [summary] = await db.query(`
      SELECT c.community_id, c.name, COUNT(e.event_id) as event_count
      FROM communities c
      LEFT JOIN events e ON c.community_id = e.community_id
      GROUP BY c.community_id, c.name
      ORDER BY c.community_id
      LIMIT 5
    `);
    
    console.log('\n📊 Sample of communities with events:');
    summary.forEach(c => {
      console.log(`  • ${c.name}: ${c.event_count} events`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupHobbyCommunitiesWithEvents();
