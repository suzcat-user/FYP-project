
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

// Declare global confetti function from CDN
declare global {
  interface Window {
    confetti: any;
  }
}

interface BingoGridProps {
  tiles: string[];
  onBingo: () => void;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const BingoGrid: React.FC<BingoGridProps> = ({ tiles, onBingo }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
     const freeSpaceIndex = tiles.findIndex(t => t === "Free Space");
     if (freeSpaceIndex !== -1 && !selected.includes(freeSpaceIndex)) {
         setSelected(prev => [...prev, freeSpaceIndex]);
     }
  }, [tiles]);

  const toggleTile = (index: number) => {
    if (hasWon) return; 

    setSelected(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  useEffect(() => {
    if (hasWon) return;
    
    const isWinner = WINNING_COMBINATIONS.some(combo => 
      combo.every(index => selected.includes(index))
    );

    if (isWinner) {
      setHasWon(true);
      onBingo();
      // Fire confetti
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF70A6', '#FFD670', '#70D6FF', '#99F19E']
        });
      }
    }
  }, [selected, hasWon, onBingo]);

  return (
    <div className="relative max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {tiles.map((tile, idx) => {
          const isSelected = selected.includes(idx);
          const isFreeSpace = tile === "Free Space";
          
          return (
            <button
              key={idx}
              onClick={() => toggleTile(idx)}
              className={`
                aspect-square relative flex items-center justify-center p-1 md:p-2 text-center rounded-xl transition-all duration-200 outline-none
                border-2
                ${isSelected 
                  ? 'bg-fun-yellow border-fun-dark shadow-none translate-y-1' 
                  : 'bg-white border-fun-dark shadow-hard-sm hover:-translate-y-1 hover:shadow-hard'
                }
              `}
            >
              <span className={`text-xs md:text-sm leading-tight select-none font-display ${isSelected ? 'text-fun-dark' : 'text-gray-600'}`}>
                {tile}
              </span>
              
              {/* Stamp Effect */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    {isFreeSpace ? (
                        <Star className="text-fun-pink rotate-12 drop-shadow-md" size={48} fill="currentColor" strokeWidth={3} stroke="white" />
                    ) : (
                        <div className="animate-pop transform rotate-[-10deg]">
                          <div className="w-12 h-12 bg-fun-pink/80 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                             <Check size={24} className="text-white" strokeWidth={4} />
                          </div>
                        </div>
                    )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Win Overlay */}
      {hasWon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="animate-bounce-slow transform rotate-[-6deg]">
             <div className="bg-fun-green border-4 border-fun-dark text-fun-dark text-5xl font-display px-8 py-4 rounded-2xl shadow-hard-lg">
               BINGO!
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
import { Check } from 'lucide-react';
