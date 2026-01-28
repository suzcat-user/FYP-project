import { Trait, PersonalityCode } from './types';

export const WOULD_YOU_RATHER_QUESTIONS = [
  {
    id: 1,
    question: "Would you rather engage in hobbies that are more mental than physical?",
    answers: [
      { text: "Mental", personalityCodes: [PersonalityCode.C, PersonalityCode.N, PersonalityCode.L, PersonalityCode.S] },
      { text: "Physical",personalityCodes: [PersonalityCode.F] }
    ]
  },
  {
    id: 2,
    question: "Would you rather feel challenged than relaxed?",
    answers: [
      { text: "Challenged", personalityCodes: [PersonalityCode.F, PersonalityCode.S, PersonalityCode.N] },
      { text: "Relaxed", personalityCodes: [PersonalityCode.L, PersonalityCode.C, PersonalityCode.N] }
    ]
  },
  {
    id: 3,
    question: "Would you rather spend your free time alone than with others?",
    answers: [
      { text: "Alone", personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "With others", personalityCodes: [PersonalityCode.F, PersonalityCode.S, PersonalityCode.L] }
    ]
  },
  {
    id: 4,
    question: "Would you describe yourself as patient rather than impatient?",
    answers: [
      { text: "Patient", personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Impatient", personalityCodes: [PersonalityCode.F, PersonalityCode.S] }
    ]
  },
  {
    id: 5,
    question: "Would you rather feel comfortable than open to anyone?",
    answers: [
      { text: "I prefer staying in my comfort zone", personalityCodes: [PersonalityCode.S, PersonalityCode.F, PersonalityCode.L] },
      { text: "I prefer to have new experiences ", personalityCodes: [PersonalityCode.N, PersonalityCode.C] }
    ]
  }
];

export const RING_TOSS_QUESTIONS = [
  {
    id: 1,
    question: "Why do you want a hobby?",
    answers: [
      { text: "I have free time", personalityCodes: [PersonalityCode.F, PersonalityCode.N, PersonalityCode.S] },
      { text: "Improve lifestyle & health", personalityCodes: [PersonalityCode.F, PersonalityCode.L, PersonalityCode.N] },
      { text: "Express myself creatively", personalityCodes: [PersonalityCode.C, PersonalityCode.L] },
      { text: "Meet new people & socialize", personalityCodes: [PersonalityCode.F, PersonalityCode.C, PersonalityCode.S] },
      { text: "Build better lifestyle habits", personalityCodes: [PersonalityCode.L] },
      { text: "Try something exciting & new", personalityCodes: [PersonalityCode.F, PersonalityCode.S] }
    ]
  },
  {
    id: 2,
    question: "What kind of learner are you?",
    answers: [
      { text: "Visual", personalityCodes: [PersonalityCode.C, PersonalityCode.N, PersonalityCode.L] },
      { text: "Auditory", personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Kinaesthetic", personalityCodes: [PersonalityCode.F, PersonalityCode.L, PersonalityCode.S] },
      { text: "Reading / Writing", personalityCodes: [PersonalityCode.C, PersonalityCode.L] },
      { text: "Social", personalityCodes: [PersonalityCode.S] },
      { text: "Trial & error", personalityCodes: [PersonalityCode.F, PersonalityCode.N] }
    ]
  },
  {
    id: 3,
    question: "Your ideal hobby environment is…",
    answers: [
      { text: "Fast-paced & energetic", personalityCodes: [PersonalityCode.F] },
      { text: "Competitive & intense", personalityCodes: [PersonalityCode.F, PersonalityCode.S] },
      { text: "Creative & expressive", personalityCodes: [PersonalityCode.C] },
      { text: "Quiet & natural", personalityCodes: [PersonalityCode.N] },
      { text: "Lively & social", personalityCodes: [PersonalityCode.S] },
      { text: "Comfortable & cosy", personalityCodes: [PersonalityCode.L] }
    ]
  },
  {
    id: 4,
    question: "What kind of progress do you want from a hobby?",
    answers: [
      { text: "Improved fitness & strength", personalityCodes: [PersonalityCode.F] },
      { text: "Creative skills & mastery", personalityCodes: [PersonalityCode.C] },
      { text: "Better mindset & inner calm", personalityCodes: [PersonalityCode.N] },
      { text: "Stronger social connections", personalityCodes: [PersonalityCode.S] },
      { text: "Better habits & routines", personalityCodes: [PersonalityCode.L] },
      { text: "Overall personal growth",personalityCodes: [PersonalityCode.C, PersonalityCode.N, PersonalityCode.L, PersonalityCode.S] }
    ]
  },
  {
    id: 5,
    question: "What appeals to you most about starting a new hobby?",
    answers: [
      { text: "Physical challenges & movement", personalityCodes: [PersonalityCode.F] },
      { text: "Making or creating something", personalityCodes: [PersonalityCode.C] },
      { text: "Finding peace & tranquillity", personalityCodes: [PersonalityCode.N] },
      { text: "Bonding with like-minded people", personalityCodes: [PersonalityCode.S] },
      { text: "Improving my lifestyle quality", personalityCodes: [PersonalityCode.L] },
      { text: "Pushing myself to try new things", personalityCodes: [PersonalityCode.F, PersonalityCode.S, PersonalityCode.N] }
    ]
  }
];

export const SHOOTING_GALLERY_QUESTIONS = [
  {
    id: 1,
    question: "What gives you the MOST satisfaction at this stage of life?",
    answers: [
      { text: "Feeling healthier & stronger", description: "💪",personalityCodes: [PersonalityCode.F] },
      { text: "Expressing myself creatively", description: "🎨", personalityCodes: [PersonalityCode.C] },
      { text: "Peaceful & close to nature", description: "🌿", personalityCodes: [PersonalityCode.N] },
      { text: "Connecting with people", description: "👥", personalityCodes: [PersonalityCode.S] },
      { text: "Improve lifestyle & comfort", description: "🏠", personalityCodes: [PersonalityCode.L] },
      { text: "Teaching others", description: "📚", personalityCodes: [PersonalityCode.S, PersonalityCode.C, PersonalityCode.N] }
    ]
  },
  {
    id: 2,
    question: "What motivates you to keep going when things get hard?",
    answers: [
      { text: "Seeing physical improvement", description: "📈",personalityCodes: [PersonalityCode.F] },
      { text: "Personal meaning and reflection", description: "💭", personalityCodes: [PersonalityCode.N, PersonalityCode.L] },
      { text: "Positive feedback from others", description: "💬", personalityCodes: [PersonalityCode.S] },
      { text: "Creating something unique", description: "✨", personalityCodes: [PersonalityCode.C] },
      { text: "Consistency and routine", description: "📋",personalityCodes: [PersonalityCode.L] },
      { text: "Mixing growth with enjoyment", description: "🎯", personalityCodes: [PersonalityCode.S] }
    ]
  },
  {
    id: 3,
    question: "Where do you feel most \"in the zone\"?",
    answers: [
      { text: "A gym or training space", description: "🏋️",personalityCodes: [PersonalityCode.F] },
      { text: "A quiet room with minimal distractions", description: "🧘",personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Outdoors with space to move", description: "🌄", personalityCodes: [PersonalityCode.F, PersonalityCode.N] },
      { text: "A lively space with people around", description: "🎉", personalityCodes: [PersonalityCode.S] },
      { text: "A cozy, familiar environment", description: "🛋️", personalityCodes: [PersonalityCode.L] },
      { text: "A workshop or creative studio", description: "🎨", personalityCodes: [PersonalityCode.C, PersonalityCode.L] }
    ]
  }, 
  {
    id: 4,
    question: "What's your main goal for having a hobby?",
    answers: [
      { text: "Get fit and stay active", description: "💪", personalityCodes: [PersonalityCode.F] },
      { text: "Express creativity and make things", description: "🎨", personalityCodes: [PersonalityCode.C] },
      { text: "Find peace and reconnect with nature", description: "🌿",personalityCodes: [PersonalityCode.N] },
      { text: "Meet people and build community", description: "👥", personalityCodes: [PersonalityCode.S] },
      { text: "Improve my daily lifestyle", description: "📈", personalityCodes: [PersonalityCode.L] },
      { text: "Challenge myself and grow", description: "🚀", personalityCodes: [PersonalityCode.F, PersonalityCode.C, PersonalityCode.S, PersonalityCode.N] }
    ]
  },
  {
    id: 5,
    question: "How do you prefer to learn new things?",
    answers: [
      { text: "Doing it physically", description: "🤸", personalityCodes: [PersonalityCode.F] },
      { text: "Explore & experiment", description: "🗺️", personalityCodes: [PersonalityCode.N, PersonalityCode.S] },
      { text: "Watch & observe", description: "🔬", personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Discussing and learning with others", description: "💬", personalityCodes: [PersonalityCode.S] },
      { text: "Reading and following written guides", description: "📖", personalityCodes: [PersonalityCode.L] },
      { text: "Visual & creative learning", description: "✏️", personalityCodes: [PersonalityCode.C, PersonalityCode.N] }
    ]
  }
];

