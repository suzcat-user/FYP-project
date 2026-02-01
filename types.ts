// Enum representing the different steps/screens of the arcade application flow
export enum GameStep {
  Auth = 0,
  Welcome = 1,
  WouldYouRather = 2,
  RingToss = 3,
  ShootingGallery = 4,
  Results = 5,
  Community = 6,
  HobbyCommunity = 7,
  Profile = 8
}

export enum Trait {
  CREATIVE = 'CREATIVE',
  ACTIVE = 'ACTIVE',
  STRATEGIC = 'STRATEGIC',
  CALM = 'CALM',
  SOCIAL = 'SOCIAL',
  EXPLORER = 'EXPLORER'
}

// New Personality Codes
export enum PersonalityCode {
  F = 'F', // Fitness
  C = 'C', // Creatives
  N = 'N', // Nature
  S = 'S', // Social
  L = 'L'  // Lifestyle
}

export type Scores = Record<Trait, number>;
export type PersonalityScores = Record<PersonalityCode, number>;

export interface Answer {
  text: string;
  trait: Trait;
  personalityCodes?: PersonalityCode[]; // New field for personality mapping
  description?: string;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}
export interface Personalities { 
  name: string;
  description: string;
}

export interface Hobby {
  name: string;
  description: string;
  trait?: Trait;
  communityId?: number;
}

export interface Event {
  event_id: number;
  community_id: number;
  community_name?: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  points_reward: number;
  max_participants?: number;
  participant_count?: number;
  created_by?: number;
  created_at?: string;
  joined_at?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  gifs?: string[];
}

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  attachments?: string[];
  upvotes: number;
  comments: Comment[];
  commentCount?: number;
  timestamp: string;
  createdAt?: string;
}