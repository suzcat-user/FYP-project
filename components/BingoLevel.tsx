
import React, { useState, useEffect } from 'react';
import { TRAITS_POOL } from '../constants';
import { Rocket, Check, Star } from 'lucide-react';

interface BingoLevelProps {
  onComplete: (selectedTraits: string[]) => void;
  initialTraits?: string[];
}

export const BingoLevel: React.FC<BingoLevelProps> = ({ onComplete, initialTraits = [] }) => {
  const [gridTraits, setGridTraits] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const NEEDED = 3;

  useEffect(() => {
    // Filter items not used
    const available = TRAITS_POOL.filter(t => !initialTraits.includes(t));
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    // Create a 4x4 grid (16 items) for a nice full card look
    setGridTraits(shuffled.slice(0, 16)); 
  }, [initialTraits]);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
      if (selectedTraits.length < NEEDED) {
        setSelectedTraits(prev => [...prev, trait]);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedTraits.length < NEEDED) return;
    onComplete([...initialTraits, ...selectedTraits]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-slide-up pb-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block bg-fun-green text-fun-dark font-display text-xl px-4 py-1 rounded-full border-2 border-fun-dark mb-2 rotate-[2deg]">
           LEVEL 4
        </div>
        <h2 className="text-4xl md:text-6xl font-display text-fun-dark mb-4 drop-shadow-sm">
          Bingo Blitz!
        </h2>
        <div className="bg-white border-4 border-fun-dark px-6 py-4 rounded-2xl shadow-hard-sm max-w-2xl mx-auto transform -rotate-1">
             <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
                 Question: <span className="text-fun-green underline decoration-wavy decoration-fun-orange">What are your secret powers?</span>
             </p>
             <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-gray-500 font-medium font-display uppercase tracking-wide">Stamps Needed:</span>
                <div className="flex gap-2">
                    {Array.from({length: NEEDED}).map((_, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-fun-dark flex items-center justify-center ${i < selectedTraits.length ? 'bg-fun-purple text-white' : 'bg-gray-200'}`}>
                            {i < selectedTraits.length && <Star size={16} fill="currentColor" />}
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>

      {/* Bingo Card Container */}
      <div className="relative bg-white p-4 md:p-8 rounded-[2rem] border-4 border-fun-dark shadow-hard max-w-3xl mx-auto">
        
        {/* Bingo Header Text (B I N G O style decoration) */}
        <div className="grid grid-cols-4 mb-6 text-center">
            {['B', 'I', 'N', 'G', 'O'].slice(0,4).map((letter, i) => (
                <div key={i} className="font-display text-4xl md:text-5xl text-fun-dark/20">{letter}</div>
            ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {gridTraits.map((trait, idx) => {
                const isSelected = selectedTraits.includes(trait);
                const isDisabled = !isSelected && selectedTraits.length >= NEEDED;
                
                return (
                    <button
                        key={idx}
                        onClick={() => toggleTrait(trait)}
                        disabled={isDisabled}
                        className={`
                            relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-200
                            ${isSelected 
                                ? 'bg-fun-purple/10 border-fun-purple' 
                                : 'bg-white border-gray-300 hover:border-fun-dark hover:bg-gray-50'
                            }
                            ${isDisabled ? 'opacity-50' : 'cursor-pointer active:scale-95'}
                        `}
                    >
                        <span className={`font-display text-sm md:text-lg leading-tight ${isSelected ? 'opacity-50' : 'text-fun-dark'}`}>
                            {trait}
                        </span>

                        {/* Stamp Animation */}
                        {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center animate-pop rotate-[-12deg]">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-fun-purple opacity-80 flex items-center justify-center">
                                    <div className="w-[90%] h-[90%] rounded-full border-2 border-fun-purple border-dashed flex items-center justify-center">
                                        <Check className="text-fun-purple w-10 h-10" strokeWidth={4} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={selectedTraits.length < NEEDED}
            className={`
              group relative inline-block
              ${selectedTraits.length < NEEDED ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer animate-bounce-slow'}
            `}
          >
            <span className="absolute inset-0 translate-x-2 translate-y-2 bg-fun-dark rounded-2xl transition-transform"></span>
            <span className="relative flex items-center gap-3 px-12 py-6 bg-fun-yellow border-4 border-fun-dark rounded-2xl text-3xl font-display text-fun-dark group-hover:-translate-y-1 transition-transform group-active:translate-y-1">
              FINISH!
              <Rocket size={32} fill="currentColor" />
            </span>
          </button>
      </div>

    </div>
  );
};
