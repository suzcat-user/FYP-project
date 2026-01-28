
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scores, Trait, Hobby } from '../types';
import { leaderboardService, LeaderboardEntry } from '../services/leaderboardService';

interface CommunityScreenProps {
  onRestart: () => void;
  scores: Scores;
  hobbies: Hobby[];
  onSelectHobby: (hobby: Hobby) => void;
  isDarkMode?: boolean;
  userId?: number;
  communityId?: number;
  onScoreUpdate?: (newScore: number) => void;
  onEventJoined?: (event: any, points: number) => void;
  onEventLeft?: (event: any, points: number) => void;
  eventScore?: number;
}

const HOBBY_PORTAL_ICON = "🧩";

// Animated Score Counter Component
const AnimatedScore: React.FC<{ finalValue: number; duration?: number }> = ({ finalValue, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(finalValue * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [finalValue, duration]);

  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: 'bold',
        transition: 'all 0.1s ease-out',
        textShadow: isAnimating 
          ? '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)'
          : '0 0 5px rgba(34, 211, 238, 0.4)',
        color: isAnimating ? '#fff' : '#06b6d4',
        transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
        letterSpacing: '1px',
      }}
    >
      {displayValue.toLocaleString()}
    </span>
  );
};

// Shooting Star Component
const ShootingStar: React.FC = () => {
  const randomLeft = Math.random() * 100;
  const randomDelay = Math.random() * 2;
  const randomDuration = 2 + Math.random() * 1;

  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${randomLeft}%`,
        top: '-20px',
        width: '6px',
        height: '6px',
        animation: `shootingStar ${randomDuration}s linear ${randomDelay}s infinite`,
        boxShadow: '0 0 20px 4px rgba(255, 220, 100, 0.9), 0 0 40px 8px rgba(255, 200, 50, 0.6)',
        background: 'linear-gradient(to right, rgba(255, 255, 200, 1), rgba(255, 220, 100, 0.5))',
      }}
    />
  );
};

const CommunityScreen: React.FC<CommunityScreenProps> = ({ onRestart, scores, hobbies, onSelectHobby, isDarkMode = false, userId, communityId, onScoreUpdate, onEventJoined, onEventLeft, eventScore = 0 }) => {
  const navigate = useNavigate();
  const traits = Object.keys(scores) as Trait[];
  const topTrait = traits.reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  // Score comes ONLY from event joins, not from game scores
  const [userScore, setUserScore] = useState(eventScore);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Fetch leaderboard data on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true);
        const topPlayers = await leaderboardService.getTopPlayers(10);
        setLeaderboard(topPlayers);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        // Fallback to empty state
        setLeaderboard([]);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Update user score whenever eventScore changes
  useEffect(() => {
    setUserScore(eventScore);
  }, [eventScore]);

  const handleEventJoined = (event: any, pointsEarned: number) => {
    // Call the parent callback to update the global event score
    if (onEventJoined) {
      onEventJoined(event, pointsEarned);
    }
  };

  const handleEventLeft = (event: any, pointsDeducted: number) => {
    // Call the parent callback to deduct the event score
    if (onEventLeft) {
      onEventLeft(event, pointsDeducted);
    }
  };

  return (
    <div className={`h-full flex flex-col relative overflow-y-auto overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0f] text-indigo-100' : 'bg-[#0f172a] text-white'}`}>
      {/* Shooting Stars Background */}
      <style>{`
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Shooting Stars Container */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <ShootingStar key={i} />
        ))}
      </div>
      
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
      
      {/* Title */}
      <div className="text-center pt-8 relative z-10">
          <h1 className={`font-press-start text-[4vmin] drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] ${isDarkMode ? 'text-pink-500' : 'text-yellow-400'}`}>
              HALL OF FAME
          </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-[4vmin] py-[4vmin] flex flex-col max-w-[1000px] mx-auto w-full z-10">
          <div className={`border-8 flex-1 flex flex-col transition-colors duration-500 ${isDarkMode ? 'border-indigo-900 bg-black/80 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'border-sky-800 bg-sky-950/90'}`}>
            {/* Podium for Top 3 */}
            {!isLoadingLeaderboard && leaderboard && leaderboard.length > 0 && (
              <div className="flex justify-center items-end gap-20 py-12">
                {/* 2nd Place */}
                {leaderboard[1] && (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-400/80 rounded-t-lg rounded-b-sm w-36 h-56 flex flex-col justify-end items-center shadow-2xl border-b-8 border-gray-500">
                      <span className="text-7xl mb-4">🥈</span>
                      <span className="font-press-start text-[2.2vmin] text-white mb-2">{leaderboard[1].username}</span>
                      <span className="font-press-start text-[2vmin] text-cyan-200 mb-6">{leaderboard[1].score} XP</span>
                    </div>
                    <span className="mt-4 font-press-start text-[1.5vmin] text-gray-300">2nd</span>
                  </div>
                )}
                {/* 1st Place */}
                {leaderboard[0] && (
                  <div className="flex flex-col items-center">
                    <div className="bg-yellow-400/90 rounded-t-lg rounded-b-sm w-44 h-72 flex flex-col justify-end items-center shadow-2xl border-b-[14px] border-yellow-600">
                      <span className="text-8xl mb-4">🥇</span>
                      <span className="font-press-start text-[2.7vmin] text-black mb-2">{leaderboard[0].username}</span>
                      <span className="font-press-start text-[2.2vmin] text-sky-900 mb-6">{leaderboard[0].score} XP</span>
                    </div>
                    <span className="mt-4 font-press-start text-[2vmin] text-yellow-300">1st</span>
                  </div>
                )}
                {/* 3rd Place */}
                {leaderboard[2] && (
                  <div className="flex flex-col items-center">
                    <div className="bg-orange-400/80 rounded-t-lg rounded-b-sm w-36 h-48 flex flex-col justify-end items-center shadow-2xl border-b-8 border-orange-600">
                      <span className="text-7xl mb-4">🥉</span>
                      <span className="font-press-start text-[2.2vmin] text-white mb-2">{leaderboard[2].username}</span>
                      <span className="font-press-start text-[2vmin] text-cyan-200 mb-6">{leaderboard[2].score} XP</span>
                    </div>
                    <span className="mt-4 font-press-start text-[1.5vmin] text-orange-200">3rd</span>
                  </div>
                )}
              </div>
            )}
              
              <div className="flex p-4 font-press-start text-[1.5vmin] border-b-8 border-current bg-white/5">
                  <div className="w-[15%] text-center">RANK</div>
                  <div className="w-[40%]">PLAYER</div>
                  <div className="w-[20%] text-center">CLASS</div>
                  <div className="w-[25%] text-right">TOTAL XP</div>
              </div>

              <div className="flex-1 overflow-y-auto font-vt323 text-[3vmin] divide-y-4 divide-white/5">
                  {isLoadingLeaderboard ? (
                    <div className="flex items-center justify-center h-full">
                      <span className="font-press-start text-[1.5vmin] opacity-70">LOADING LEADERBOARD...</span>
                    </div>
                  ) : leaderboard && leaderboard.length > 0 ? (
                    <>
                      {leaderboard.slice(3, 10).map((player) => (
                        <div key={player.rank} className="flex items-center p-4 hover:bg-white/10 transition-colors group">
                          <div className={`w-[15%] text-center font-press-start text-[2vmin]`}>
                            {player.emblem}
                          </div>
                          <div className="w-[40%] flex items-center gap-4">
                            <span className="opacity-40">[USER]</span>
                            <span className="group-hover:text-pink-400 transition-colors uppercase tracking-wider">{player.username}</span>
                          </div>
                          <div className={`w-[20%] text-center font-press-start text-[1vmin] opacity-70`}>
                            PLAYER_{player.rank}
                          </div>
                          <div className="w-[25%] text-right font-press-start text-[1.5vmin] text-cyan-400">
                            <AnimatedScore finalValue={player.score} />
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center p-4 bg-pink-600/20 animate-pulse border-y-4 border-pink-500/50">
                        <div className="w-[15%] text-center font-press-start text-[2vmin]">👤</div>
                        <div className="w-[40%] flex items-center gap-4">
                          <span className="opacity-40">[LOC]</span>
                          <span className="text-yellow-400 font-bold uppercase tracking-wider">YOU (P1)</span>
                        </div>
                        <div className="w-[20%] text-center font-press-start text-[1vmin]">PLAYER_1</div>
                        <div className="w-[25%] text-right font-press-start text-[1.5vmin] text-white">
                          <AnimatedScore finalValue={userScore} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <span className="font-press-start text-[1.2vmin] opacity-70 block">NO LEADERBOARD DATA</span>
                        <span className="font-press-start text-[1vmin] opacity-50 block mt-2">Join events to appear!</span>
                      </div>
                    </div>
                  )}
              </div>
          </div>
      </div>

      <div className={`py-6 flex justify-center border-t-8 transition-colors duration-500 ${isDarkMode ? 'bg-black/80 border-indigo-950' : 'bg-black/60 border-sky-900'}`}>
          <button
              onClick={() => navigate('/home')}
              className={`font-press-start text-[2vmin] px-12 py-4 border-b-8 border-r-8 active:border-0 active:translate-y-2 transition-all ${isDarkMode ? 'bg-pink-600 border-pink-900' : 'bg-yellow-400 border-yellow-700 text-sky-950'}`}
          >
              PLAY AGAIN
          </button>
      </div>
    </div>
  );
};

export default CommunityScreen;
