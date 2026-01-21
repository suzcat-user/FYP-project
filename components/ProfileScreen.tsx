
import React, { useState } from 'react';
import { Scores, Trait } from '../types';

interface ProfileScreenProps {
  scores: Scores;
  onBack: () => void;
  isDarkMode?: boolean;
}

const AVATARS = ["🕹️", "👾", "🤖", "🚀", "🐱", "🐲", "💎", "🛹"];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ scores, onBack, isDarkMode = false }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  
  const traits = Object.keys(scores) as Trait[];
  const topTrait = traits.reduce((a, b) => scores[a] > scores[b] ? a : b);
  const totalPoints = (Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0);

  const CLASS_MAP: Record<Trait, string> = {
    CREATIVE: "MASTER ARTISAN",
    ACTIVE: "KINETIC HERO",
    STRATEGIC: "GRAND TACTICIAN",
    CALM: "ZEN VOYAGER",
    SOCIAL: "ELITE BARD",
    EXPLORER: "LIMITLESS SCOUT",
  };

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-sky-50 text-sky-950'}`}>
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-500 ${isDarkMode ? 'bg-purple-500' : 'bg-sky-400'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-500 ${isDarkMode ? 'bg-cyan-500' : 'bg-blue-300'}`}></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 flex flex-col items-center">
        
        {/* Profile Card */}
        <div className={`w-full max-w-[800px] border-4 shadow-[10px_10px_0px] p-6 md:p-8 flex flex-col md:flex-row gap-6 relative mt-8 transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-pink-600 shadow-indigo-950' : 'bg-white border-sky-800 shadow-sky-400'}`}>
            
            {/* Header Banner */}
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 font-press-start text-xs md:text-sm px-4 py-2 border-4 shadow-md whitespace-nowrap transition-colors duration-500 ${isDarkMode ? 'bg-pink-600 text-white border-indigo-900' : 'bg-yellow-400 text-slate-900 border-slate-900'}`}>
                PLAYER IDENTIFICATION
            </div>

            {/* Left: Avatar & XP */}
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                <div className={`w-32 h-32 border-4 flex items-center justify-center text-7xl relative overflow-hidden group transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-pink-500' : 'bg-sky-100 border-sky-800'}`}>
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'bg-pink-500/20 opacity-50' : 'bg-sky-500/10 opacity-100'}`}></div>
                    <span className="relative z-10 animate-sway">{selectedAvatar}</span>
                </div>
                
                <div className={`w-full border-2 h-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 border-indigo-900' : 'bg-sky-200 border-sky-300'}`}>
                    <div 
                        className={`h-full transition-all duration-500 ${isDarkMode ? 'bg-pink-400 shadow-[0_0_10px_#ec4899]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`} 
                        style={{ width: `${Math.min((totalPoints / 20) * 100, 100)}%` }}
                    ></div>
                    <span className={`absolute inset-0 flex items-center justify-center font-press-start text-[8px] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                        XP: {totalPoints}/20
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 w-full">
                    {AVATARS.map(icon => (
                        <button 
                            key={icon}
                            onClick={() => setSelectedAvatar(icon)}
                            className={`p-1.5 text-xl border-2 transition-all ${isDarkMode ? (selectedAvatar === icon ? 'border-pink-500 bg-pink-500/20' : 'border-indigo-900 hover:border-pink-800') : (selectedAvatar === icon ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300')}`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Stats & Info */}
            <div className="flex-1 flex flex-col gap-4">
                <div className={`border-b-4 pb-3 transition-colors duration-500 ${isDarkMode ? 'border-indigo-900' : 'border-sky-100'}`}>
                    <h2 className={`font-press-start text-sm md:text-lg uppercase tracking-tighter transition-colors duration-500 ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>GUEST_PLAYER_001</h2>
                    <p className={`font-vt323 text-lg md:text-xl mt-1 transition-colors duration-500 ${isDarkMode ? 'text-cyan-400' : 'text-orange-600'}`}>RANK: SILVER NOVICE</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div className={`flex justify-between items-center p-3 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-indigo-900' : 'bg-sky-100/50 border-sky-200'}`}>
                        <span className={`font-press-start text-[9px] md:text-xs uppercase transition-colors duration-500 ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>CURRENT CLASS</span>
                        <span className={`font-press-start text-[10px] md:text-sm transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-sky-800'}`}>{CLASS_MAP[topTrait]}</span>
                    </div>
                    <div className={`flex justify-between items-center p-3 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-indigo-900' : 'bg-sky-100/50 border-sky-200'}`}>
                        <span className={`font-press-start text-[9px] md:text-xs uppercase transition-colors duration-500 ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>TOTAL SCORE</span>
                        <span className={`font-press-start text-[10px] md:text-sm transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-sky-800'}`}>{(totalPoints * 100).toLocaleString()}</span>
                    </div>
                </div>

                <div className={`mt-2 p-3 border rounded-sm transition-colors duration-500 ${isDarkMode ? 'bg-indigo-950/30 border-indigo-800' : 'bg-sky-100 border-sky-200'}`}>
                    <h3 className={`font-press-start text-[9px] md:text-xs mb-2 transition-colors duration-500 ${isDarkMode ? 'text-pink-400' : 'text-sky-600'}`}>RECENT ACHIEVEMENTS</h3>
                    <div className="flex gap-2">
                        <div className="w-10 h-10 bg-yellow-500 rounded-sm flex items-center justify-center text-lg" title="First Game">🥇</div>
                        <div className="w-10 h-10 bg-blue-500 rounded-sm flex items-center justify-center text-lg" title="Hobby Scout">🔍</div>
                        <div className="w-10 h-10 bg-purple-500 rounded-sm flex items-center justify-center text-lg opacity-30">🔒</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-[800px] px-4">
            <button 
                onClick={onBack}
                className={`font-press-start text-xs md:text-sm px-6 py-3 border-b-8 border-r-8 active:border-0 active:translate-y-2 active:translate-x-2 transition-all ${isDarkMode ? 'bg-pink-700 border-indigo-950 hover:bg-pink-600' : 'bg-red-600 border-red-800 text-white'}`}
            >
                EXIT TERMINAL
            </button>
            <button 
                className={`font-press-start text-xs md:text-sm px-6 py-3 border-b-8 border-r-8 opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-slate-700 border-slate-900' : 'bg-sky-600 border-sky-800 text-white'}`}
            >
                SAVE DATA [PRO]
            </button>
        </div>

      </div>

      {/* Retro HUD Footer */}
      <div className={`p-3 md:p-4 border-t-4 font-press-start text-[8px] md:text-xs flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'bg-black/40 border-slate-800 text-slate-500' : 'bg-sky-200 border-sky-300 text-sky-600'}`}>
          <span className="hidden sm:inline">SECURE PROTOCOL v4.2.1</span>
          <span className="animate-blink">SYSTEM ONLINE</span>
          <span className="hidden sm:inline">BUFFERED_SESSION_8812</span>
      </div>
    </div>
  );
};

export default ProfileScreen;
