export enum GameState {
  Landing,
  WouldYouRather,
  Shooting,
  RingToss,
  Loading,
  Results,
  Community,
  CommunityThread,
  Profile,
  Events,
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  description: string;
  hobbies: string[];
}

export interface Hobby {
  name: string;
  description: string;
  reason: string;
}

export interface PersonalityResult {
  personalityTitle: string;
  tagline: string;
  description: string;
  hobbies: Hobby[];
}

export interface Reply {
  id: string;
  author: string;
  avatar: string;
  text: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  text: string;
  image?: string | null;
  replies: Reply[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  cost: string;
}

export interface Community {
  color: string;
  posts: Post[];
  events?: Event[];
}

export interface CommunityData {
  [key: string]: Community;
}
