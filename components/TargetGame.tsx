
import React, { useState, useEffect } from 'react';
import { TRAITS_POOL } from '../constants';
import { Crosshair, Check, ArrowRight } from 'lucide-react';

interface TargetGameProps {
  onComplete: (selectedTraits: string[]) => void;
  initialTraits?: string[];
}

export const TargetGame: React.FC<TargetGameProps> = ({ onComplete, initialTraits = [] }) => {
  const [rows, setRows] = useState<string[][]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [lastShot, setLastShot] = useState<{x: number, y: number} | null>(null);

  const TARGETS_NEEDED = 3;
  
  // Prepare rows of scrolling traits
  useEffect(() => {
    // Filter out already collected traits
    const availableTraits = TRAITS_POOL.filter(t => !initialTraits.includes(t)).sort(() => 0.5 - Math.random());
    
    // We need enough items to scroll smoothly. Let's split into 3 rows.
    // We duplicate the arrays to create the infinite scroll visual effect.
    const chunkSize = Math.ceil(availableTraits.length / 3);
    const row1 = availableTraits.slice(0, chunkSize);
    const row2 = availableTraits.slice(chunkSize, chunkSize * 2);
    const row3 = availableTraits.slice(chunkSize * 2);

    setRows([
        [...row1, ...row1, ...row1], 
        [...row2, ...row2, ...row2],
        [...row3, ...row3, ...row3],
    ]);
  }, [initialTraits]);

  const handleShot = (trait: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Visual bang effect coordinates
    setLastShot({ x: e.clientX, y: e.clientY });
    setTimeout(() => setLastShot(null), 300);

    if (selectedTraits.includes(trait)) {
        // Deselect if clicked again
        setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
        // Select (limit to needed)
        if (selectedTraits.length < TARGETS_NEEDED) {
            setSelectedTraits(prev => [...prev, trait]);
        }
    }
  };

  const handleSubmit = () => {
    if (selectedTraits.length < TARGETS_NEEDED) return;
    onComplete([...initialTraits, ...selectedTraits]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-slide-up overflow-hidden pb-12">
       
       <style>{`
        @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
        }
        @keyframes slideRight {
            0% { transform: translateX(-33.33%); }
            100% { transform: translateX(0); }
        }
        .animate-slide-left {
            animation: slideLeft 20s linear infinite;
        }
        .animate-slide-right {
            animation: slideRight 25s linear infinite;
        }
        .paused {
            animation-play-state: paused;
        }
      `}</style>

      {/* Header Question */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-block bg-fun-blue text-fun-dark font-display text-xl px-4 py-1 rounded-full border-2 border-fun-dark mb-2 rotate-[2deg]">
           LEVEL 2
        </div>
        <h2 className="text-4xl md:text-6xl font-display text-fun-dark mb-4 drop-shadow-sm">
          Hit Your Targets!
        </h2>
        <div className="bg-white border-4 border-fun-dark px-6 py-4 rounded-2xl shadow-hard-sm max-w-2xl mx-auto">
             <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
                 Question: <span className="text-fun-blue underline decoration-wavy decoration-fun-pink">What else makes you special?</span>
             </p>
             <div className="flex items-center justify-center gap-3 mt-4 bg-gray-100 p-2 rounded-xl">
                <span className="text-gray-500 font-medium font-display uppercase tracking-wide">Targets Hit:</span>
                <div className="flex gap-2">
                    {Array.from({length: TARGETS_NEEDED}).map((_, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-fun-dark transition-colors ${i < selectedTraits.length ? 'bg-fun-green' : 'bg-gray-300'}`}></div>
                    ))}
                </div>
             </div>
        </div>
      </div>

      {/* Shooting Gallery Container */}
      <div className="relative bg-fun-dark/5 rounded-[3rem] border-x-4 border-b-4 border-t-0 border-fun-dark/20 p-4 md:p-8 overflow-hidden min-h-[450px] cursor-crosshair">
        
        {/* Decorative top awning */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[repeating-linear-gradient(45deg,#FF70A6,#FF70A6_20px,#FFFDF5_20px,#FFFDF5_40px)] border-b-4 border-fun-dark z-20 shadow-lg rounded-t-[2rem]"></div>

        {/* Moving Target Rows */}
        <div className="flex flex-col justify-center gap-8 md:gap-12 mt-20">
            {rows.map((rowTraits, rowIndex) => (
                <div key={rowIndex} className="relative w-full overflow-visible py-2 group">
                    <div 
                        className={`flex gap-8 w-max ${rowIndex % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'} group-hover:paused`}
                    >
                        {rowTraits.map((trait, i) => {
                            const isSelected = selectedTraits.includes(trait);
                            const isDisabled = !isSelected && selectedTraits.length >= TARGETS_NEEDED;
                            
                            return (
                                <button
                                    key={`${trait}-${i}`}
                                    onClick={(e) => handleShot(trait, e)}
                                    disabled={isDisabled}
                                    className={`
                                        relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center border-8 transition-all duration-100
                                        ${isSelected 
                                            ? 'bg-fun-green border-fun-dark scale-95 shadow-inner' 
                                            : 'bg-white border-fun-orange shadow-hard-sm hover:scale-105 active:scale-95'
                                        }
                                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'}
                                    `}
                                >
                                    {/* Target Rings */}
                                    {!isSelected && (
                                        <>
                                            <div className="absolute inset-2 rounded-full border-4 border-fun-blue/20 pointer-events-none"></div>
                                            <div className="absolute inset-8 rounded-full border-4 border-fun-pink/20 pointer-events-none"></div>
                                            <div className="absolute inset-16 rounded-full border-4 border-fun-yellow/40 pointer-events-none bg-fun-yellow/10"></div>
                                        </>
                                    )}

                                    <span className={`font-display text-2xl md:text-3xl text-center leading-none px-4 select-none ${isSelected ? 'text-fun-dark' : 'text-gray-700'}`}>
                                        {trait}
                                    </span>

                                    {/* Bullet Hole / Checkmark Overlay */}
                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full animate-pop">
                                            <Check size={80} className="text-fun-dark drop-shadow-md" strokeWidth={5} />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
        
        {/* Visual Bang Effect overlay */}
        {lastShot && (
            <div 
                className="fixed w-24 h-24 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 animate-pop"
                style={{ left: lastShot.x, top: lastShot.y }}
            >
                 <div className="absolute inset-0 bg-fun-yellow rounded-full animate-ping opacity-75"></div>
                 <Crosshair className="w-full h-full text-fun-dark animate-spin" />
            </div>
        )}

      </div>

      {/* Footer */}
      <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={selectedTraits.length < TARGETS_NEEDED}
            className={`
              group relative inline-block
              ${selectedTraits.length < TARGETS_NEEDED ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer animate-bounce-slow'}
            `}
          >
            <span className="absolute inset-0 translate-x-2 translate-y-2 bg-fun-dark rounded-2xl transition-transform"></span>
            <span className="relative flex items-center gap-3 px-12 py-6 bg-fun-yellow border-4 border-fun-dark rounded-2xl text-3xl font-display text-fun-dark group-hover:-translate-y-1 transition-transform group-active:translate-y-1">
              NEXT LEVEL
              <ArrowRight size={32} strokeWidth={3} />
            </span>
          </button>
      </div>
    </div>
  );
};
