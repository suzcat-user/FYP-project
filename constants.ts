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
    question: "What gives you the MOST satisfaction at this stage of life?",
    answers: [
      { text: "Big City Tour", description: "Energy, nightlife, and crowds.", trait: Trait.SOCIAL },
      { text: "Deep Forest Cabin", description: "Quiet, birds, and solitude.", trait: Trait.CALM },
      { text: "Ancient Ruins", description: "Uncover history and adventure.", trait: Trait.EXPLORER },
      { text: "Art Museum Row", description: "Masterpieces and inspiration.", trait: Trait.CREATIVE },
      { text: "Extreme Peak", description: "Climbing and adrenaline.", trait: Trait.ACTIVE },
      { text: "Strategy Retreat", description: "Workshops and planning.", trait: Trait.STRATEGIC }
    ]
  },
  {
    id: 2,
    question: "What's your preferred Saturday morning?",
    answers: [
      { text: "Farmers Market", description: "Chatting with locals.", trait: Trait.SOCIAL },
      { text: "Sleeping In", description: "Deep rest and peace.", trait: Trait.CALM },
      { text: "Random Road Trip", description: "Seeing where the road goes.", trait: Trait.EXPLORER },
      { text: "Writing Music", description: "Expressing melodies.", trait: Trait.CREATIVE },
      { text: "Morning Run", description: "Getting the heart pumping.", trait: Trait.ACTIVE },
      { text: "Coding Projects", description: "Building complex systems.", trait: Trait.STRATEGIC }
    ]
  },
  {
    id: 3,
    question: "Pick a legendary power!",
    answers: [
      { text: "Aura of Unity", description: "Bring anyone together.", trait: Trait.SOCIAL },
      { text: "Inner Calm", description: "Immune to stress forever.", trait: Trait.CALM },
      { text: "Star-gate", description: "Travel across dimensions.", trait: Trait.EXPLORER },
      { text: "Infinite Canvas", description: "Bring drawings to life.", trait: Trait.CREATIVE },
      { text: "Super Strength", description: "Conquer any physical feat.", trait: Trait.ACTIVE },
      { text: "Foresight", description: "Perfectly predict outcomes.", trait: Trait.STRATEGIC }
    ]
  },
  {
    id: 4,
    question: "What's your ultimate comfort food vibe?",
    answers: [
      { text: "Grand Buffet", description: "Everything for everyone.", trait: Trait.SOCIAL },
      { text: "Tea & Silence", description: "Simple, warm, and quiet.", trait: Trait.CALM },
      { text: "Exotic Street Food", description: "Taste something brand new.", trait: Trait.EXPLORER },
      { text: "Artisan Pastries", description: "Beautifully crafted treats.", trait: Trait.CREATIVE },
      { text: "Power Smoothie", description: "Fuel for the next mission.", trait: Trait.ACTIVE },
      { text: "Perfectly Portion-timed Meal", description: "Precisely calculated macros.", trait: Trait.STRATEGIC }
    ]
  },
  {
    id: 5,
    question: "Choose a companion for your journey!",
    answers: [
      { text: "Talking Crowd", description: "A group of lively travelers.", trait: Trait.SOCIAL },
      { text: "Stoic Owl", description: "Wise, quiet, and watchful.", trait: Trait.CALM },
      { text: "Compass Golem", description: "Finds paths through any fog.", trait: Trait.EXPLORER },
      { text: "Living Sketchbook", description: "Draws reality as you go.", trait: Trait.CREATIVE },
      { text: "Fire Sprit", description: "Energizes your every step.", trait: Trait.ACTIVE },
      { text: "Chess Phantom", description: "Analyzes every possible move.", trait: Trait.STRATEGIC }
    ]
  }
];

export const SHOOTING_GALLERY_QUESTIONS = [
  {
    id: 1,
    question: "Pick your ideal creative workspace!",
    answers: [
      { text: "Neon Workshop", description: "Lasers, 3D printers, and LEDs.", trait: Trait.CREATIVE },
      { text: "War Room", description: "Monitors, maps, and chess boards.", trait: Trait.STRATEGIC },
      { text: "Sky Cabin", description: "Binoculars and charts.", trait: Trait.EXPLORER },
      { text: "Festival Tent", description: "Loud music and crowds.", trait: Trait.SOCIAL },
      { text: "Crossfit Box", description: "Heavy weights and sweat.", trait: Trait.ACTIVE },
      { text: "Cloud Temple", description: "Silence and white space.", trait: Trait.CALM }
    ]
  },
  {
    id: 2,
    question: "What's your core motivation?",
    answers: [
      { text: "Self Expression", description: "I want to show the world who I am.", trait: Trait.CREATIVE },
      { text: "Perfect Efficiency", description: "I want systems that never fail.", trait: Trait.STRATEGIC },
      { text: "Pure Freedom", description: "I want to go where no one has gone.", trait: Trait.EXPLORER },
      { text: "True Belonging", description: "I want to be part of something big.", trait: Trait.SOCIAL },
      { text: "Peak Performance", description: "I want to test my limits.", trait: Trait.ACTIVE },
      { text: "Inner Peace", description: "I want to be calm in the storm.", trait: Trait.CALM }
    ]
  },
  {
    id: 3,
    question: "Choose a weapon for your digital avatar!",
    answers: [
      { text: "Gravity Pen", description: "Draws platforms in mid-air.", trait: Trait.CREATIVE },
      { text: "Tactic-Drone", description: "Surveys and outsmarts.", trait: Trait.STRATEGIC },
      { text: "Warp Compass", description: "Teleports to new biomes.", trait: Trait.EXPLORER },
      { text: "Voice of Command", description: "Controls the npc crowds.", trait: Trait.SOCIAL },
      { text: "Turbo Gauntlets", description: "Punches through barriers.", trait: Trait.ACTIVE },
      { text: "Zen Aegis", description: "A shield of pure tranquility.", trait: Trait.CALM }
    ]
  },
  {
    id: 4,
    question: "What's your dream project launch?",
    answers: [
      { text: "Gallery Opening", description: "Your art on every wall.", trait: Trait.CREATIVE },
      { text: "Global Launch", description: "Flawless logistics at scale.", trait: Trait.STRATEGIC },
      { text: "Expedition Start", description: "Setting sail for the unknown.", trait: Trait.EXPLORER },
      { text: "City Block Party", description: "Everyone celebrating together.", trait: Trait.SOCIAL },
      { text: "Stadium Final", description: "Peak competition at its best.", trait: Trait.ACTIVE },
      { text: "Quiet Release", description: "Shared slowly with loved ones.", trait: Trait.CALM }
    ]
  },
  {
    id: 5,
    question: "What defines a perfect day?",
    answers: [
      { text: "Flow State", description: "Losing track of time making things.", trait: Trait.CREATIVE },
      { text: "Clean Victory", description: "Winning a tough mental game.", trait: Trait.STRATEGIC },
      { text: "New Sights", description: "Finding a place I never knew existed.", trait: Trait.EXPLORER },
      { text: "Good Vibes", description: "Laughing until my stomach hurts.", trait: Trait.SOCIAL },
      { text: "Endorphin Rush", description: "That post-workout glow.", trait: Trait.ACTIVE },
      { text: "Complete Stillness", description: "Just me and the sunset.", trait: Trait.CALM }
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