
import React, { useState, useEffect, useRef } from 'react';
import { TRAITS_POOL } from '../constants';
import { Hammer } from 'lucide-react';

/*
This code is a TypeScript Interface definition.
It describes the "rules" (or the shape) of the data (props) that you must pass into a component
To use this component, you must provide one property called onComplete. This property must be a function. 
[IMPORTANT] That function will receive a list of strings as an input, and it doesn't need to return anything.
 */
interface WhackAMoleProps {
  onComplete: (selectedTraits: string[]) => void;
}

const TOTAL_TRAITS_NEEDED = 3;
const MOLE_POP_INTERVAL = 2500;

/*React.FC = React Function Component
This is a Function Component, and it expects props that match the WhackAMoleProps interface*/
export const WhackAMole: React.FC<WhackAMoleProps> = ({ onComplete }) => {
  /*This is the player's "bag." Every time they successfully whack a mole, 
  the trait (e.g., "Smart") gets added here. This is the data you will eventually pass to onComplete */
  const [collectedTraits, setCollectedTraits] = useState<string[]>([]);
  /* This tracks where the mole is. If it is 0, the mole is in the 1st hole. If it is null, all holes are empty.*/
  const [activeMole, setActiveMole] = useState<number | null>(null);
  /*This tracks what is written on the mole currently popping up (e.g., "Brave", "Kind", "Lazy").*/
  const [activeTrait, setActiveTrait] = useState<string>("");
  /*This is for animation. When you whack a mole, you might want a little "+1" or "Hit!" 
  text to float up from that specific hole. This state saves which hole (id) and what text to show.*/
  const [lastEffect, setLastEffect] = useState<{id: number, text: string} | null>(null);
  const timerRef = useRef<number | null>(null);

  // Start Game Loop
  useEffect(() => {
    startGameLoop();
    return () => stopGameLoop();
  }, []);
  /*(For the code above) This is the Cleanup function. If the user gets bored and clicks "Back" or closes the component 
  while the game is playing, this ensures the timer stops running in the background. Without this, the game would keep 
  trying to pop moles even after the game board is gone (which causes errors) */

  /* Why the setTimeout? It waits 1000ms (1 second) before calling onComplete. This is a nice user experience (UX) detail—it 
  lets the player see the final animation of their last hit before the screen abruptly changes to the "Game Over" screen. */
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
    // Initial pop: Don't make the user wait for the first interval
    /*if (!timerRef.current): This is a safety check. It prevents the game from accidentally
    starting two timers at once*/
    if (!timerRef.current) popMole();
    
    // Set the rhythm
    /*window.setInterval: This creates a heartbeat. Every X milliseconds (defined by MOLE_POP_INTERVAL), 
    it runs the popMole() function. This means the moles will pop up every 2.5 seconds as the time set was 2500
    timerRef.current = ...: We save the ID of this interval into our "pocket" (the Ref) so we can find it later
     to stop it.*/
    timerRef.current = window.setInterval(() => {
       popMole();
    }, MOLE_POP_INTERVAL);
  };

/* clearInterval: This is the standard JavaScript command to stop a setInterval loop.
timerRef.current = null: We reset the ref to null so the game knows the engine is off.*/ 
  const stopGameLoop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /*The 400ms Delay: If you just switched the hole instantly (Hole 1 -> Hole 5), it looks glitchy.
   By setting it to null first, waiting, and then showing the new one, you create a natural "down and up" rhythm.
  Filtering (availableTraits): This makes the game smarter. It ensures the player doesn't keep seeing "Brave" if they have already caught "Brave." 
  It forces the game to show new content.*/
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
  
/* Input (index): The grid is numbered 0-8. If the mole is at 3 and the user clicks 3, the logic runs. 
If they click 4, nothing happens. Pacing Logic (Step 6): Notice stopGameLoop() and setTimeout(startGameLoop, 500). 
This is excellent game feel. If you don't do this, the next mole might pop up 0.1 seconds after you hit the previous one, which feels chaotic. This forces a slight pause to reward the player. */
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
