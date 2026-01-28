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
   * Fetch all users ranked by score (highest first)
   * @param limit - Optional limit on number of results
   * @returns Array of ranked users sorted by score
   */
  async getTopPlayers(limit?: number): Promise<LeaderboardEntry[]> {
    try {
      const url = limit 
        ? `/api/users/leaderboard/top?limit=${limit}`
        : '/api/users/leaderboard/top';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
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
      const leaderboard = await this.getTopPlayers();
      const userRank = leaderboard.findIndex(entry => entry.user_id === userId) + 1;
      
      return {
        rank: userRank || 0,
        score: userData.score || 0,
      };
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }
  },
};
