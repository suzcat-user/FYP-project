
import React from 'react';
import { Gamepad2, Sparkles, Play, Target, Hammer, Circle, Grid3X3 } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-6xl mx-auto text-center flex flex-col items-center animate-pop relative z-10">
      
      {/* Floating Decorative Icons */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-float text-fun-yellow hidden md:block">
         <Sparkles size={80} strokeWidth={2.5} className="drop-shadow-[4px_4px_0px_rgba(45,45,45,1)]" fill="currentColor"/>
      </div>
      <div className="absolute bottom-20 right-0 translate-x-1/2 animate-wiggle text-fun-blue hidden md:block">
         <Gamepad2 size={80} strokeWidth={2.5} className="drop-shadow-[4px_4px_0px_rgba(45,45,45,1)]" fill="#E0F7FF"/>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-4 border-fun-dark shadow-hard rounded-[3rem] p-8 md:p-16 mb-12 transform rotate-1 relative overflow-hidden max-w-4xl">
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-display text-fun-dark mb-4 leading-none tracking-tight">
            Persona<span className="text-fun-pink">Bingo</span>
          </h1>
          <div className="inline-block bg-fun-yellow border-2 border-fun-dark px-6 py-2 rounded-full shadow-hard-sm transform -rotate-2 mb-8">
            <span className="text-xl font-bold text-fun-dark">For Cool Kids!</span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-lg mx-auto mb-10">
            Go on an adventure to discover your true personality!
          </p>

          <button
            onClick={onStart}
            className="group relative inline-block focus:outline-none"
          >
            <span className="absolute inset-0 translate-x-3 translate-y-3 bg-fun-dark rounded-2xl transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></span>
            <span className="relative flex items-center gap-4 px-10 py-6 bg-fun-green border-4 border-fun-dark rounded-2xl text-3xl font-display text-fun-dark group-hover:-translate-y-1 transition-transform active:translate-y-1">
              START ADVENTURE
              <Play size={32} fill="currentColor" />
            </span>
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
        <div className="bg-fun-orange border-4 border-fun-dark rounded-3xl p-4 md:p-6 shadow-hard-sm transform hover:scale-105 transition-transform cursor-default flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
            <div className="text-fun-dark mb-2 text-4xl relative z-10"><Hammer size={36} strokeWidth={2.5} /></div>
            <h3 className="font-display text-lg md:text-xl text-fun-dark relative z-10">Level 1: Whack It</h3>
            <p className="text-xs md:text-sm text-fun-dark/80 font-bold mt-1 relative z-10">Catch fast traits</p>
        </div>

        <div className="bg-fun-blue border-4 border-fun-dark rounded-3xl p-4 md:p-6 shadow-hard-sm transform hover:scale-105 transition-transform cursor-default flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
            <div className="text-fun-dark mb-2 text-4xl relative z-10"><Target size={36} strokeWidth={2.5} /></div>
            <h3 className="font-display text-lg md:text-xl text-fun-dark relative z-10">Level 2: Targets</h3>
            <p className="text-xs md:text-sm text-fun-dark/80 font-bold mt-1 relative z-10">Shoot answers</p>
        </div>

        <div className="bg-fun-pink border-4 border-fun-dark rounded-3xl p-4 md:p-6 shadow-hard-sm transform hover:scale-105 transition-transform cursor-default flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
            <div className="text-fun-dark mb-2 text-4xl relative z-10"><Circle size={36} strokeWidth={2.5} /></div>
            <h3 className="font-display text-lg md:text-xl text-fun-dark relative z-10">Level 3: Hoops</h3>
            <p className="text-xs md:text-sm text-fun-dark/80 font-bold mt-1 relative z-10">Throw rings</p>
        </div>

        <div className="bg-fun-green border-4 border-fun-dark rounded-3xl p-4 md:p-6 shadow-hard-sm transform hover:scale-105 transition-transform cursor-default flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
            <div className="text-fun-dark mb-2 text-4xl relative z-10"><Grid3X3 size={36} strokeWidth={2.5} /></div>
            <h3 className="font-display text-lg md:text-xl text-fun-dark relative z-10">Level 4: Bingo</h3>
            <p className="text-xs md:text-sm text-fun-dark/80 font-bold mt-1 relative z-10">Stamp it!</p>
        </div>
      </div>
    </div>
  );
};
