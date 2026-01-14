
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

      <div className="flex-1 overflow-y-auto p-[4vmin] relative z-10 flex flex-col items-center">
        
        {/* Profile Card */}
        <div className={`w-full max-w-[800px] border-4 shadow-[10px_10px_0px] p-[4vmin] flex flex-col md:flex-row gap-[4vmin] relative transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-pink-600 shadow-indigo-950' : 'bg-white border-sky-800 shadow-sky-400'}`}>
            
            {/* Header Banner */}
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 font-press-start text-[1.5vmin] px-6 py-2 border-4 shadow-md transition-colors duration-500 ${isDarkMode ? 'bg-pink-600 text-white border-indigo-900' : 'bg-yellow-400 text-slate-900 border-slate-900'}`}>
                PLAYER IDENTIFICATION
            </div>

            {/* Left: Avatar & XP */}
            <div className="flex flex-col items-center gap-[2vmin]">
                <div className={`w-[20vmin] h-[20vmin] border-4 flex items-center justify-center text-[10vmin] relative overflow-hidden group transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-pink-500' : 'bg-sky-100 border-sky-800'}`}>
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'bg-pink-500/20 opacity-50' : 'bg-sky-500/10 opacity-100'}`}></div>
                    <span className="relative z-10 animate-sway">{selectedAvatar}</span>
                </div>
                
                <div className={`w-full border-2 h-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 border-indigo-900' : 'bg-sky-200 border-sky-300'}`}>
                    <div 
                        className={`h-full transition-all duration-500 ${isDarkMode ? 'bg-pink-400 shadow-[0_0_10px_#ec4899]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`} 
                        style={{ width: `${Math.min((totalPoints / 20) * 100, 100)}%` }}
                    ></div>
                    <span className={`absolute inset-0 flex items-center justify-center font-press-start text-[0.8vmin] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>
                        XP: {totalPoints}/20
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                    {AVATARS.map(icon => (
                        <button 
                            key={icon}
                            onClick={() => setSelectedAvatar(icon)}
                            className={`p-1 border-2 transition-all ${isDarkMode ? (selectedAvatar === icon ? 'border-pink-500 bg-pink-500/20' : 'border-indigo-900 hover:border-pink-800') : (selectedAvatar === icon ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300')}`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Stats & Info */}
            <div className="flex-1 flex flex-col gap-[2vmin]">
                <div className={`border-b-4 pb-2 transition-colors duration-500 ${isDarkMode ? 'border-indigo-900' : 'border-sky-100'}`}>
                    <h2 className={`font-press-start text-[3vmin] uppercase tracking-tighter transition-colors duration-500 ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>GUEST_PLAYER_001</h2>
                    <p className={`font-vt323 text-[2.5vmin] transition-colors duration-500 ${isDarkMode ? 'text-cyan-400' : 'text-orange-600'}`}>RANK: SILVER NOVICE</p>
                </div>

                <div className="grid grid-cols-1 gap-[1.5vmin]">
                    <div className={`flex justify-between items-center p-2 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-indigo-900' : 'bg-sky-100/50 border-sky-200'}`}>
                        <span className={`font-press-start text-[1.2vmin] uppercase transition-colors duration-500 ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>CURRENT CLASS</span>
                        <span className={`font-press-start text-[1.5vmin] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-sky-800'}`}>{CLASS_MAP[topTrait]}</span>
                    </div>
                    <div className={`flex justify-between items-center p-2 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-indigo-900' : 'bg-sky-100/50 border-sky-200'}`}>
                        <span className={`font-press-start text-[1.2vmin] uppercase transition-colors duration-500 ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>TOTAL SCORE</span>
                        <span className={`font-press-start text-[1.5vmin] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-sky-800'}`}>{(totalPoints * 100).toLocaleString()}</span>
                    </div>
                </div>

                <div className={`mt-4 p-3 border rounded-sm transition-colors duration-500 ${isDarkMode ? 'bg-indigo-950/30 border-indigo-800' : 'bg-sky-100 border-sky-200'}`}>
                    <h3 className={`font-press-start text-[1vmin] mb-2 transition-colors duration-500 ${isDarkMode ? 'text-pink-400' : 'text-sky-600'}`}>RECENT ACHIEVEMENTS</h3>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center text-xs" title="First Game">🥇</div>
                        <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center text-xs" title="Hobby Scout">🔍</div>
                        <div className="w-8 h-8 bg-purple-500 rounded-sm flex items-center justify-center text-xs opacity-30">🔒</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-[6vmin] flex gap-[3vmin]">
            <button 
                onClick={onBack}
                className={`font-press-start text-[2vmin] px-8 py-4 border-b-8 border-r-8 active:border-0 active:translate-y-2 active:translate-x-2 transition-all ${isDarkMode ? 'bg-pink-700 border-indigo-950 hover:bg-pink-600' : 'bg-red-600 border-red-800 text-white'}`}
            >
                EXIT TERMINAL
            </button>
            <button 
                className={`font-press-start text-[2vmin] px-8 py-4 border-b-8 border-r-8 opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-slate-700 border-slate-900' : 'bg-sky-600 border-sky-800 text-white'}`}
            >
                SAVE DATA [PRO]
            </button>
        </div>

      </div>

      {/* Retro HUD Footer */}
      <div className={`p-4 border-t-4 font-press-start text-[1vmin] flex justify-between uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'bg-black/40 border-slate-800 text-slate-500' : 'bg-sky-200 border-sky-300 text-sky-600'}`}>
          <span>SECURE PROTOCOL v4.2.1</span>
          <span className="animate-blink">SYSTEM ONLINE</span>
          <span>BUFFERED_SESSION_8812</span>
      </div>
    </div>
  );
};

export default ProfileScreen;
