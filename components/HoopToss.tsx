
import React, { useState, useEffect } from 'react';
import { TRAITS_POOL } from '../constants';
import { ArrowRight, Circle } from 'lucide-react';

//To use this component, the parent MUST provide a function to handle the end of the game.
/* When the user finishes tossing hoops, the component calls this function and passes back 
the list of traits they won (e.g., ['Creative', 'Focus']).*/

interface HoopTossProps {
  onComplete: (selectedTraits: string[]) => void;
  /*The parent can provide this if they want, but they don't have to. If provided it must be in array of 
  strings
  Maybe the user played the game before and is coming back?*/

  initialTraits?: string[];
}
/* Without the = [], your code might crash later when you try to filter initialTraits. 
This ensures that if nothing is passed, it defaults to an empty list (Clean Slate) rather than undefined.*/

export const HoopToss: React.FC<HoopTossProps> = ({ onComplete, initialTraits = [] }) => {
  //We need to remember which random words we showed the user so they don't change every time the user clicks something.
  const [shelfItems, setShelfItems] = useState<string[]>([]);

  /*It starts empty [] because the user hasn't thrown any hoops yet.
  initialTraits: Items the user won in previous levels (Read-only for this level).
  selectedTraits: Items the user is picking right now (Editable). */
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const NEEDED = 3;

  useEffect(() => {
    // 1. Filter: Look at the big list of all traits (TRAITS_POOL).
    // remove any traits the user ALREADY has (initialTraits).
    const available = TRAITS_POOL.filter(t => !initialTraits.includes(t));

    // 2. Shuffle: Mix them up randomly.
    const shuffled = [...available].sort(() => 0.5 - Math.random());

    // 3. Display: Take the top 12 items to show on the screen.
    setShelfItems(shuffled.slice(0, 12)); // 12 items for the shelf
  }, [initialTraits]);

  //this is a function.
  const throwHoop = (trait: string) => {
    // SCENARIO A: The user is clicking an item they ALREADY picked.
    if (selectedTraits.includes(trait)) {
      // Action: Deselect it (Remove it from the array).
      setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
      // Action: Add it, BUT only if they haven't reached the limit (3).
      if (selectedTraits.length < NEEDED) {
        setSelectedTraits(prev => [...prev, trait]);
      }
    }
  };

  const handleSubmit = () => {
    // 1. Validation: Don't let them finish if they only picked 1 or 2 items.
    // "If I have less than 3 items, let me add one."
    /* "If I already have 3, STOP. Do not add more." This is because selectedTraits is an 
    array therefore we can give it a length property (Returns the number of elements in the array.)*/
    if (selectedTraits.length < NEEDED) return;
    
    // 2. Merge & Save: 
  // Combine the old traits (initialTraits) + the new ones (selectedTraits)
  // and send the FULL list back to the parent.
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
