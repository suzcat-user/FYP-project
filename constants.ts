import { Trait } from './types';

export const WOULD_YOU_RATHER_QUESTIONS = [
  {
    id: 1,
    question: "Would you rather engage in hobbies that are more mental than physical?",
    answers: [
      { text: "Mental", trait: Trait.STRATEGIC },
      { text: "Physical", trait: Trait.ACTIVE }
    ]
  },
  {
    id: 2,
    question: "Would you rather feel challenged than relaxed?",
    answers: [
      { text: "Challenged", trait: Trait.CREATIVE },
      { text: "Relaxed", trait: Trait.STRATEGIC }
    ]
  },
  {
    id: 3,
    question: "Would you rather spend your free time alone than with others?",
    answers: [
      { text: "Alone", trait: Trait.ACTIVE },
      { text: "With others", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 4,
    question: "Would you describe yourself as patient rather than impatient?",
    answers: [
      { text: "Patient", trait: Trait.CREATIVE },
      { text: "Impatient", trait: Trait.SOCIAL }
    ]
  },
  {
    id: 5,
    question: "Would you rather feel comfortable than open to anyone?",
    answers: [
      { text: "I prefer staying in my comfort zone", trait: Trait.STRATEGIC },
      { text: "I prefer to open up to others ", trait: Trait.ACTIVE }
    ]
  }
];

export const RING_TOSS_QUESTIONS = [
  {
    id: 1,
    question: "Why do you want a hobby?",
    answers: [
      { text: "I have free time", trait: Trait.CALM },
      { text: "Improve lifestyle & health", trait: Trait.ACTIVE },
      { text: "Express myself creatively", trait: Trait.CREATIVE },
      { text: "Meet new people & socialize", trait: Trait.SOCIAL },
      { text: "Build better lifestyle habits", trait: Trait.STRATEGIC },
      { text: "Try something exciting & new", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 2,
    question: "What kind of learner are you?",
    answers: [
      { text: "Visual", trait: Trait.CREATIVE },
      { text: "Auditory", trait: Trait.CALM },
      { text: "Kinaesthetic", trait: Trait.ACTIVE },
      { text: "Reading / Writing", trait: Trait.STRATEGIC },
      { text: "Social", trait: Trait.SOCIAL },
      { text: "Trial & error", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 3,
    question: "Your ideal hobby environment is…",
    answers: [
      { text: "Fast-paced & energetic", trait: Trait.ACTIVE },
      { text: "Competitive & intense", trait: Trait.STRATEGIC },
      { text: "Creative & expressive", trait: Trait.CREATIVE },
      { text: "Quiet & natural", trait: Trait.CALM },
      { text: "Lively & social", trait: Trait.SOCIAL },
      { text: "Comfortable & cosy", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 4,
    question: "What's your ultimate comfort food vibe?",
    answers: [
      { text: "Grand Buffet - Everything for everyone.", trait: Trait.SOCIAL },
      { text: "Tea & Silence - Simple, warm, and quiet.", trait: Trait.CALM },
      { text: "Exotic Street Food - Taste something brand new.", trait: Trait.EXPLORER },
      { text: "Artisan Pastries - Beautifully crafted treats.", trait: Trait.CREATIVE },
      { text: "Power Smoothie - Fuel for the next mission.", trait: Trait.ACTIVE },
      { text: "Perfectly Portion-timed Meal - Precisely calculated macros.", trait: Trait.STRATEGIC }
    ]
  },
  {
    id: 5,
    question: "Choose a companion for your journey!",
    answers: [
      { text: "Talking Crowd - A group of lively travelers.", trait: Trait.SOCIAL },
      { text: "Stoic Owl - Wise, quiet, and watchful.", trait: Trait.CALM },
      { text: "Compass Golem - Finds paths through any fog.", trait: Trait.EXPLORER },
      { text: "Living Sketchbook - Draws reality as you go.", trait: Trait.CREATIVE },
      { text: "Fire Sprit - Energizes your every step.", trait: Trait.ACTIVE },
      { text: "Chess Phantom - Analyzes every possible move.", trait: Trait.STRATEGIC }
    ]
  }
];

export const SHOOTING_GALLERY_QUESTIONS = [
  {
    id: 1,
    question: "What gives you the MOST satisfaction at this stage of life?",
    answers: [
      { text: "Feeling healthier & stronger", description: "💪", trait: Trait.ACTIVE },
      { text: "Expressing myself creatively", description: "🎨", trait: Trait.CREATIVE },
      { text: "Peaceful & close to nature", description: "🌿", trait: Trait.CALM },
      { text: "Connecting with people", description: "👥", trait: Trait.SOCIAL },
      { text: "Improve lifestyle & comfort", description: "🏠", trait: Trait.STRATEGIC },
      { text: "Teaching others", description: "📚", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 2,
    question: "What motivates you to keep going when things get hard?",
    answers: [
      { text: "Seeing physical improvement", description: "📈", trait: Trait.ACTIVE },
      { text: "Personal meaning and reflection", description: "💭", trait: Trait.CALM },
      { text: "Positive feedback from others", description: "💬", trait: Trait.SOCIAL },
      { text: "Creating something unique", description: "✨", trait: Trait.CREATIVE },
      { text: "Consistency and routine", description: "📋", trait: Trait.STRATEGIC },
      { text: "Mixing growth with enjoyment", description: "🎯", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 3,
    question: "Where do you feel most “in the zone”?",
    answers: [
      { text: "A gym or training space", description: "🏋️", trait: Trait.ACTIVE },
      { text: "A quiet room with minimal distractions", description: "🧘", trait: Trait.CALM },
      { text: "Outdoors with space to move", description: "🌄", trait: Trait.EXPLORER },
      { text: "A lively space with people around", description: "🎉", trait: Trait.SOCIAL },
      { text: "A cozy, familiar environment", description: "🛋️", trait: Trait.STRATEGIC },
      { text: "A workshop or creative studio", description: "🎨", trait: Trait.CREATIVE }
    ]
  }, 
  {
    id: 4,
    question: "What's your main goal for having a hobby?",
    answers: [
      { text: "Get fit and stay active", description: "💪", trait: Trait.ACTIVE },
      { text: "Express creativity and make things", description: "🎨", trait: Trait.CREATIVE },
      { text: "Find peace and reconnect with nature", description: "🌿", trait: Trait.CALM },
      { text: "Meet people and build community", description: "👥", trait: Trait.SOCIAL },
      { text: "Improve my daily lifestyle", description: "📈", trait: Trait.STRATEGIC },
      { text: "Challenge myself and grow", description: "🚀", trait: Trait.EXPLORER }
    ]
  },
  {
    id: 5,
    question: "How do you prefer to learn new things?",
    answers: [
      { text: "Doing it physically", description: "🤸", trait: Trait.ACTIVE },
      { text: "Explore & experiment", description: "🗺️", trait: Trait.CALM },
      { text: "Visual & creative learning", description: "✏️", trait: Trait.CREATIVE },
      { text: "Discussing and learning with others", description: "💬", trait: Trait.SOCIAL },
      { text: "Reading and following written guides", description: "📖", trait: Trait.STRATEGIC },
      { text: "Watch & observe", description: "🔬", trait: Trait.EXPLORER }
    ]
  }
];

export const WHACK_A_MOLE_QUESTIONS = [
  {
    id: 1,
    question: "Quick! Whack the activity you'd try first!",
    answers: [
      { text: "Street Photography", trait: Trait.EXPLORER },
      { text: "Baking Bread", trait: Trait.CREATIVE },
      { text: "Kickboxing", trait: Trait.ACTIVE },
      { text: "Meditation", trait: Trait.CALM },
      { text: "Board Game Night", trait: Trait.SOCIAL },
      { text: "Stock Trading", trait: Trait.STRATEGIC }
    ]
  }
];

export const BINGO_QUESTIONS = [
  { id: 'q1', question: "Do you enjoy making things with your hands?", trait: Trait.CREATIVE },
  { id: 'q2', question: "Do you prefer team sports over solo activities?", trait: Trait.SOCIAL },
  { id: 'q3', question: "Does solving a complex puzzle sound fun?", trait: Trait.STRATEGIC },
  { id: 'q4', question: "Do you enjoy spending time outdoors?", trait: Trait.ACTIVE },
  { id: 'q5', question: "Do you like trying new foods and restaurants?", trait: Trait.EXPLORER },
  { id: 'q6', question: "Is a quiet evening with a book a perfect evening?", trait: Trait.CALM }
];

export const BINGO_BOARD_LAYOUT: (Trait | null)[] = [
  Trait.CREATIVE, Trait.SOCIAL, Trait.STRATEGIC,
  Trait.ACTIVE, Trait.EXPLORER, Trait.CALM,
  Trait.STRATEGIC, Trait.CREATIVE, Trait.ACTIVE
];