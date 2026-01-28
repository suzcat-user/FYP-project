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
   * Fetch top ranked users from the leaderboard
   * @param limit - Number of top players to fetch (default: 10)
   * @returns Array of ranked users
   */
  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`/api/users/leaderboard/top?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      return await response.json();
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
      
      // Fetch full leaderboard to determine rank
      const leaderboard = await this.getTopPlayers(100);
      const userRank = leaderboard.findIndex(entry => entry.user_id === userId) + 1;
      
      return {
        rank: userRank || 0,
        score: userData.score,
      };
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }
  },
};
