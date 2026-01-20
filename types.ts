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

export type Scores = Record<Trait, number>;

export interface Answer {
  text: string;
  trait: Trait;
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
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  gif?: string;
}

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  attachment?: string;
  upvotes: number;
  comments: Comment[];
  timestamp: string;
}