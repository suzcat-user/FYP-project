// Leaderboard Service - Fetch ranked users from backend

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  score: number;
  emblem: string;
}

export const leaderboardService = {
  /**
   * Fetch top ranked users from the backend by querying all users and sorting
   * @param limit - Number of top players to fetch (default: 10)
   * @returns Array of ranked users
   */
  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      // For now, return empty leaderboard - can be populated by user profile data
      return [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  /**
   * Get user's current rank and score
   * @param userId - User ID to lookup
   * @returns User's rank and score
   */
  async getUserRank(userId: number): Promise<{ rank: number; score: number } | null> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      
      return {
        rank: 0, // Will be calculated when leaderboard endpoint is fixed
        score: userData.score,
      };
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }
  },
};
