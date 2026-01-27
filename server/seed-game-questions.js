const mysql = require('mysql2/promise');

const wouldYouRatherQuestions = [
  {
    question: 'Would you rather engage in hobbies that are more mental than physical?',
    options: [
      { text: 'Mental', trait: 'STRATEGIC', personalityCodes: ['C', 'N', 'L', 'S'] },
      { text: 'Physical', trait: 'ACTIVE', personalityCodes: ['F'] }
    ],
    colors: ['bg-[#84D2F6]', 'bg-[#90F1AC]']
  },
  {
    question: 'Would you rather feel challenged than relaxed?',
    options: [
      { text: 'Challenged', trait: 'CREATIVE', personalityCodes: ['F', 'S', 'N'] },
      { text: 'Relaxed', trait: 'STRATEGIC', personalityCodes: ['L', 'C', 'N'] }
    ],
    colors: ['bg-[#F8A07E]', 'bg-[#FDE24F]']
  },
  {
    question: 'Would you rather spend your free time alone than with others?',
    options: [
      { text: 'Alone', trait: 'ACTIVE', personalityCodes: ['C', 'N'] },
      { text: 'With others', trait: 'EXPLORER', personalityCodes: ['F', 'S', 'L'] }
    ],
    colors: ['bg-[#FF8FAB]', 'bg-[#A78BFA]']
  },
  {
    question: 'Would you describe yourself as patient rather than impatient?',
    options: [
      { text: 'Patient', trait: 'CREATIVE', personalityCodes: ['C', 'N'] },
      { text: 'Impatient', trait: 'SOCIAL', personalityCodes: ['F', 'S'] }
    ],
    colors: ['bg-[#FDE24F]', 'bg-[#F8A07E]']
  },
  {
    question: 'Would you rather feel comfortable than open to anyone?',
    options: [
      { text: 'I prefer staying in my comfort zone', trait: 'STRATEGIC', personalityCodes: ['S', 'F', 'L'] },
      { text: 'I prefer to have new experiences', trait: 'ACTIVE', personalityCodes: ['N', 'C'] }
    ],
    colors: ['bg-[#84D2F6]', 'bg-[#90F1AC]']
  }
];

