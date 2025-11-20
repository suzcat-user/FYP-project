
import React, { useState, useEffect } from 'react';
import { TRAITS_POOL } from '../constants';
import { Check, Shuffle, Rocket } from 'lucide-react';

interface QuizProps {
  onComplete: (selectedTraits: string[]) => void;
  initialTraits?: string[];
}

export const Quiz: React.FC<QuizProps> = ({ onComplete, initialTraits = [] }) => {
  const [gridTraits, setGridTraits] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  
  const TOTAL_NEEDED = 6;
  const NEED_MORE = TOTAL_NEEDED - (initialTraits.length + selectedIndices.length);

  useEffect(() => {
    shuffleGrid();
  }, []);

  const shuffleGrid = () => {
    // Exclude traits already caught in Level 1
    const pool = TRAITS_POOL.filter(t => !initialTraits.includes(t));
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setGridTraits(shuffled.slice(0, 24));
    setSelectedIndices([]);
  };

  const toggleTrait = (index: number) => {
    // Don't allow selecting more if we reached limit
    if (NEED_MORE <= 0 && !selectedIndices.includes(index)) return;

    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSubmit = () => {
    if (NEED_MORE > 0) return;
    const newTraits = selectedIndices.map(idx => gridTraits[idx]);
    onComplete([...initialTraits, ...newTraits]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-slide-up">
      
      <div className="text-center mb-8">
        <div className="inline-block bg-fun-blue text-fun-dark font-display text-xl px-4 py-1 rounded-full border-2 border-fun-dark mb-2 rotate-[2deg]">
           LEVEL 2
        </div>
        <h2 className="text-4xl md:text-6xl font-display text-fun-dark mb-4 drop-shadow-sm">
          Pick {NEED_MORE > 0 ? NEED_MORE : ''} More!
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
            {initialTraits.map((t, i) => (
                <span key={i} className="bg-fun-orange border-2 border-fun-dark text-fun-dark font-bold px-3 py-1 rounded-lg text-sm transform rotate-1">
                    {t}
                </span>
            ))}
            <span className="text-gray-400 font-display text-xl self-center mx-2">+</span>
            {selectedIndices.map((idx) => (
                 <span key={`new-${idx}`} className="bg-fun-yellow border-2 border-fun-dark text-fun-dark font-bold px-3 py-1 rounded-lg text-sm animate-pop">
                    {gridTraits[idx]}
                </span>
            ))}
            {Array.from({length: Math.max(0, NEED_MORE)}).map((_, i) => (
                <span key={`empty-${i}`} className="border-2 border-dashed border-gray-400 bg-white/50 w-20 h-8 rounded-lg"></span>
            ))}
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-4 md:p-8 rounded-[3rem] border-4 border-white shadow-xl">
        
        {/* Grid Area */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 mb-8">
          {gridTraits.map((trait, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const colors = ['bg-fun-blue', 'bg-fun-pink', 'bg-fun-yellow', 'bg-fun-green', 'bg-fun-purple', 'bg-fun-orange'];
            const randomColor = colors[idx % colors.length];

            return (
              <button
                key={idx}
                onClick={() => toggleTrait(idx)}
                className={`
                  relative aspect-[4/3] rounded-2xl p-3 flex items-center justify-center text-center transition-all duration-200 outline-none
                  border-b-8 border-r-4 border-t-2 border-l-2
                  ${isSelected 
                    ? `${randomColor} border-fun-dark translate-y-2 translate-x-1 border-b-2 border-r-2` 
                    : 'bg-white border-gray-300 hover:border-fun-dark hover:-translate-y-1 hover:shadow-lg'
                  }
                  ${!isSelected && NEED_MORE <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className={`font-display text-base md:text-xl leading-tight ${isSelected ? 'text-fun-dark scale-110' : 'text-gray-600'} transition-transform duration-200`}>
                  {trait}
                </span>
                
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-fun-dark text-white rounded-full p-1 animate-pop border-2 border-white">
                    <Check size={16} strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <button 
            onClick={shuffleGrid}
            className="flex items-center gap-2 font-bold text-gray-500 hover:text-fun-blue transition-colors bg-white px-5 py-3 rounded-full border-2 border-gray-200 hover:border-fun-blue border-b-4 active:border-b-2 active:translate-y-0.5"
          >
            <Shuffle size={20} />
            New Cards
          </button>

          <button
            onClick={handleSubmit}
            disabled={NEED_MORE > 0}
            className={`
              group relative inline-block
              ${NEED_MORE > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="absolute inset-0 translate-x-2 translate-y-2 bg-fun-dark rounded-2xl transition-transform"></span>
            <span className="relative flex items-center gap-3 px-8 py-4 bg-fun-yellow border-4 border-fun-dark rounded-2xl text-xl font-display text-fun-dark group-hover:-translate-y-1 transition-transform group-active:translate-y-1">
              FINISH!
              <Rocket size={24} fill="currentColor" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
