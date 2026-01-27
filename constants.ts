import { Trait, PersonalityCode } from './types';

export const WOULD_YOU_RATHER_QUESTIONS = [
  {
    id: 1,
    question: "Would you rather engage in hobbies that are more mental than physical?",
    answers: [
      { text: "Mental", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.C, PersonalityCode.N, PersonalityCode.L, PersonalityCode.S] },
      { text: "Physical", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] }
    ]
  },
  {
    id: 2,
    question: "Would you rather feel challenged than relaxed?",
    answers: [
      { text: "Challenged", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.F, PersonalityCode.S, PersonalityCode.N] },
      { text: "Relaxed", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L, PersonalityCode.C, PersonalityCode.N] }
    ]
  },
  {
    id: 3,
    question: "Would you rather spend your free time alone than with others?",
    answers: [
      { text: "Alone", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "With others", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.F, PersonalityCode.S, PersonalityCode.L] }
    ]
  },
  {
    id: 4,
    question: "Would you describe yourself as patient rather than impatient?",
    answers: [
      { text: "Patient", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Impatient", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.F, PersonalityCode.S] }
    ]
  },
  {
    id: 5,
    question: "Would you rather feel comfortable than open to anyone?",
    answers: [
      { text: "I prefer staying in my comfort zone", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.S, PersonalityCode.F, PersonalityCode.L] },
      { text: "I prefer to have new experiences ", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.N, PersonalityCode.C] }
    ]
  }
];

export const RING_TOSS_QUESTIONS = [
  {
    id: 1,
    question: "Why do you want a hobby?",
    answers: [
      { text: "I have free time", trait: Trait.CALM, personalityCodes: [PersonalityCode.F, PersonalityCode.N, PersonalityCode.S] },
      { text: "Improve lifestyle & health", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F, PersonalityCode.L, PersonalityCode.N] },
      { text: "Express myself creatively", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C, PersonalityCode.L] },
      { text: "Meet new people & socialize", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.F, PersonalityCode.C, PersonalityCode.S] },
      { text: "Build better lifestyle habits", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Try something exciting & new", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.F, PersonalityCode.S] }
    ]
  },
  {
    id: 2,
    question: "What kind of learner are you?",
    answers: [
      { text: "Visual", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C, PersonalityCode.N, PersonalityCode.L] },
      { text: "Auditory", trait: Trait.CALM, personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Kinaesthetic", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F, PersonalityCode.L, PersonalityCode.S] },
      { text: "Reading / Writing", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.C, PersonalityCode.L] },
      { text: "Social", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Trial & error", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.F, PersonalityCode.N] }
    ]
  },
  {
    id: 3,
    question: "Your ideal hobby environment is…",
    answers: [
      { text: "Fast-paced & energetic", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Competitive & intense", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.F, PersonalityCode.S] },
      { text: "Creative & expressive", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C] },
      { text: "Quiet & natural", trait: Trait.CALM, personalityCodes: [PersonalityCode.N] },
      { text: "Lively & social", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Comfortable & cosy", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.L] }
    ]
  },
  {
    id: 4,
    question: "What kind of progress do you want from a hobby?",
    answers: [
      { text: "Improved fitness & strength", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Creative skills & mastery", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C] },
      { text: "Better mindset & inner calm", trait: Trait.CALM, personalityCodes: [PersonalityCode.N] },
      { text: "Stronger social connections", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Better habits & routines", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Overall personal growth", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.C, PersonalityCode.N, PersonalityCode.L, PersonalityCode.S] }
    ]
  },
  {
    id: 5,
    question: "What appeals to you most about starting a new hobby?",
    answers: [
      { text: "Physical challenges & movement", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Making or creating something", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C] },
      { text: "Finding peace & tranquillity", trait: Trait.CALM, personalityCodes: [PersonalityCode.N] },
      { text: "Bonding with like-minded people", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Improving my lifestyle quality", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Pushing myself to try new things", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.F, PersonalityCode.S, PersonalityCode.N] }
    ]
  }
];

export const SHOOTING_GALLERY_QUESTIONS = [
  {
    id: 1,
    question: "What gives you the MOST satisfaction at this stage of life?",
    answers: [
      { text: "Feeling healthier & stronger", description: "💪", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Expressing myself creatively", description: "🎨", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C] },
      { text: "Peaceful & close to nature", description: "🌿", trait: Trait.CALM, personalityCodes: [PersonalityCode.N] },
      { text: "Connecting with people", description: "👥", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Improve lifestyle & comfort", description: "🏠", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Teaching others", description: "📚", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.S, PersonalityCode.C, PersonalityCode.N] }
    ]
  },
  {
    id: 2,
    question: "What motivates you to keep going when things get hard?",
    answers: [
      { text: "Seeing physical improvement", description: "📈", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Personal meaning and reflection", description: "💭", trait: Trait.CALM, personalityCodes: [PersonalityCode.N, PersonalityCode.L] },
      { text: "Positive feedback from others", description: "💬", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Creating something unique", description: "✨", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C] },
      { text: "Consistency and routine", description: "📋", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Mixing growth with enjoyment", description: "🎯", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.S] }
    ]
  },
  {
    id: 3,
    question: "Where do you feel most \"in the zone\"?",
    answers: [
      { text: "A gym or training space", description: "🏋️", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "A quiet room with minimal distractions", description: "🧘", trait: Trait.CALM, personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Outdoors with space to move", description: "🌄", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.F, PersonalityCode.N] },
      { text: "A lively space with people around", description: "🎉", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "A cozy, familiar environment", description: "🛋️", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "A workshop or creative studio", description: "🎨", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C, PersonalityCode.L] }
    ]
  }, 
  {
    id: 4,
    question: "What's your main goal for having a hobby?",
    answers: [
      { text: "Get fit and stay active", description: "💪", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Express creativity and make things", description: "🎨", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C] },
      { text: "Find peace and reconnect with nature", description: "🌿", trait: Trait.CALM, personalityCodes: [PersonalityCode.N] },
      { text: "Meet people and build community", description: "👥", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Improve my daily lifestyle", description: "📈", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Challenge myself and grow", description: "🚀", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.F, PersonalityCode.C, PersonalityCode.S, PersonalityCode.N] }
    ]
  },
  {
    id: 5,
    question: "How do you prefer to learn new things?",
    answers: [
      { text: "Doing it physically", description: "🤸", trait: Trait.ACTIVE, personalityCodes: [PersonalityCode.F] },
      { text: "Explore & experiment", description: "🗺️", trait: Trait.CALM, personalityCodes: [PersonalityCode.N, PersonalityCode.S] },
      { text: "Watch & observe", description: "🔬", trait: Trait.EXPLORER, personalityCodes: [PersonalityCode.C, PersonalityCode.N] },
      { text: "Discussing and learning with others", description: "💬", trait: Trait.SOCIAL, personalityCodes: [PersonalityCode.S] },
      { text: "Reading and following written guides", description: "📖", trait: Trait.STRATEGIC, personalityCodes: [PersonalityCode.L] },
      { text: "Visual & creative learning", description: "✏️", trait: Trait.CREATIVE, personalityCodes: [PersonalityCode.C, PersonalityCode.N] }
    ]
  }
];

