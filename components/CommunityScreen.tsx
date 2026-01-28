
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scores, Trait, Hobby } from '../types';
import EventsComponent from './EventsComponent';
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
  const [showEvents, setShowEvents] = useState(false);

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
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0f] text-indigo-100' : 'bg-[#0f172a] text-white'}`}>
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
          <div className="flex justify-center gap-8 mt-6">
            {hobbies.map((hobby) => (
              <button
              key={hobby.name}
              onClick={() => onSelectHobby(hobby)}
              className="flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-16 h-16 flex items-center justify-center text-3xl border-4 transition-all group-hover:scale-110 ${isDarkMode ? 'bg-indigo-900 border-indigo-700' : 'bg-sky-800 border-sky-600'}`}>
                  {HOBBY_PORTAL_ICON}
                </div>
                <span className={`font-press-start text-[1vmin] mt-2 ${isDarkMode ? 'text-indigo-200' : 'text-sky-200'}`}>{hobby.name}</span>
              </button>
            ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden px-[4vmin] py-[4vmin] flex flex-col max-w-[1000px] mx-auto w-full z-10">
          {/* Events Button */}
          <div className="mb-4 flex justify-end gap-3">
            <button
              onClick={() => setShowEvents(!showEvents)}
              className={`font-press-start text-[1.2vmin] px-4 py-2 border-4 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all ${
                isDarkMode 
                  ? 'bg-purple-600 border-purple-800 text-purple-100 hover:bg-purple-700' 
                  : 'bg-purple-500 border-purple-700 text-white hover:bg-purple-600'
              }`}
            >
              🎉 {showEvents ? 'HIDE EVENTS' : 'SHOW EVENTS'}
            </button>
          </div>

          {/* Events Section */}
          {showEvents && userId && (
            <div className={`mb-4 border-4 p-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-purple-700' : 'bg-slate-800 border-purple-600'}`}>
              <EventsComponent 
                userId={userId}
                communityId={communityId}
                isDarkMode={isDarkMode}
                onEventJoined={handleEventJoined}
                onEventLeft={handleEventLeft}
              />
            </div>
          )}

          <div className={`border-8 flex-1 flex flex-col transition-colors duration-500 ${isDarkMode ? 'border-indigo-900 bg-black/80 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'border-sky-800 bg-sky-950/90'}`}>
              
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
                      {leaderboard.map((player) => (
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
                    <>
                      <div className="flex items-center p-4 bg-pink-600/20 animate-pulse border-y-4 border-pink-500/50">
                        <div className="w-[15%] text-center font-press-start text-[2vmin]">👤</div>
                        <div className="w-[40%] flex items-center gap-4">
                          <span className="opacity-40">[YOU]</span>
                          <span className="text-yellow-400 font-bold uppercase tracking-wider">YOUR SCORE</span>
                        </div>
                        <div className="w-[20%] text-center font-press-start text-[1vmin]">RANK #1</div>
                        <div className="w-[25%] text-right font-press-start text-[1.5vmin] text-white">
                          <AnimatedScore finalValue={userScore} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <span className="font-press-start text-[1.2vmin] opacity-70 block">LEADERBOARD DATA</span>
                          <span className="font-press-start text-[1vmin] opacity-50 block mt-2">Coming Soon</span>
                        </div>
                      </div>
                    </>
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
