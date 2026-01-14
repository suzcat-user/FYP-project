
import React, { useState, useEffect, useCallback } from 'react';
import { RingIcon } from './icons/LevelIcons';

interface RingTossGameProps {
  onComplete: (selections: string[]) => void;
  onBack?: () => void;
}

const POSTS = [
  "Nature Explorer", "Music Jammer", "Craft Creator", "Game Master",
  "Movie Maniac", "Dance Machine", "Foodie Fan", "Puzzle Solver",
  "Story Spinner", "Animal Pal", "Chill Seeker", "Adventure Hunter",
  "Fashion Star", "Science Sleuth", "Social Butterfly", "Dream Chaser"
];
const MAX_SELECTIONS = 3;
const postHexColors = ["#F8A07E", "#84D2F6", "#FDE24F", "#90F1AC"];

const RingTossGame: React.FC<RingTossGameProps> = ({ onComplete, onBack }) => {
  const [landedHoops, setLandedHoops] = useState<string[]>([]);
  const [tossing, setTossing] = useState<string | null>(null);

  const handlePostClick = useCallback((post: string) => {
    if (tossing) return;

    const isLanded = landedHoops.includes(post);

    if (isLanded) {
       setLandedHoops(prev => prev.filter(p => p !== post));
    } else {
      if (landedHoops.length < MAX_SELECTIONS) {
        setTossing(post);
      }
    }
  }, [tossing, landedHoops]);
  
  useEffect(() => {
    if (tossing) {
      const timer = setTimeout(() => {
        setLandedHoops(prev => [...prev, tossing]);
        setTossing(null);
      }, 800); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [tossing]);


  const isLanded = (post: string) => landedHoops.includes(post);
  const canProceed = landedHoops.length === MAX_SELECTIONS;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="inline-block bg-[#FF8FAB] text-black font-bold px-4 py-1 rounded-full border-2 border-black mb-2">LEVEL 3</div>
        <h2 className="font-fredoka text-4xl sm:text-5xl">Ring Toss!</h2>
      </div>

      <div className="bg-white/60 p-3 rounded-2xl border-2 border-dashed border-pink-400 mb-6 w-full max-w-xl">
        <p className="text-center text-lg">
          <span className="font-bold">Question:</span> Pick the cones that match your vibe!
        </p>
      </div>

      <div className="bg-pink-100 p-2 sm:p-4 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] w-full max-w-3xl mb-8" style={{backgroundImage: "repeating-linear-gradient(-45deg, #fff, #fff 10px, #FFC0CB 10px, #FFC0CB 20px)"}}>
        <div className="bg-[#FEF6E4] p-4 sm:p-8 rounded-2xl border-2 border-black" style={{ perspective: '1000px' }}>
          <div className="grid grid-cols-4 gap-x-4 gap-y-12">
            {POSTS.map((post, index) => (
              <button
                key={index}
                onClick={() => handlePostClick(post)}
                disabled={tossing !== null}
                className="relative h-36 w-full cursor-pointer group disabled:cursor-wait"
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(50deg)' }}
              >
                {/* Back half of ring (Layer 1) */}
                {(isLanded(post) || tossing === post) && (
                    <div
                        className={`absolute w-24 left-1/2 ${tossing === post ? 'animate-throw' : 'landed-ring'}`}
                        style={{ transformOrigin: 'center center' }}
                    >
                        <div className="text-[#FF8FAB]"><RingIcon part="back" /></div>
                    </div>
                )}
                
                {/* Post Cone (Layer 2) */}
                <div className="absolute inset-0 flex flex-col items-center justify-end">
                  <div className="relative flex flex-col items-center">
                      <div className="w-6 h-2 bg-gray-300 border-x border-t border-black" style={{ borderRadius: '2px 2px 0 0' }}></div>
                      <div style={{
                          width: '1rem',
                          height: 0,
                          borderLeft: '1.25rem solid transparent',
                          borderRight: '1.25rem solid transparent',
                          borderBottom: `5rem solid ${postHexColors[index % postHexColors.length]}`
                      }}></div>
                      <div className="w-20 h-2.5 bg-gray-200 rounded-sm border-2 border-black shadow-lg"></div>
                  </div>
                </div>

                {/* Front half of ring (Layer 3) */}
                {(isLanded(post) || tossing === post) && (
                     <div
                        className={`absolute w-24 left-1/2 ${tossing === post ? 'animate-throw' : 'landed-ring'}`}
                        style={{ transformOrigin: 'center center' }}
                    >
                        <div className="text-[#FF8FAB]"><RingIcon part="front" /></div>
                    </div>
                )}

                 {/* Text (Layer 4, transformed back to flat) */}
                <div className="absolute -bottom-8 w-full text-center" style={{ transform: 'rotateX(-50deg)' }}>
                  <p className="font-bold text-black text-sm whitespace-nowrap">{post}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-xl">
        <div className="flex items-center space-x-2 mb-4">
          <span className="font-bold text-sm">HOOPS LANDED:</span>
          {[...Array(MAX_SELECTIONS)].map((_, i) => (
            <div key={i} className={`w-6 h-6 rounded-full border-2 border-black ${i < landedHoops.length ? 'bg-[#FF8FAB]' : 'bg-white'}`}>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-4">
          <button
            onClick={onBack}
            className="bg-white hover:bg-gray-50 text-black font-bold py-3 px-4 rounded-2xl border-4 border-black transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => onComplete(landedHoops)}
            className="bg-white hover:bg-gray-50 text-black font-bold py-3 px-4 rounded-2xl border-4 border-black transition-all"
          >
            Skip Question →
          </button>
        </div>
        <button
          onClick={() => onComplete(landedHoops)}
          disabled={!canProceed}
          className="font-fredoka w-full max-w-sm bg-[#90F1AC] text-black text-2xl py-4 rounded-2xl border-4 border-black hover:bg-[#7bce93] transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-1 active:translate-y-0 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
        >
          GET MY PERSONALITY →
        </button>
      </div>
      <style>{`
        @keyframes fall-and-settle {
          0% {
              transform: translateX(-50%) translateY(-80px) rotateX(100deg) scale(1.5);
              opacity: 0;
          }
          30% {
              opacity: 1;
          }
          100% {
              transform: translateX(-50%) translateY(38px) rotateX(75deg) scale(1);
              opacity: 1;
          }
        }
        .animate-throw {
            animation: fall-and-settle 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .landed-ring {
            transform: translateX(-50%) translateY(38px) rotateX(75deg);
        }
      `}</style>
    </div>
  );
};

export default RingTossGame;
