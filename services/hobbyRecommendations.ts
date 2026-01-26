import { PersonalityScores, PersonalityCode, Hobby } from '../types';

export interface PersonalityResult {
  code: PersonalityCode;
  name: string;
  description: string;
  communities: string[];
  hobbies: string[];
}

const PERSONALITY_DATA: Record<PersonalityCode, PersonalityResult> = {
  [PersonalityCode.F]: {
    code: PersonalityCode.F,
    name: "Fitness",
    description: "You enjoy physical activity and challenges.",
    communities: ["Outdoor & Fitness"],
    hobbies: [
      "Jogging",
      "Hiking",
      "Gym",
      "Cycling",
      "Bootcamp",
      "Yoga",
      "HIIT",
      "Outdoor challenges"
    ]
  },
  [PersonalityCode.C]: {
    code: PersonalityCode.C,
    name: "Creatives",
    description: "You enjoy expressing yourself.",
    communities: ["Arts", "Crafts", "Music"],
    hobbies: [
      "Drawing",
      "Painting",
      "Pottery",
      "Calligraphy",
      "Jewellery making",
      "Guitar",
      "Piano",
      "Singing"
    ]
  },
  [PersonalityCode.N]: {
    code: PersonalityCode.N,
    name: "Nature",
    description: "You enjoy peace and nature.",
    communities: ["Outdoor & Fitness"],
    hobbies: [
      "Gardening",
      "Nature walks",
      "Nature photography",
      "Hiking",
      "Beach clean-ups"
    ]
  },
  [PersonalityCode.S]: {
    code: PersonalityCode.S,
    name: "Social",
    description: "You enjoy being with others.",
    communities: ["Culinary", "Gaming"],
    hobbies: [
      "Badminton matches",
      "Group cooking",
      "Multiplayer games",
      "Board games"
    ]
  },
  [PersonalityCode.L]: {
    code: PersonalityCode.L,
    name: "Lifestyle",
    description: "You enjoy comfort and routines.",
    communities: ["Culinary", "Arts", "Music"],
    hobbies: [
      "Cooking",
      "Baking",
      "Journaling",
      "DIY decor",
      "Playing instruments",
      "Making playlists"
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
  
  // Convert hobby strings to Hobby objects
  return personality.hobbies.map(hobby => ({
    name: hobby,
    description: `${hobby} - ${personality.description}`
  }));
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
