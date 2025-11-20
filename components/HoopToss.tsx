
import React, { useState, useEffect } from 'react';
import { TRAITS_POOL } from '../constants';
import { ArrowRight, Circle } from 'lucide-react';

interface HoopTossProps {
  onComplete: (selectedTraits: string[]) => void;
  initialTraits?: string[];
}

export const HoopToss: React.FC<HoopTossProps> = ({ onComplete, initialTraits = [] }) => {
  const [shelfItems, setShelfItems] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const NEEDED = 3;

  useEffect(() => {
    // Filter items not used in previous levels
    const available = TRAITS_POOL.filter(t => !initialTraits.includes(t));
    // Shuffle and pick a subset for the shelves
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    setShelfItems(shuffled.slice(0, 12)); // 12 items for the shelf
  }, [initialTraits]);

  const throwHoop = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      // Remove hoop
      setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
      // Add hoop if space
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
    <div className="w-full max-w-6xl mx-auto animate-slide-up pb-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block bg-fun-pink text-white font-display text-xl px-4 py-1 rounded-full border-2 border-fun-dark mb-2 rotate-[-2deg]">
           LEVEL 3
        </div>
        <h2 className="text-4xl md:text-6xl font-display text-fun-dark mb-4 drop-shadow-sm">
          Ring Toss!
        </h2>
        <div className="bg-white border-4 border-fun-dark px-6 py-4 rounded-2xl shadow-hard-sm max-w-2xl mx-auto transform rotate-1">
             <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
                 Question: <span className="text-fun-pink underline decoration-wavy decoration-fun-blue">What do you like to do?</span>
             </p>
             <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-gray-500 font-medium font-display uppercase tracking-wide">Hoops Landed:</span>
                <div className="flex gap-2">
                    {Array.from({length: NEEDED}).map((_, i) => (
                        <Circle 
                          key={i} 
                          className={`w-8 h-8 transition-all duration-300 ${i < selectedTraits.length ? 'fill-fun-pink text-fun-dark' : 'text-gray-300'}`} 
                          strokeWidth={3} 
                        />
                    ))}
                </div>
             </div>
        </div>
      </div>

      {/* Game Area - Shelves */}
      <div className="relative bg-[#Fdf5e6] border-4 border-fun-dark rounded-[3rem] p-6 md:p-10 shadow-hard overflow-hidden">
        {/* Stripes for carnival feel */}
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,#FF9770,#FF9770_40px,#FFFDF5_40px,#FFFDF5_80px)] pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-y-16 justify-items-center mt-8 mb-4">
          {shelfItems.map((trait, idx) => {
            const isSelected = selectedTraits.includes(trait);
            const isDisabled = !isSelected && selectedTraits.length >= NEEDED;

            // Random bottle colors
            const colors = ['#FF70A6', '#70D6FF', '#FFD670', '#99F19E'];
            const bottleColor = colors[idx % colors.length];

            return (
              <button
                key={idx}
                onClick={() => throwHoop(trait)}
                disabled={isDisabled}
                className={`
                   group relative flex flex-col items-center transition-all duration-200
                   ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
                `}
              >
                {/* Bottle/Prize Graphic */}
                <div className="relative">
                    {/* Bottle Neck */}
                    <div className="w-6 h-8 bg-white border-x-2 border-t-2 border-fun-dark mx-auto relative top-1 z-0"></div>
                    
                    {/* Bottle Body with Text */}
                    <div 
                      className="w-32 h-36 md:w-40 md:h-44 rounded-2xl border-4 border-fun-dark flex items-center justify-center p-2 shadow-sm relative z-10"
                      style={{ backgroundColor: bottleColor }}
                    >
                        {/* Label */}
                        <div className="bg-white/90 w-full py-4 border-y-2 border-fun-dark text-center rotate-[-3deg] shadow-sm">
                            <span className="font-display text-xl md:text-2xl text-fun-dark leading-none block">
                                {trait}
                            </span>
                        </div>
                        
                        {/* Highlight */}
                        <div className="absolute top-2 right-2 w-3 h-12 bg-white/30 rounded-full transform rotate-12"></div>
                    </div>
                </div>

                {/* Shelf Shadow */}
                <div className="absolute -bottom-6 w-40 h-4 bg-black/10 rounded-[100%] z-0 blur-sm"></div>

                {/* THE HOOP - Animations */}
                {isSelected && (
                  <div className="absolute -top-10 w-[120%] h-[140%] pointer-events-none z-30 animate-pop origin-bottom">
                      <div className="relative w-full h-full animate-[float_3s_ease-in-out_infinite]">
                           {/* Front of hoop */}
                           <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-44 h-14 md:w-52 md:h-16 border-[6px] border-fun-pink rounded-[50%] z-30 border-b-[8px]"></div>
                           
                           {/* Back part of hoop */}
                      </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Shelf Lines */}
        <div className="absolute top-[30%] left-4 right-4 h-4 bg-[#d4a373] rounded-full border-2 border-[#8a5a44] opacity-40 pointer-events-none"></div>
        <div className="absolute top-[60%] left-4 right-4 h-4 bg-[#d4a373] rounded-full border-2 border-[#8a5a44] opacity-40 pointer-events-none"></div>
        <div className="absolute top-[90%] left-4 right-4 h-4 bg-[#d4a373] rounded-full border-2 border-[#8a5a44] opacity-40 pointer-events-none"></div>

      </div>

      {/* Footer */}
      <div className="flex justify-center mt-12">
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
              NEXT LEVEL
              <ArrowRight size={32} strokeWidth={3} />
            </span>
          </button>
      </div>

    </div>
  );
};
