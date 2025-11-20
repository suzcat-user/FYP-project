
import React, { useState, useEffect } from 'react';
//Import React and two tools used for storing data and running effects//
import { TRAITS_POOL } from '../constants';
 // Import the list of all traits we can use in the game//
import { Crosshair, Check, ArrowRight } from 'lucide-react';
// Import icons used in the UI//

interface TargetGameProps { 
    // This defines what input values this component can receive//
  onComplete: (selectedTraits: string[]) => void;
    // A function we call when the player finishes this level and submits their chosen traits //
  initialTraits?: string[];
}
  // Optional list of traits that were already selected before this level //

export const TargetGame: React.FC<TargetGameProps> = ({ onComplete, initialTraits = [] }) => {
      // Create the TargetGame component.
  // It receives two things: onComplete function and initialTraits list.
  // If no initialTraits are given, it uses an empty list by default //

  const [rows, setRows] = useState<string[][]>([]);
   // rows = the trait lists shown scrolling on screen.
  // setRows = a function to update those rows //

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    // Stores the traits the user has clicked (chosen) //

  const [lastShot, setLastShot] = useState<{x: number, y: number} | null>(null);
  // Stores the location of the last mouse click to show a visual "shot" animation //

  const TARGETS_NEEDED = 3;
    // The player must pick 3 traits before they can continue //

  useEffect(() => {
  // This runs when the component first loads or whenever initialTraits change //
    const availableTraits = TRAITS_POOL.filter(t => !initialTraits.includes(t)).sort(() => 0.5 - Math.random());
       // Start with the full list of traits available //
      // Filter = Remove any traits that the user already selected earlier //
    // Shuffle the traits randomly so the scrolling looks different each time //

    const chunkSize = Math.ceil(availableTraits.length / 3);
        // Divide traits into 3 roughly equal groups, one for each scrolling row //
    const row1 = availableTraits.slice(0, chunkSize);
        // Take the first third of the traits //
    const row2 = availableTraits.slice(chunkSize, chunkSize * 2);
        // Take the second third //
    const row3 = availableTraits.slice(chunkSize * 2);
    // Take the remaining traits //

    setRows([
        [...row1, ...row1, ...row1], 
              // Repeat row 1 three times so it can scroll smoothly and look infinite //
        [...row2, ...row2, ...row2],
              // Repeat row 2 //
        [...row3, ...row3, ...row3],
              // Repeat row 3 //
    ]);
  }, [initialTraits]);
    // Re-run this effect if the initialTraits change //


  const handleShot = (trait: string, e: React.MouseEvent) => {
    // Function that runs when the player clicks on a trait target. trait = which trait was clicked, e = click event
    e.stopPropagation();
      // Stop this click from affecting other elements around it
    
    setLastShot({ x: e.clientX, y: e.clientY });
      // Record the mouse click position to show a visual "bang" effect
    setTimeout(() => setLastShot(null), 300);
      // Remove the visual bang effect after 0.3 seconds

    if (selectedTraits.includes(trait)) {
          // If this trait was already selected

        // Deselect if clicked again
        setSelectedTraits(prev => prev.filter(t => t !== trait));
    // Remove it from the selected traits (deselect it)
    } else {
  // If this trait is not already selected
        if (selectedTraits.length < TARGETS_NEEDED) {
            // Only allow selecting if we haven’t reached the max number of targets
            setSelectedTraits(prev => [...prev, trait]);
            // Add the clicked trait to the list of selected traits
        }
    }
  };

  const handleSubmit = () => {
    // Function that runs when player clicks "Next Level" button
    if (selectedTraits.length < TARGETS_NEEDED) return;
      // Do nothing if player hasn’t selected enough traits yet
    onComplete([...initialTraits, ...selectedTraits]);
      // Send all traits (previous + current selected) back to parent component
  };

  return (
    // Start of what will be shown on screen
    <div className="w-full max-w-6xl mx-auto animate-slide-up overflow-hidden pb-12">
         // Main container of the game, centered, slides up, hides overflow, padding bottom 12
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
    // Inline CSS for scrolling animation of targets (left/right) and pause on hover

      {/* Header Question */}
      <div className="text-center mb-8 relative z-10">
            // Container for the header, center text, margin bottom 8, ensure it’s on top
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
        // Developer comment: This is the yellow "bang" animation when player clicks a target
        {lastShot && (
            // Only show this effect if there is a last shot recorded
            <div 
                className="fixed w-24 h-24 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 animate-pop"
                style={{ left: lastShot.x, top: lastShot.y }}
                // The yellow circle and crosshair appear exactly at the click position, do not block clicks, animate pop//
            >
            
                 <div className="absolute inset-0 bg-fun-yellow rounded-full animate-ping opacity-75"></div>
                 <Crosshair className="w-full h-full text-fun-dark animate-spin" />
            </div>
                     // Crosshair icon that spins at the click location
        )}

      </div>

      {/* Footer */}
      <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
                    // When clicked, submit selected traits
            disabled={selectedTraits.length < TARGETS_NEEDED}
                    // Disable button if player hasn’t picked enough traits
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
