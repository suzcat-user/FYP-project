
import React, { useState, useEffect, useRef } from 'react';
import { TRAITS_POOL } from '../constants';
import { Hammer } from 'lucide-react';

interface WhackAMoleProps {
  onComplete: (selectedTraits: string[]) => void;
}

const TOTAL_TRAITS_NEEDED = 3;
const MOLE_POP_INTERVAL = 2500;

export const WhackAMole: React.FC<WhackAMoleProps> = ({ onComplete }) => {
  const [collectedTraits, setCollectedTraits] = useState<string[]>([]);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [activeTrait, setActiveTrait] = useState<string>("");
  const [lastEffect, setLastEffect] = useState<{id: number, text: string} | null>(null);
  const timerRef = useRef<number | null>(null);

  // Start Game Loop
  useEffect(() => {
    startGameLoop();
    return () => stopGameLoop();
  }, []);

  useEffect(() => {
    if (collectedTraits.length >= TOTAL_TRAITS_NEEDED) {
      stopGameLoop();
      setActiveMole(null); 
      setTimeout(() => {
        onComplete(collectedTraits);
      }, 1000);
    }
  }, [collectedTraits, onComplete]);

  const startGameLoop = () => {
    // Initial pop
    if (!timerRef.current) popMole();
    
    timerRef.current = window.setInterval(() => {
       popMole();
    }, MOLE_POP_INTERVAL);
  };

  const stopGameLoop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const popMole = () => {
    setActiveMole(null);
    
    setTimeout(() => {
        const randomHole = Math.floor(Math.random() * 9);
        
        // Filter out traits we already caught so they don't appear again
        const availableTraits = TRAITS_POOL.filter(t => !collectedTraits.includes(t));
        
        // Fallback if we run out (shouldn't happen with large pool)
        const pool = availableTraits.length > 0 ? availableTraits : TRAITS_POOL;
        const randomTrait = pool[Math.floor(Math.random() * pool.length)];
        
        setActiveMole(randomHole);
        setActiveTrait(randomTrait);
    }, 400); // Short delay to allow "going down" animation
  };

  const whackMole = (index: number) => {
    if (index === activeMole && activeTrait) {
        if (collectedTraits.includes(activeTrait)) return;

        setCollectedTraits(prev => [...prev, activeTrait]);
        setLastEffect({ id: index, text: "GOT IT!" });
        setActiveMole(null);

        setTimeout(() => setLastEffect(null), 800);
        
        // Reset timer to give a moment of breath before next mole
        stopGameLoop();
        setTimeout(startGameLoop, 500); 
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-slide-up flex flex-col items-center">
        
      <div className="text-center mb-8">
        <div className="inline-block bg-fun-orange text-fun-dark font-display text-xl px-4 py-1 rounded-full border-2 border-fun-dark mb-2 rotate-[-2deg]">
           LEVEL 1
        </div>
        <h2 className="text-4xl md:text-6xl font-display text-fun-dark mb-2 drop-shadow-sm">
          Whack-a-Trait!
        </h2>
        <div className="bg-white border-2 border-fun-dark px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-hard-sm">
            <Hammer className="text-fun-orange animate-wiggle" size={24} />
            <p className="text-xl font-bold text-gray-700">
              Catch <span className="text-fun-pink text-2xl font-display">{TOTAL_TRAITS_NEEDED}</span> things that are totally YOU!
            </p>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-fun-green/20 p-4 md:p-10 rounded-[3rem] border-4 border-fun-dark shadow-hard w-full max-w-[700px] relative select-none">
        
        {/* Progress Bar */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border-4 border-fun-dark rounded-full px-6 py-3 flex items-center gap-3 shadow-hard-sm z-30 w-72 md:w-96">
             <span className="font-display text-fun-dark text-lg">Collected:</span>
             <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-fun-dark">
                <div 
                    className="h-full bg-fun-pink transition-all duration-300"
                    style={{ width: `${(collectedTraits.length / TOTAL_TRAITS_NEEDED) * 100}%`}}
                ></div>
             </div>
             <span className="font-display text-xl">{collectedTraits.length}/{TOTAL_TRAITS_NEEDED}</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8">
            {Array.from({ length: 9 }).map((_, index) => {
                const isActive = activeMole === index;
                
                return (
                    <div key={index} className="relative aspect-square flex justify-center items-end">
                        
                        {/* Hole Background (Behind Mole) */}
                        <div className="absolute bottom-2 w-[80%] h-[30%] bg-fun-dark/30 rounded-[50%] z-0"></div>

                        {/* MASKING CONTAINER: This clips the mole so it looks like it's inside the hole */}
                        <div className="absolute bottom-4 w-full h-[180%] overflow-hidden flex items-end justify-center pointer-events-none z-10 rounded-b-[2rem]">
                            
                            {/* Moving Group (Mole + Sign) */}
                            <div 
                                onClick={() => whackMole(index)}
                                className={`
                                    relative flex flex-col items-center cursor-pointer pointer-events-auto transition-transform duration-300 ease-out
                                    ${isActive ? 'translate-y-[10%]' : 'translate-y-[110%]'}
                                `}
                            >
                                {/* Sign - INCREASED SIZE */}
                                <div className="relative z-20 -mb-4 origin-bottom animate-wiggle">
                                    <div className="bg-white border-4 border-fun-dark px-4 py-3 md:px-6 md:py-5 rounded-xl shadow-sm transform -rotate-2 hover:scale-105 transition-transform min-w-[130px] max-w-[180px] md:min-w-[180px] md:max-w-[240px]">
                                        <span className="block text-xl md:text-3xl font-display font-bold text-fun-dark leading-none text-center">
                                            {activeTrait}
                                        </span>
                                    </div>
                                    <div className="w-4 h-12 bg-fun-dark mx-auto rounded-full"></div>
                                </div>

                                {/* Mole Body */}
                                <div className="w-24 h-20 md:w-32 md:h-28 bg-fun-orange rounded-t-[3rem] border-4 border-fun-dark relative shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.1)] z-10 hover:bg-fun-yellow transition-colors">
                                    {/* Eyes */}
                                    <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 flex gap-5 md:gap-6">
                                        <div className="w-4 h-4 md:w-5 md:h-5 bg-fun-dark rounded-full animate-pulse"></div>
                                        <div className="w-4 h-4 md:w-5 md:h-5 bg-fun-dark rounded-full animate-pulse"></div>
                                    </div>
                                    {/* Nose */}
                                    <div className="absolute top-11 md:top-14 left-1/2 -translate-x-1/2 w-10 h-6 md:w-12 md:h-7 bg-fun-pink/60 rounded-full border-2 border-fun-dark/20"></div>
                                    {/* Tooth */}
                                    <div className="absolute top-10 md:top-13 left-1/2 -translate-x-1/2 w-4 h-3 bg-white rounded-b-md mt-3 border border-gray-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Hole Foreground Gradient (Optional depth) */}
                        <div className="absolute bottom-2 w-[84%] h-[15%] bg-gradient-to-t from-black/20 to-transparent rounded-b-[50%] pointer-events-none z-20"></div>

                        {/* Hit Effect Pop-up */}
                        {lastEffect?.id === index && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-40 animate-pop pointer-events-none">
                                <div className="bg-fun-yellow text-fun-dark font-display text-2xl md:text-4xl border-4 border-fun-dark px-6 py-3 rounded-full shadow-hard transform -rotate-12 whitespace-nowrap">
                                    {lastEffect.text}
                                </div>
                             </div>
                        )}
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};
