import React, { useState, useEffect, useMemo } from 'react';
import { Scores, Hobby, Trait, Personalities } from '../types';
import { getHobbySuggestions, getPersonalityDescription } from '../services/geminiService';

interface ResultsScreenProps {
  scores: Scores;
  onNext?: () => void;
  onSelectHobby: (hobby: Hobby) => void;
  isDarkMode?: boolean;
}

const ARCHETYPES: Record<string, { title: string; desc: string; icon: string; stat: string }> = {
  CREATIVE: { title: "THE MAKER", desc: "Builds worlds from dreams.", icon: "🎨", stat: "IMAGINATION" },
  ACTIVE: { title: "THE DYNAMO", desc: "Always in motion.", icon: "⚡", stat: "SPEED" },
  STRATEGIC: { title: "THE BRAIN", desc: "Master of plans.", icon: "♟️", stat: "IQ" },
  CALM: { title: "THE MONK", desc: "Unshakeable peace.", icon: "🧘", stat: "ZEN" },
  SOCIAL: { title: "THE BARD", desc: "Friend to all.", icon: "🤝", stat: "CHARISMA" },
  EXPLORER: { title: "THE SCOUT", desc: "Seeks the unknown.", icon: "🧭", stat: "RANGE" }
};

const TraitBar: React.FC<{ trait: string; score: number; max: number; color: string; isDarkMode: boolean }> = ({ trait, score, max, color, isDarkMode }) => {
    const segments = 10;
    const filledSegments = Math.ceil((score / Math.max(max, 1)) * segments);

    return (
        <div className="flex flex-col mb-2">
            <div className="flex justify-between items-end mb-1">
                 <span className={`font-press-start text-[1.2vmin] uppercase tracking-widest ${isDarkMode ? 'text-indigo-300' : 'text-sky-800'}`}>{trait}</span>
                 <span className={`font-vt323 text-[2vmin] ${isDarkMode ? 'text-indigo-400' : 'text-sky-600'}`}>{score.toFixed(1)} PTS</span>
            </div>
            <div className={`flex gap-[2px] h-[1.5vmin] ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
                {Array.from({ length: segments }).map((_, i) => (
                    <div 
                        key={i}
                        className={`flex-1 transform skew-x-[-10deg] border-r ${isDarkMode ? 'border-slate-900' : 'border-white/50'} ${i < filledSegments ? color : isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ scores, onNext, onSelectHobby, isDarkMode = false }) => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const[personality, setPersonality]= useState<Personalities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        setLoading(true);
        setError(null);
        const suggestions = await getHobbySuggestions(scores);
        setHobbies(suggestions);
      } catch (err) {
        setError('Failed to fetch hobby suggestions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPersonalities = async () => {
      try {
        setLoading(true);
        setError(null);
        const personalities = await getPersonalityDescription(scores);
        setPersonality(personalities);
      } catch (err) {
        setError('Failed to fetch personality description.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
    fetchPersonalities();
  }, [scores]);

  const topTrait = useMemo(() => {
      const traits = Object.keys(scores) as Trait[];
      if (traits.length === 0) return 'EXPLORER';
      return traits.reduce((a, b) => scores[a] > scores[b] ? a : b);
  }, [scores]);

  const bestMatchHobby = useMemo(() => {
      if (hobbies.length > 0) {
        const randomIndex = Math.floor(Math.random() * hobbies.length);
        return hobbies[randomIndex];
      }
      return null;
  }, [hobbies]);

  const bestMatchPersonality = useMemo(() => {
      if (personality.length > 0) {
        const randomIndex = Math.floor(Math.random() * personality.length);
        return personality[randomIndex];
      }
      return null;
  }, [personality]);
 console.log("Best Match Personality:", bestMatchPersonality);
  const archetype = ARCHETYPES[topTrait] || ARCHETYPES.EXPLORER;
  const maxScore = Math.max(...(Object.values(scores) as number[]), 1);

  const TRAIT_COLORS: Record<string, string> = {
      CREATIVE: 'bg-pink-500 shadow-[0_0_10px_#ec4899]',
      ACTIVE: 'bg-green-500 shadow-[0_0_10px_#22c55e]',
      STRATEGIC: 'bg-blue-500 shadow-[0_0_10px_#3b82f6]',
      CALM: 'bg-teal-400 shadow-[0_0_10px_#2dd4bf]',
      SOCIAL: 'bg-yellow-400 shadow-[0_0_10px_#facc15]',
      EXPLORER: 'bg-orange-500 shadow-[0_0_10px_#f97316]'
  };

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-sky-100'} relative overflow-hidden`}>
      <div className={`absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-500`} 
           style={{ 
             backgroundImage: `linear-gradient(45deg, ${isDarkMode ? '#6366f1' : '#0ea5e9'} 25%, transparent 25%, transparent 75%, ${isDarkMode ? '#6366f1' : '#0ea5e9'} 75%, ${isDarkMode ? '#6366f1' : '#0ea5e9'}), linear-gradient(45deg, ${isDarkMode ? '#6366f1' : '#0ea5e9'} 25%, transparent 25%, transparent 75%, ${isDarkMode ? '#6366f1' : '#0ea5e9'} 75%, ${isDarkMode ? '#6366f1' : '#0ea5e9'})`, 
             backgroundSize: '40px 40px', 
             backgroundPosition: '0 0, 20px 20px' 
           }}>
      </div>

      <div className="flex-1 overflow-y-auto p-[3vmin] w-full max-w-[1400px] mx-auto flex flex-col gap-[4vmin] relative z-10">
        
        <div className={`p-[2vmin] border-4 shadow-lg text-center shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-indigo-950 border-indigo-500 text-indigo-100' : 'bg-sky-900 border-sky-600 text-white'}`}>
            <h1 className={`font-press-start text-[3vmin] drop-shadow-[4px_4px_0px_#000] animate-blink ${isDarkMode ? 'text-pink-400' : 'text-yellow-300'}`}>
                REVEALING YOUR DESTINY...
            </h1>
        </div>
 {!loading && bestMatchPersonality && (
           <div className={`p-[4vmin] border-8 shadow-[15px_15px_0px_rgba(0,0,0,0.2)] flex flex-col items-center text-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-indigo-950/30 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-cyan-50 border-cyan-400 shadow-[15px_15px_0px_rgba(0,0,0,0.1)]'}`}>
              <div className="font-press-start text-[1.5vmin] text-red-500 animate-pulse">★★★ PERSONALITY REVEAL ★★★</div>
              <h2 className={`font-press-start text-[5vmin] leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>{bestMatchPersonality.name}</h2>
              <p className={`font-vt323 text-[3.5vmin] max-w-[80%] ${isDarkMode ? 'text-pink-100' : 'text-gray-800'}`}>{bestMatchPersonality.description}</p>
             
           </div>
        )}


        {!loading && bestMatchHobby && (
           <div className={`p-[4vmin] border-8 shadow-[15px_15px_0px_rgba(0,0,0,0.2)] flex flex-col items-center text-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-pink-900/40 border-pink-600' : 'bg-yellow-100 border-yellow-500'}`}>
              <div className="font-press-start text-[1.5vmin] text-red-500 animate-pulse">★★★ ABSOLUTE BEST MATCH ★★★</div>
              <h2 className={`font-press-start text-[5vmin] leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>{bestMatchHobby.name}</h2>
              <p className={`font-vt323 text-[3.5vmin] max-w-[80%] ${isDarkMode ? 'text-pink-100' : 'text-gray-800'}`}>{bestMatchHobby.description}</p>
              <button 
                onClick={() => onSelectHobby(bestMatchHobby)}
                className={`mt-4 px-8 py-4 font-press-start text-[2vmin] border-b-4 border-r-4 active:border-0 active:translate-y-1 transition-all ${isDarkMode ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-sky-600 text-white border-sky-900'}`}
              >
                JOIN THE COMMUNITY
              </button>
           </div>
        )}

        <div className="flex flex-col md:flex-row gap-[3vmin] shrink-0">
            <div className="w-full md:w-1/2 flex flex-col gap-[2vmin]">
                <div className={`border-4 p-[2vmin] shadow-[8px_8px_0px_rgba(0,0,0,0.2)] flex-1 flex flex-row items-center gap-4 relative transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-700' : 'bg-white border-sky-800'}`}>
                    <div className={`border-4 w-[20vmin] h-[20vmin] flex-shrink-0 flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-indigo-900' : 'bg-sky-200 border-sky-900'}`}>
                         <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle,#4338ca_10%,#1e1b4b_90%)]' : 'bg-[radial-gradient(circle,#bae6fd_10%,#0284c7_90%)]'}`}></div>
                         <div className="text-[10vmin] relative z-10 animate-sway filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
                             {archetype.icon}
                         </div>
                    </div>
                    <div className="flex-1">
                        <h2 className={`font-press-start text-[2vmin] mb-1 uppercase tracking-wide transition-colors duration-500 ${isDarkMode ? 'text-indigo-300' : 'text-sky-900'}`}>
                            ARCHETYPE: {archetype.title}
                        </h2>
                        <div className={`h-1 w-full mb-2 ${isDarkMode ? 'bg-indigo-950' : 'bg-sky-200'}`}></div>
                        <p className={`font-vt323 text-[2.5vmin] leading-tight transition-colors duration-500 ${isDarkMode ? 'text-indigo-100' : 'text-sky-800'}`}>
                           "{archetype.desc}"
                        </p>
                    </div>
                </div>
            </div>

            <div className={`p-[2vmin] border-4 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] text-white flex-1 flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-700' : 'bg-sky-950 border-sky-600'}`}>
                <h3 className={`font-press-start text-[1.5vmin] mb-[1vmin] text-center border-b-2 pb-1 transition-colors duration-500 ${isDarkMode ? 'text-pink-400 border-indigo-800' : 'text-cyan-300 border-sky-800'}`}>
                    TRAIT SPECTRUM
                </h3>
                <div className="grid grid-cols-2 gap-x-[2vmin] gap-y-[0.5vmin]">
                    {Object.entries(scores).map(([trait, score]) => (
                        <div key={trait} className={`p-1 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 border-indigo-900' : 'bg-sky-900/50 border-sky-700'}`}>
                             <TraitBar trait={trait} score={score} max={maxScore} color={TRAIT_COLORS[trait]} isDarkMode={isDarkMode} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {!loading && bestMatchPersonality && (
          <div className={`p-[4vmin] border-8 shadow-[15px_15px_0px_rgba(0,0,0,0.2)] flex flex-col items-center text-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-purple-900/40 border-purple-600' : 'bg-pink-100 border-pink-500'}`}>
            <div className="font-press-start text-[1.5vmin] text-purple-500 animate-pulse">★★★ YOUR PERSONALITY TYPE ★★★</div>
            <h2 className={`font-press-start text-[4vmin] leading-tight ${isDarkMode ? 'text-white' : 'text-sky-900'}`}>{bestMatchPersonality.name}</h2>
            <p className={`font-vt323 text-[3vmin] max-w-[80%] ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}`}>{bestMatchPersonality.description}</p>
          </div>
        )}

        <div className="w-full flex flex-col gap-[2vmin] shrink-0 mt-[2vmin] pb-[4vmin]">
             <div className={`border-4 p-[3vmin] shadow-[8px_8px_0px_rgba(0,0,0,0.2)] relative transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-700' : 'bg-sky-100 border-sky-500'}`}>
                  <div className={`absolute -top-7 left-1/2 -translate-x-1/2 border-4 px-6 py-2 z-10 shadow-md transition-colors duration-500 ${isDarkMode ? 'bg-pink-600 border-indigo-900 text-indigo-100' : 'bg-yellow-400 border-sky-900 text-sky-900'}`}>
                      <h3 className="font-press-start text-[1.8vmin] whitespace-nowrap">OTHER TOP RECOMMENDATIONS</h3>
                  </div>

                  <div className="mt-[4vmin] w-full">
                       {loading && (
                           <div className={`h-[20vmin] flex items-center justify-center flex-col animate-pulse ${isDarkMode ? 'text-indigo-400' : 'text-sky-600'}`}>
                               <div className={`w-[6vmin] h-[6vmin] border-4 border-t-transparent rounded-full animate-spin mb-2 ${isDarkMode ? 'border-indigo-500 border-t-pink-500' : 'border-sky-200 border-t-sky-500'}`}></div>
                               <span className="font-press-start text-[1.5vmin]">DEEP SCANNING PERSONALITY PROFILE...</span>
                           </div>
                       )}
                       {error && <div className="text-red-500 font-press-start text-[1.5vmin] text-center mt-10">{error}</div>}
                       {!loading && !error && (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3vmin]">
                               {hobbies.slice(1).map((hobby, index) => (
                                   <button 
                                      key={index} 
                                      onClick={() => onSelectHobby(hobby)}
                                      className={`group relative border-4 p-4 text-left transition-all duration-300 shadow-sm flex flex-col min-h-[160px] ${isDarkMode ? 'bg-slate-950 border-indigo-900 hover:bg-slate-800 hover:border-pink-600' : 'bg-white border-sky-800 hover:bg-sky-50 hover:border-sky-400'} hover:-translate-y-1`}
                                   >
                                       <div className={`flex justify-between items-start mb-2 border-b-2 pb-1 transition-colors duration-300 ${isDarkMode ? 'border-indigo-900' : 'border-sky-100'}`}>
                                           <h4 className={`font-press-start text-[1.5vmin] leading-snug transition-colors duration-300 ${isDarkMode ? 'text-indigo-300 group-hover:text-pink-400' : 'text-sky-700'}`}>{hobby.name}</h4>
                                           <div className={`font-press-start text-[0.8vmin] px-2 py-1 bg-sky-800 text-white`}>ENTER</div>
                                       </div>
                                       <p className={`font-vt323 text-[2.2vmin] leading-tight flex-1 transition-colors duration-300 ${isDarkMode ? 'text-indigo-100/80' : 'text-gray-700'}`}>
                                           {hobby.description}
                                       </p>
                                   </button>
                               ))}
                           </div>
                       )}
                  </div>
             </div>
        </div>
      </div>
      
      <div className={`py-[3vmin] flex justify-center border-t-8 shrink-0 gap-[3vmin] z-20 relative shadow-[0_-10px_20px_rgba(0,0,0,0.2)] transition-colors duration-500 ${isDarkMode ? 'bg-indigo-950 border-indigo-900' : 'bg-sky-950 border-sky-800'}`}>
           <button
              onClick={onNext}
              className={`font-press-start text-[1.8vmin] text-white px-[5vmin] py-[2vmin] border-b-8 border-r-8 active:border-b-0 active:border-r-0 active:translate-y-2 transition-all uppercase ${isDarkMode ? 'bg-pink-600 border-pink-800' : 'bg-green-500 border-green-700'}`}
          >
              GLOBAL LEADERBOARD
          </button>
          <button
              onClick={() => window.location.reload()}
              className={`font-press-start text-[1.5vmin] px-[4vmin] py-[2vmin] border-b-8 border-r-8 active:border-b-0 active:border-r-0 active:translate-y-2 transition-all uppercase ${isDarkMode ? 'bg-indigo-900 border-indigo-950 text-indigo-200' : 'bg-sky-900 border-sky-950 text-sky-200'}`}
          >
              REPLAY ALL
          </button>
      </div>
    </div>
  );
};

export default ResultsScreen;