
import React from 'react';
import { Scores, Trait } from '../types';

interface CommunityScreenProps {
  onRestart: () => void;
  scores: Scores;
  isDarkMode?: boolean;
}

const LEADERBOARD_DATA = [
    { rank: 1, name: "ARCADE_WIZ", type: "THE MAKER", score: 9850, country: "JP", emblem: "🏆" },
    { rank: 2, name: "PIXEL_KAT", type: "THE SCOUT", score: 9420, country: "US", emblem: "🥈" },
    { rank: 3, name: "NEON_RYU", type: "THE BRAIN", score: 8900, country: "KR", emblem: "🥉" },
    { rank: 4, name: "VAPOR_WAVE", type: "THE BARD", score: 8550, country: "UK", emblem: "✨" },
    { rank: 5, name: "BIT_HERO", type: "THE DYNAMO", score: 8200, country: "CA", emblem: "🔥" },
];

const HOBBY_PORTALS = [
    { name: "Game Dev", id: "gdev", icon: "👾", color: "text-pink-500" },
    { name: "Pottery", id: "pot", icon: "🏺", color: "text-orange-400" },
    { name: "Climbing", id: "climb", icon: "🧗", color: "text-green-500" }
];

const CommunityScreen: React.FC<CommunityScreenProps> = ({ onRestart, scores, isDarkMode = false }) => {
  const traits = Object.keys(scores) as Trait[];
  const topTrait = traits.reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  const totalScore = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0f] text-indigo-100' : 'bg-[#0f172a] text-white'}`}>
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
      
      {/* Title */}
      <div className="text-center pt-8 relative z-10">
          <h1 className={`font-press-start text-[4vmin] drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] ${isDarkMode ? 'text-pink-500' : 'text-yellow-400'}`}>
              HALL OF FAME
          </h1>
          <div className="flex justify-center gap-8 mt-6">
              {HOBBY_PORTALS.map(portal => (
                  <div key={portal.id} className="flex flex-col items-center group cursor-pointer">
                      <div className={`w-16 h-16 flex items-center justify-center text-3xl border-4 transition-all group-hover:scale-110 ${isDarkMode ? 'bg-indigo-900 border-indigo-700' : 'bg-sky-800 border-sky-600'}`}>
                          {portal.icon}
                      </div>
                      <span className={`font-press-start text-[1vmin] mt-2 ${portal.color}`}>{portal.name}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden px-[4vmin] py-[4vmin] flex flex-col max-w-[1000px] mx-auto w-full z-10">
          <div className={`border-8 flex-1 flex flex-col transition-colors duration-500 ${isDarkMode ? 'border-indigo-900 bg-black/80 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'border-sky-800 bg-sky-950/90'}`}>
              
              <div className="flex p-4 font-press-start text-[1.5vmin] border-b-8 border-current bg-white/5">
                  <div className="w-[15%] text-center">RANK</div>
                  <div className="w-[40%]">PLAYER</div>
                  <div className="w-[20%] text-center">CLASS</div>
                  <div className="w-[25%] text-right">TOTAL XP</div>
              </div>

              <div className="flex-1 overflow-y-auto font-vt323 text-[3vmin] divide-y-4 divide-white/5">
                  {LEADERBOARD_DATA.map((player) => (
                      <div key={player.rank} className="flex items-center p-4 hover:bg-white/10 transition-colors group">
                          <div className={`w-[15%] text-center font-press-start text-[2vmin]`}>
                              {player.emblem}
                          </div>
                          <div className="w-[40%] flex items-center gap-4">
                              <span className="opacity-40">[{player.country}]</span>
                              <span className="group-hover:text-pink-400 transition-colors uppercase tracking-wider">{player.name}</span>
                          </div>
                          <div className={`w-[20%] text-center font-press-start text-[1vmin] opacity-70`}>
                              {player.type}
                          </div>
                          <div className="w-[25%] text-right font-press-start text-[1.5vmin] text-cyan-400">
                              {player.score.toLocaleString()}
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
                          {(totalScore * 100).toLocaleString()}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className={`py-6 flex justify-center border-t-8 transition-colors duration-500 ${isDarkMode ? 'bg-black/80 border-indigo-950' : 'bg-black/60 border-sky-900'}`}>
          <button
              onClick={() => window.location.reload()}
              className={`font-press-start text-[2vmin] px-12 py-4 border-b-8 border-r-8 active:border-0 active:translate-y-2 transition-all ${isDarkMode ? 'bg-pink-600 border-pink-900' : 'bg-yellow-400 border-yellow-700 text-sky-950'}`}
          >
              PLAY AGAIN
          </button>
      </div>
    </div>
  );
};

export default CommunityScreen;
