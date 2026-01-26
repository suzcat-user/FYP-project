import { PersonalityScores, PersonalityCode, Hobby } from '../types';

export interface PersonalityResult {
  code: PersonalityCode;
  name: string;
  emoji: string;
  description: string;
  communities: string[];
  hobbies: Hobby[];
}

const PERSONALITY_DATA: Record<PersonalityCode, PersonalityResult> = {
  [PersonalityCode.F]: {
    code: PersonalityCode.F,
    name: "Fitness",
    emoji: "🏃",
    description: "You thrive on movement, competition, and pushing your limits. Physical challenges energize you, and you feel most confident when you are actively improving your strength, stamina, or agility.",
    communities: ["Outdoor & Fitness"],
    hobbies: [
      { name: "Jogging", description: "Steady-paced runs that build endurance and keep your heart strong. It is an easy habit to start, works well with music or podcasts, and helps clear your mind after a busy day." },
      { name: "Hiking", description: "Trail walks that combine fitness with scenic exploration and fresh air. You can choose gentle routes or steep climbs, making it a flexible way to stay active and enjoy nature." },
      { name: "Gym", description: "Strength and conditioning sessions using weights or machines to reach clear goals. Tracking progress over time keeps motivation high while improving power, posture, and overall health." },
      { name: "Cycling", description: "Road or park rides that boost stamina and leg strength while letting you explore your surroundings. It is low-impact, great for long sessions, and easy to scale in intensity." },
      { name: "Bootcamp", description: "Group circuits that mix cardio and strength challenges for a fun, high-energy workout. The variety keeps boredom away while the group vibe pushes you to go further." },
      { name: "Yoga", description: "Flexibility and balance practice with mindful breathing to relax the body and sharpen focus. Regular sessions improve mobility and recovery while reducing stress." },
      { name: "HIIT", description: "Short, intense intervals designed for maximum calorie burn in minimal time. It is perfect for busy schedules and delivers a big fitness boost quickly." },
      { name: "Outdoor challenges", description: "Obstacle or adventure-style events that test agility, strength, and grit. Training for these challenges adds purpose to workouts and builds confidence through achievement." }
    ]
  },
  [PersonalityCode.C]: {
    code: PersonalityCode.C,
    name: "Creatives",
    emoji: "🎨",
    description: "You are driven by imagination and love turning ideas into something tangible. Creative outlets help you express emotions, explore new styles, and find inspiration in everyday moments.",
    communities: ["Arts", "Crafts", "Music"],
    hobbies: [
      { name: "Drawing", description: "Sketching ideas and scenes with pencil or pen to capture imagination. It builds observation skills, improves hand control, and is an easy way to express feelings visually." },
      { name: "Painting", description: "Creating artwork with acrylics, watercolor, or oils to explore color and texture. Each piece becomes a personal statement, and practice unlocks new creative styles." },
      { name: "Pottery", description: "Shaping clay into functional or decorative pieces using wheel or hand-building methods. The tactile process is calming, and finished work feels uniquely personal." },
      { name: "Calligraphy", description: "Stylized lettering for cards, art, or journaling that turns words into visual art. It is a relaxing craft that rewards patience and steady practice." },
      { name: "Jewellery making", description: "Designing wearable pieces with beads or wire to create custom accessories. You can experiment with colors, textures, and patterns for a signature look." },
      { name: "Guitar", description: "Learning chords and songs on acoustic or electric guitar to build rhythm and confidence. It is versatile for solo play or jamming with others." },
      { name: "Piano", description: "Playing melodies and building technique on the keys with structured practice. It develops musical understanding and lets you interpret songs with your own style." },
      { name: "Singing", description: "Vocal practice for expression, harmony, and confidence across different genres. It improves breathing control and helps you connect emotionally with music." }
    ]
  },
  [PersonalityCode.N]: {
    code: PersonalityCode.N,
    name: "Nature",
    emoji: "🌿",
    description: "You feel most balanced when surrounded by the outdoors and quiet spaces. Nature helps you recharge, stay grounded, and appreciate the simple beauty of the world around you.",
    communities: ["Outdoor & Fitness"],
    hobbies: [
      { name: "Gardening", description: "Growing plants and creating calm, green spaces that bring daily peace. It teaches patience, connects you with seasons, and rewards you with visible progress." },
      { name: "Nature walks", description: "Slow strolls to unwind and observe wildlife, trees, and changing weather. It is a gentle routine that supports mental clarity and everyday balance." },
      { name: "Nature photography", description: "Capturing landscapes, plants, and outdoor moments to preserve beauty and detail. It encourages you to slow down, notice light, and appreciate small scenes." },
      { name: "Hiking", description: "Exploring trails for exercise and fresh air while discovering quiet, scenic places. Each route offers a new experience and a refreshing break from screens." },
      { name: "Beach clean-ups", description: "Community efforts to protect coastlines and habitats through hands-on action. It is meaningful, social, and leaves a visible positive impact on nature." }
    ]
  },
  [PersonalityCode.S]: {
    code: PersonalityCode.S,
    name: "Social",
    emoji: "🤝",
    description: "You draw energy from connecting with people and sharing experiences. Group activities, teamwork, and lively conversations help you feel engaged and motivated.",
    communities: ["Culinary", "Gaming"],
    hobbies: [
      { name: "Badminton matches", description: "Friendly rallies that keep you active together while boosting coordination. It is fast-paced, easy to learn, and perfect for social play." },
      { name: "Group cooking", description: "Sharing recipes and preparing meals as a team to bond and learn. It turns everyday food into a fun event and encourages creative collaboration." },
      { name: "Multiplayer games", description: "Co-op or competitive play with friends that builds teamwork and friendly rivalry. It is a great way to stay connected and share memorable moments." },
      { name: "Board games", description: "Tabletop sessions that spark conversation, laughter, and strategy. From party games to deep tactics, there is always something new to try together." }
    ]
  },
  [PersonalityCode.L]: {
    code: PersonalityCode.L,
    name: "Lifestyle",
    emoji: "🧘",
    description: "You value comfort, balance, and the small routines that make life feel steady. Relaxing hobbies and familiar rituals help you recharge and create a peaceful everyday flow.",
    communities: ["Culinary", "Arts", "Music"],
    hobbies: [
      { name: "Cooking", description: "Trying recipes and building everyday kitchen skills you can rely on. It brings comfort through routine while giving space to experiment with flavors." },
      { name: "Baking", description: "Creating breads and desserts with relaxing precision and a cozy payoff. Measuring, mixing, and timing make it a satisfying and mindful process." },
      { name: "Journaling", description: "Reflective writing for clarity and routine, helping you track goals and feelings. It is a peaceful habit that supports self-awareness over time." },
      { name: "DIY decor", description: "Personalizing your space with simple crafts that make home feel special. Small projects add warmth and let your personality show through details." },
      { name: "Playing instruments", description: "Practicing music to unwind and improve focus with steady progress. It builds patience and gives you a creative outlet whenever you need a reset." },
      { name: "Making playlists", description: "Curating music to match moods and moments for study, relaxation, or workouts. It is a simple ritual that can boost energy or bring calm." }
    ]
  }
};

export const getPersonalityFromScores = (scores: PersonalityScores): PersonalityResult => {
  // Find the personality with the highest score
  const entries = Object.entries(scores) as [PersonalityCode, number][];
  const sortedEntries = entries.sort(([, a], [, b]) => b - a);
  
  const topPersonalityCode = sortedEntries[0][0];
  return PERSONALITY_DATA[topPersonalityCode];
};

export const getHobbyRecommendations = (scores: PersonalityScores): Hobby[] => {
  const personality = getPersonalityFromScores(scores);

  return personality.hobbies;
};

export const getPersonalityDescription = (scores: PersonalityScores): { name: string; description: string } => {
  const personality = getPersonalityFromScores(scores);
  return {
    name: personality.name,
    description: personality.description
  };
};

export const getCommunityRecommendations = (scores: PersonalityScores): string[] => {
  const personality = getPersonalityFromScores(scores);
  return personality.communities;
};
