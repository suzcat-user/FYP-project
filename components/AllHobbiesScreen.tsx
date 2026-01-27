import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hobby, PersonalityCode } from '../types';
import { useHobbies } from '../services/useHobbies';
import GameContainer from './ui/GameContainer';

interface AllHobbiesScreenProps {
  onSelectHobby: (hobby: Hobby) => void;
  isDarkMode?: boolean;
}

const PERSONALITY_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  'F': { bg: 'bg-green-500', border: 'border-green-700', text: 'text-green-100', accent: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
  'C': { bg: 'bg-pink-500', border: 'border-pink-700', text: 'text-pink-100', accent: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]' },
  'N': { bg: 'bg-teal-500', border: 'border-teal-700', text: 'text-teal-100', accent: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]' },
  'S': { bg: 'bg-yellow-500', border: 'border-yellow-700', text: 'text-yellow-100', accent: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]' },
  'L': { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-purple-100', accent: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]' }
};

const AllHobbiesScreen: React.FC<AllHobbiesScreenProps> = ({ onSelectHobby, isDarkMode = false }) => {
  const navigate = useNavigate();
  const { hobbies: personalityData, loading, error } = useHobbies();

  if (loading) {
    return (
      <GameContainer title="ALL HOBBIES" instruction="LOADING..." isDarkMode={isDarkMode}>
        <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-sky-100'}`}>
          <div className={`font-press-start text-[2vmin] ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>
            Loading hobbies from database...
          </div>
        </div>
      </GameContainer>
    );
  }

  if (error) {
    return (
      <GameContainer title="ALL HOBBIES" instruction="ERROR" isDarkMode={isDarkMode}>
        <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'bg-slate-900' : 'bg-sky-100'}`}>
          <div className={`font-press-start text-[2vmin] ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            Failed to load hobbies
          </div>
          <button
            onClick={() => navigate('/results')}
            className={`font-press-start text-[1.5vmin] px-[3vmin] py-[1.5vmin] border-4 ${isDarkMode ? 'bg-indigo-700 border-indigo-900 text-indigo-100' : 'bg-sky-500 border-sky-700 text-white'}`}
          >
            ← BACK TO RESULTS
          </button>
        </div>
      </GameContainer>
    );
  }

  const totalHobbies = personalityData.reduce((sum, p) => sum + p.hobbies.length, 0);

  return (
    <GameContainer title="ALL HOBBIES" instruction="EXPLORE EVERY HOBBY" isDarkMode={isDarkMode}>
      <div className={`w-full h-full overflow-y-auto p-[3vmin] transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-sky-100'}`}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/results')}
          className={`mb-[3vmin] font-press-start text-[1.5vmin] px-[3vmin] py-[1.5vmin] border-4 border-b-8 active:border-b-4 active:translate-y-1 transition-all ${isDarkMode ? 'bg-indigo-700 border-indigo-900 text-indigo-100 hover:bg-indigo-600' : 'bg-sky-500 border-sky-700 text-white hover:bg-sky-400'}`}
        >
          ← BACK TO RESULTS
        </button>

        {/* Header */}
        <div className={`text-center mb-[4vmin] p-[3vmin] border-4 ${isDarkMode ? 'bg-slate-900 border-indigo-700' : 'bg-white border-sky-500'}`}>
          <h1 className={`font-press-start text-[2.5vmin] mb-[2vmin] ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>
            🎮 COMPLETE HOBBY CATALOG
          </h1>
          <p className={`font-vt323 text-[2vmin] ${isDarkMode ? 'text-indigo-300' : 'text-sky-600'}`}>
            Browse all hobbies across every personality type. Click any hobby to join its community!
          </p>
        </div>

        {/* Personality Sections */}
        {personalityData.map((personality) => {
          const colors = PERSONALITY_COLORS[personality.code] || PERSONALITY_COLORS['F'];
          
          return (
            <div key={personality.code} className="mb-[5vmin]">
              {/* Personality Header */}
              <div className={`flex items-center gap-[2vmin] mb-[2vmin] p-[2vmin] border-4 ${colors.bg} ${colors.border}`}>
                <span className="text-[4vmin]">{personality.emoji}</span>
                <div>
                  <h2 className={`font-press-start text-[2vmin] ${colors.text}`}>
                    {personality.name.toUpperCase()}
                  </h2>
                  <p className={`font-vt323 text-[1.8vmin] ${colors.text} opacity-80`}>
                    {personality.hobbies.length} hobbies available
                  </p>
                </div>
              </div>

              {/* Hobbies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2vmin]">
                {personality.hobbies.map((hobby, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectHobby(hobby)}
                    className={`group relative border-4 p-[2vmin] text-left transition-all duration-300 shadow-sm flex flex-col min-h-[120px] cursor-pointer active:translate-y-1 hover:-translate-y-1 ${isDarkMode ? `bg-slate-900 border-indigo-800 hover:bg-slate-800 hover:border-pink-500 ${colors.accent}` : `bg-white border-sky-300 hover:bg-sky-50 hover:border-sky-500 ${colors.accent}`}`}
                  >
                    <div className={`flex justify-between items-start mb-[1vmin] border-b-2 pb-[0.5vmin] ${isDarkMode ? 'border-indigo-800' : 'border-sky-100'}`}>
                      <h4 className={`font-press-start text-[1.6vmin] leading-snug transition-colors duration-300 ${isDarkMode ? 'text-indigo-300 group-hover:text-pink-400' : 'text-sky-700 group-hover:text-sky-500'}`}>
                        {hobby.name}
                      </h4>
                      <span className="text-[2.2vmin] opacity-0 group-hover:opacity-100 transition-opacity">
                        {personality.emoji}
                      </span>
                    </div>
                    <p className={`font-vt323 text-[1.9vmin] leading-snug flex-grow ${isDarkMode ? 'text-indigo-200' : 'text-sky-600'}`}>
                      {hobby.description}
                    </p>
                    <div className={`mt-auto pt-[1vmin] opacity-0 group-hover:opacity-100 transition-opacity font-vt323 text-[1.7vmin] ${isDarkMode ? 'text-pink-400' : 'text-sky-600'}`}>
                      → Join Community
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer Stats */}
        <div className={`text-center mt-[4vmin] p-[3vmin] border-4 ${isDarkMode ? 'bg-slate-900 border-indigo-700' : 'bg-white border-sky-500'}`}>
          <p className={`font-vt323 text-[2vmin] ${isDarkMode ? 'text-pink-300' : 'text-sky-700'}`}>
            📊 Total: {totalHobbies} hobbies across {personalityData.length} personality types
          </p>
        </div>
      </div>
    </GameContainer>
  );
};

export default AllHobbiesScreen;