const ringTossQuestions = [
  {
    id: 1,
    question: 'Why do you want a hobby?',
    answers: [
      { text: 'I have free time', trait: 'CALM', personalityCodes: ['F', 'N', 'S'] },
      { text: 'Improve lifestyle & health', trait: 'ACTIVE', personalityCodes: ['F', 'L', 'N'] },
      { text: 'Express myself creatively', trait: 'CREATIVE', personalityCodes: ['C', 'L'] },
      { text: 'Meet new people & socialize', trait: 'SOCIAL', personalityCodes: ['F', 'C', 'S'] },
      { text: 'Build better lifestyle habits', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Try something exciting & new', trait: 'EXPLORER', personalityCodes: ['F', 'S'] }
    ]
  },
  {
    id: 2,
    question: 'What kind of learner are you?',
    answers: [
      { text: 'Visual', trait: 'CREATIVE', personalityCodes: ['C', 'N', 'L'] },
      { text: 'Auditory', trait: 'CALM', personalityCodes: ['C', 'N'] },
      { text: 'Kinaesthetic', trait: 'ACTIVE', personalityCodes: ['F', 'L', 'S'] },
      { text: 'Reading / Writing', trait: 'STRATEGIC', personalityCodes: ['C', 'L'] },
      { text: 'Social', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Trial & error', trait: 'EXPLORER', personalityCodes: ['F', 'N'] }
    ]
  },
  {
    id: 3,
    question: 'Your ideal hobby environment is…',
    answers: [
      { text: 'Fast-paced & energetic', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Competitive & intense', trait: 'STRATEGIC', personalityCodes: ['F', 'S'] },
      { text: 'Creative & expressive', trait: 'CREATIVE', personalityCodes: ['C'] },
      { text: 'Quiet & natural', trait: 'CALM', personalityCodes: ['N'] },
      { text: 'Lively & social', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Comfortable & cosy', trait: 'EXPLORER', personalityCodes: ['L'] }
    ]
  },
  {
    id: 4,
    question: 'What kind of progress do you want from a hobby?',
    answers: [
      { text: 'Improved fitness & strength', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Creative skills & mastery', trait: 'CREATIVE', personalityCodes: ['C'] },
      { text: 'Better mindset & inner calm', trait: 'CALM', personalityCodes: ['N'] },
      { text: 'Stronger social connections', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Better habits & routines', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Overall personal growth', trait: 'EXPLORER', personalityCodes: ['C', 'N', 'L', 'S'] }
    ]
  },
  {
    id: 5,
    question: 'What appeals to you most about starting a new hobby?',
    answers: [
      { text: 'Physical challenges & movement', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Making or creating something', trait: 'CREATIVE', personalityCodes: ['C'] },
      { text: 'Finding peace & tranquillity', trait: 'CALM', personalityCodes: ['N'] },
      { text: 'Bonding with like-minded people', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Improving my lifestyle quality', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Pushing myself to try new things', trait: 'EXPLORER', personalityCodes: ['F', 'S', 'N'] }
    ]
  }
];

const shootingGalleryQuestions = [
  {
    id: 1,
    question: 'What gives you the MOST satisfaction at this stage of life?',
    answers: [
      { text: 'Feeling healthier & stronger', description: '💪', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Expressing myself creatively', description: '🎨', trait: 'CREATIVE', personalityCodes: ['C'] },
      { text: 'Peaceful & close to nature', description: '🌿', trait: 'CALM', personalityCodes: ['N'] },
      { text: 'Connecting with people', description: '👥', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Improve lifestyle & comfort', description: '🏠', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Teaching others', description: '📚', trait: 'EXPLORER', personalityCodes: ['S', 'C', 'N'] }
    ]
  },
  {
    id: 2,
    question: 'What motivates you to keep going when things get hard?',
    answers: [
      { text: 'Seeing physical improvement', description: '📈', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Personal meaning and reflection', description: '💭', trait: 'CALM', personalityCodes: ['N', 'L'] },
      { text: 'Positive feedback from others', description: '💬', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Creating something unique', description: '✨', trait: 'CREATIVE', personalityCodes: ['C'] },
      { text: 'Consistency and routine', description: '📋', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Mixing growth with enjoyment', description: '🎯', trait: 'EXPLORER', personalityCodes: ['S'] }
    ]
  },
  {
    id: 3,
    question: 'Where do you feel most "in the zone"?',
    answers: [
      { text: 'A gym or training space', description: '🏋️', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'A quiet room with minimal distractions', description: '🧘', trait: 'CALM', personalityCodes: ['C', 'N'] },
      { text: 'Outdoors with space to move', description: '🌄', trait: 'EXPLORER', personalityCodes: ['F', 'N'] },
      { text: 'A lively space with people around', description: '🎉', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'A cozy, familiar environment', description: '🛋️', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'A workshop or creative studio', description: '🎨', trait: 'CREATIVE', personalityCodes: ['C', 'L'] }
    ]
  },
  {
    id: 4,
    question: "What's your main goal for having a hobby?",
    answers: [
      { text: 'Get fit and stay active', description: '💪', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Express creativity and make things', description: '🎨', trait: 'CREATIVE', personalityCodes: ['C'] },
      { text: 'Find peace and reconnect with nature', description: '🌿', trait: 'CALM', personalityCodes: ['N'] },
      { text: 'Meet people and build community', description: '👥', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Improve my daily lifestyle', description: '📈', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Challenge myself and grow', description: '🚀', trait: 'EXPLORER', personalityCodes: ['F', 'C', 'S', 'N'] }
    ]
  },
  {
    id: 5,
    question: 'How do you prefer to learn new things?',
    answers: [
      { text: 'Doing it physically', description: '🤸', trait: 'ACTIVE', personalityCodes: ['F'] },
      { text: 'Explore & experiment', description: '🗺️', trait: 'CALM', personalityCodes: ['N', 'S'] },
      { text: 'Watch & observe', description: '🔬', trait: 'EXPLORER', personalityCodes: ['C', 'N'] },
      { text: 'Discussing and learning with others', description: '💬', trait: 'SOCIAL', personalityCodes: ['S'] },
      { text: 'Reading and following written guides', description: '📖', trait: 'STRATEGIC', personalityCodes: ['L'] },
      { text: 'Visual & creative learning', description: '✏️', trait: 'CREATIVE', personalityCodes: ['C', 'N'] }
    ]
  }
];

const config = {
  host: 'mysql-f6dd3cc-myrp-fypp.d.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_xREgo-7cfTkD9oJUroh',
  port: 23353,
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  }
};

const ensureTable = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS game_question_sets (
      game_name VARCHAR(100) PRIMARY KEY,
      questions JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const upsertGameQuestions = async (db, gameName, questions) => {
  await db.execute(
    'INSERT INTO game_question_sets (game_name, questions) VALUES (?, ?) ON DUPLICATE KEY UPDATE questions = VALUES(questions)',
    [gameName, JSON.stringify(questions)]
  );
};

const main = async () => {
  let db;
  try {
    db = await mysql.createConnection(config);
    await ensureTable(db);
    await upsertGameQuestions(db, 'would_you_rather', wouldYouRatherQuestions);
    await upsertGameQuestions(db, 'ring_toss', ringTossQuestions);
    await upsertGameQuestions(db, 'shooting_gallery', shootingGalleryQuestions);
    console.log('✅ Seeded game_question_sets for would_you_rather, ring_toss, shooting_gallery');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    if (db) await db.end();
  }
};

main();
