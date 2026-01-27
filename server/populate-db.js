#!/usr/bin/env node

/**
 * Database Population Script
 * Populates the questions table with data from the application constants
 */

const mysql = require('mysql2/promise');

const WOULD_YOU_RATHER_QUESTIONS = [
  {
    game_type: 'WOULD_YOU_RATHER',
    question_text: "Would you rather engage in hobbies that are more mental than physical?",
    question_order: 1,
    options: [
      { option_text: "Mental", personality_type: "STRATEGIC" },
      { option_text: "Physical", personality_type: "ACTIVE" }
    ]
  },
  {
    game_type: 'WOULD_YOU_RATHER',
    question_text: "Would you rather feel challenged than relaxed?",
    question_order: 2,
    options: [
      { option_text: "Challenged", personality_type: "CREATIVE" },
      { option_text: "Relaxed", personality_type: "STRATEGIC" }
    ]
  },
  {
    game_type: 'WOULD_YOU_RATHER',
    question_text: "Would you rather spend your free time alone than with others?",
    question_order: 3,
    options: [
      { option_text: "Alone", personality_type: "ACTIVE" },
      { option_text: "With others", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'WOULD_YOU_RATHER',
    question_text: "Would you describe yourself as patient rather than impatient?",
    question_order: 4,
    options: [
      { option_text: "Patient", personality_type: "CREATIVE" },
      { option_text: "Impatient", personality_type: "SOCIAL" }
    ]
  },
  {
    game_type: 'WOULD_YOU_RATHER',
    question_text: "Would you rather feel comfortable than open to anyone?",
    question_order: 5,
    options: [
      { option_text: "I prefer staying in my comfort zone", personality_type: "STRATEGIC" },
      { option_text: "I prefer to have new experiences", personality_type: "ACTIVE" }
    ]
  }
];

const RING_TOSS_QUESTIONS = [
  {
    game_type: 'RING_TOSS',
    question_text: "Why do you want a hobby?",
    question_order: 1,
    options: [
      { option_text: "I have free time", personality_type: "CALM" },
      { option_text: "Improve lifestyle & health", personality_type: "ACTIVE" },
      { option_text: "Express myself creatively", personality_type: "CREATIVE" },
      { option_text: "Meet new people & socialize", personality_type: "SOCIAL" },
      { option_text: "Build better lifestyle habits", personality_type: "STRATEGIC" },
      { option_text: "Try something exciting & new", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'RING_TOSS',
    question_text: "What kind of learner are you?",
    question_order: 2,
    options: [
      { option_text: "Visual", personality_type: "CREATIVE" },
      { option_text: "Auditory", personality_type: "CALM" },
      { option_text: "Kinaesthetic", personality_type: "ACTIVE" },
      { option_text: "Reading / Writing", personality_type: "STRATEGIC" },
      { option_text: "Social", personality_type: "SOCIAL" },
      { option_text: "Trial & error", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'RING_TOSS',
    question_text: "Your ideal hobby environment is…",
    question_order: 3,
    options: [
      { option_text: "Fast-paced & energetic", personality_type: "ACTIVE" },
      { option_text: "Competitive & intense", personality_type: "STRATEGIC" },
      { option_text: "Creative & expressive", personality_type: "CREATIVE" },
      { option_text: "Quiet & natural", personality_type: "CALM" },
      { option_text: "Lively & social", personality_type: "SOCIAL" },
      { option_text: "Comfortable & cosy", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'RING_TOSS',
    question_text: "What kind of progress do you want from a hobby?",
    question_order: 4,
    options: [
      { option_text: "Improved fitness & strength", personality_type: "ACTIVE" },
      { option_text: "Creative skills & mastery", personality_type: "CREATIVE" },
      { option_text: "Better mindset & inner calm", personality_type: "CALM" },
      { option_text: "Stronger social connections", personality_type: "SOCIAL" },
      { option_text: "Better habits & routines", personality_type: "STRATEGIC" },
      { option_text: "Overall personal growth", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'RING_TOSS',
    question_text: "What appeals to you most about starting a new hobby?",
    question_order: 5,
    options: [
      { option_text: "Physical challenges & movement", personality_type: "ACTIVE" },
      { option_text: "Making or creating something", personality_type: "CREATIVE" },
      { option_text: "Finding peace & tranquillity", personality_type: "CALM" },
      { option_text: "Bonding with like-minded people", personality_type: "SOCIAL" },
      { option_text: "Improving my lifestyle quality", personality_type: "STRATEGIC" },
      { option_text: "Pushing myself to try new things", personality_type: "EXPLORER" }
    ]
  }
];

const SHOOTING_GALLERY_QUESTIONS = [
  {
    game_type: 'SHOOTING_GALLERY',
    question_text: "What gives you the MOST satisfaction at this stage of life?",
    question_order: 1,
    options: [
      { option_text: "Feeling healthier & stronger", option_icon: "💪", personality_type: "ACTIVE" },
      { option_text: "Expressing myself creatively", option_icon: "🎨", personality_type: "CREATIVE" },
      { option_text: "Peaceful & close to nature", option_icon: "🌿", personality_type: "CALM" },
      { option_text: "Connecting with people", option_icon: "👥", personality_type: "SOCIAL" },
      { option_text: "Improve lifestyle & comfort", option_icon: "🏠", personality_type: "STRATEGIC" },
      { option_text: "Teaching others", option_icon: "📚", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'SHOOTING_GALLERY',
    question_text: "What motivates you to keep going when things get hard?",
    question_order: 2,
    options: [
      { option_text: "Seeing physical improvement", option_icon: "📈", personality_type: "ACTIVE" },
      { option_text: "Personal meaning and reflection", option_icon: "💭", personality_type: "CALM" },
      { option_text: "Positive feedback from others", option_icon: "💬", personality_type: "SOCIAL" },
      { option_text: "Creating something unique", option_icon: "✨", personality_type: "CREATIVE" },
      { option_text: "Consistency and routine", option_icon: "📋", personality_type: "STRATEGIC" },
      { option_text: "Mixing growth with enjoyment", option_icon: "🎯", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'SHOOTING_GALLERY',
    question_text: "Where do you feel most \"in the zone\"?",
    question_order: 3,
    options: [
      { option_text: "A gym or training space", option_icon: "🏋️", personality_type: "ACTIVE" },
      { option_text: "A quiet room with minimal distractions", option_icon: "🧘", personality_type: "CALM" },
      { option_text: "Outdoors with space to move", option_icon: "🌄", personality_type: "EXPLORER" },
      { option_text: "A lively space with people around", option_icon: "🎉", personality_type: "SOCIAL" },
      { option_text: "A cozy, familiar environment", option_icon: "🛋️", personality_type: "STRATEGIC" },
      { option_text: "A workshop or creative studio", option_icon: "🎨", personality_type: "CREATIVE" }
    ]
  },
  {
    game_type: 'SHOOTING_GALLERY',
    question_text: "What's your main goal for having a hobby?",
    question_order: 4,
    options: [
      { option_text: "Get fit and stay active", option_icon: "💪", personality_type: "ACTIVE" },
      { option_text: "Express creativity and make things", option_icon: "🎨", personality_type: "CREATIVE" },
      { option_text: "Find peace and reconnect with nature", option_icon: "🌿", personality_type: "CALM" },
      { option_text: "Meet people and build community", option_icon: "👥", personality_type: "SOCIAL" },
      { option_text: "Improve my daily lifestyle", option_icon: "📈", personality_type: "STRATEGIC" },
      { option_text: "Challenge myself and grow", option_icon: "🚀", personality_type: "EXPLORER" }
    ]
  },
  {
    game_type: 'SHOOTING_GALLERY',
    question_text: "How do you prefer to learn new things?",
    question_order: 5,
    options: [
      { option_text: "Doing it physically", option_icon: "🤸", personality_type: "ACTIVE" },
      { option_text: "Explore & experiment", option_icon: "🗺️", personality_type: "CALM" },
      { option_text: "Watch & observe", option_icon: "🔬", personality_type: "EXPLORER" },
      { option_text: "Discussing and learning with others", option_icon: "💬", personality_type: "SOCIAL" },
      { option_text: "Reading and following written guides", option_icon: "📖", personality_type: "STRATEGIC" },
      { option_text: "Visual & creative learning", option_icon: "✏️", personality_type: "CREATIVE" }
    ]
  }
];

async function populateDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_xREgo-7cfTkD9oJUroh',
      port: 23353,
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to database');

    // Clear existing questions (optional)
    await connection.execute('DELETE FROM question_options WHERE question_id IN (SELECT question_id FROM questions WHERE game_type IN (?, ?, ?))', 
      ['WOULD_YOU_RATHER', 'RING_TOSS', 'SHOOTING_GALLERY']);
    await connection.execute('DELETE FROM questions WHERE game_type IN (?, ?, ?)', 
      ['WOULD_YOU_RATHER', 'RING_TOSS', 'SHOOTING_GALLERY']);
    console.log('🧹 Cleared existing questions');

    // Insert all questions
    const allQuestions = [...WOULD_YOU_RATHER_QUESTIONS, ...RING_TOSS_QUESTIONS, ...SHOOTING_GALLERY_QUESTIONS];
    let totalQuestions = 0;
    let totalOptions = 0;

    for (const q of allQuestions) {
      const [result] = await connection.execute(
        'INSERT INTO questions (game_type, question_text, question_order) VALUES (?, ?, ?)',
        [q.game_type, q.question_text, q.question_order]
      );

      const questionId = result.insertId;
      console.log(`📝 Inserted question #${questionId}: ${q.game_type} - Q${q.question_order}`);
      totalQuestions++;

      // Insert options for this question
      for (const option of q.options) {
        await connection.execute(
          'INSERT INTO question_options (question_id, option_text, option_icon, personality_type) VALUES (?, ?, ?, ?)',
          [questionId, option.option_text, option.option_icon || null, option.personality_type]
        );
        totalOptions++;
      }
      console.log(`  ✓ Added ${q.options.length} options`);
    }

    console.log(`\n✅ Database population complete!`);
    console.log(`   Total questions inserted: ${totalQuestions}`);
    console.log(`   Total options inserted: ${totalOptions}`);

  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

populateDatabase();
