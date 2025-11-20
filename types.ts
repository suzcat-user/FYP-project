
export interface HobbySuggestion {
  name: string;
  description: string;
  whyItFits: string;
}

export interface PersonaResult {
  archetype: string;
  tagline: string;
  description: string;
  bingoTiles: string[]; 
  hobbies: HobbySuggestion[];
}

export enum GameState {
  LANDING,
  LEVEL_1_WHACK,
  LEVEL_2_TARGET,
  LEVEL_3_HOOP,
  LEVEL_4_BINGO,
  ANALYZING,
  RESULT
}
