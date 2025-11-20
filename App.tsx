
import React, { useState, useRef } from 'react';
import { GameState, PersonaResult } from './types';
import { Landing } from './components/Landing';
import { TargetGame } from './components/TargetGame';
import { WhackAMole } from './components/WhackAMole';
import { HoopToss } from './components/HoopToss';
import { BingoLevel } from './components/BingoLevel';
import { generatePersona } from './services/geminiService';
import { Loader2, RefreshCw, Smile, ArrowLeft, Heart } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.LANDING);
  const [persona, setPersona] = useState<PersonaResult | null>(null);
  const [collectedTraits, setCollectedTraits] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartGame = () => {
    setCollectedTraits([]);
    setGameState(GameState.LEVEL_1_WHACK);
    scrollToTop();
  };

  const handleWhackComplete = (traits: string[]) => {
    setCollectedTraits(traits);
    // Move to Level 2
    setGameState(GameState.LEVEL_2_TARGET);
    scrollToTop();
  };

  const handleTargetComplete = (traits: string[]) => {
    setCollectedTraits(traits);
    // Move to Level 3
    setGameState(GameState.LEVEL_3_HOOP);
    scrollToTop();
  };

  const handleHoopComplete = (traits: string[]) => {
    setCollectedTraits(traits);
    // Move to Level 4
    setGameState(GameState.LEVEL_4_BINGO);
    scrollToTop();
  };

  const handleBingoComplete = async (finalTraits: string[]) => {
    setGameState(GameState.ANALYZING);
    scrollToTop();
    try {
      const result = await generatePersona(finalTraits);
      setPersona(result);
      setGameState(GameState.RESULT);
      // Celebrate results loaded
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error(e);
      setGameState(GameState.LANDING);
    }
  };

  const handleReset = () => {
    setPersona(null);
    setCollectedTraits([]);
    setGameState(GameState.LANDING);
    scrollToTop();
  };

  return (
    <div className="min-h-screen relative font-sans text-fun-dark overflow-x-hidden bg-fun-yellow/10">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none pattern-bg"></div>

      <div ref={topRef}></div>
      
      {/* Fun Header */}
      <header className="fixed top-0 w-full z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md border-4 border-fun-dark rounded-2xl px-4 py-2 flex justify-between items-center shadow-hard-sm">
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={handleReset}>
               <div className="bg-fun-pink text-white p-2 rounded-xl border-2 border-fun-dark">
                  <Smile size={24} strokeWidth={2.5} />
               </div>
               <span className="font-display text-xl tracking-tight text-fun-dark hidden md:block">
                 Persona<span className="text-fun-pink">Bingo</span>
               </span>
            </div>
            {gameState !== GameState.LANDING && (
              <button 
                onClick={handleReset} 
                className="flex items-center gap-2 font-bold text-sm text-fun-dark bg-fun-blue hover:bg-fun-green border-2 border-fun-dark px-4 py-2 rounded-xl transition-colors shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-y-[2px] active:shadow-none"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pt-32 pb-20 min-h-screen flex flex-col items-center justify-center">
        
        {gameState === GameState.LANDING && (
          <Landing onStart={handleStartGame} />
        )}

        {gameState === GameState.LEVEL_1_WHACK && (
          <WhackAMole onComplete={handleWhackComplete} />
        )}

        {gameState === GameState.LEVEL_2_TARGET && (
          <TargetGame initialTraits={collectedTraits} onComplete={handleTargetComplete} />
        )}

        {gameState === GameState.LEVEL_3_HOOP && (
          <HoopToss initialTraits={collectedTraits} onComplete={handleHoopComplete} />
        )}

        {gameState === GameState.LEVEL_4_BINGO && (
          <BingoLevel initialTraits={collectedTraits} onComplete={handleBingoComplete} />
        )}

        {gameState === GameState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 animate-pop">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-fun-pink rounded-full animate-ping opacity-40"></div>
              <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center border-4 border-fun-dark shadow-hard">
                <Loader2 className="w-12 h-12 text-fun-blue animate-spin" strokeWidth={3} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border-4 border-fun-dark shadow-hard-sm max-w-md transform rotate-1">
              <h2 className="text-2xl font-display text-fun-dark mb-2">
                Mixing Potions... ✨
              </h2>
              <p className="text-lg font-medium text-gray-500">
                Creating your ultimate personality profile!
              </p>
            </div>
          </div>
        )}

        {gameState === GameState.RESULT && persona && (
          <div className="max-w-5xl w-full animate-slide-up space-y-12">
            
            {/* Hero Result Header */}
            <div className="text-center mb-8 relative">
              <div className="inline-block bg-fun-yellow border-4 border-fun-dark px-6 py-2 rounded-full shadow-hard-sm mb-6 transform -rotate-2">
                <span className="font-display text-lg text-fun-dark tracking-wide">YOUR OFFICIAL PERSONALITY</span>
              </div>
              
              <div className="relative z-10 mb-8">
                <h1 className="text-5xl md:text-8xl font-display text-fun-dark drop-shadow-[4px_4px_0px_#FF70A6] mb-6">
                  {persona.archetype}
                </h1>
                <div className="bg-white inline-block px-8 py-4 rounded-3xl border-4 border-fun-dark shadow-hard transform rotate-1 max-w-2xl">
                   <p className="text-2xl md:text-4xl font-display text-fun-purple leading-tight">
                    "{persona.tagline}"
                   </p>
                </div>
              </div>

              <div className="max-w-3xl mx-auto bg-white p-8 rounded-[2rem] border-4 border-fun-dark shadow-hard-lg text-xl md:text-2xl font-medium text-gray-700 leading-relaxed">
                 {persona.description}
              </div>
            </div>

            {/* Hobbies Section */}
            <div className="max-w-4xl mx-auto">
                 <div className="flex items-center justify-center gap-3 mb-8">
                   <div className="p-3 bg-fun-green border-2 border-fun-dark text-fun-dark rounded-xl shadow-hard-sm rotate-[-6deg]">
                     <Heart size={32} strokeWidth={3} fill="currentColor" className="text-white" />
                   </div>
                   <h3 className="text-4xl font-display text-fun-dark">Hobbies For You</h3>
                 </div>

                 <div className="grid md:grid-cols-3 gap-6">
                   {persona.hobbies.map((hobby, i) => (
                     <div key={i} className="bg-white p-6 rounded-3xl border-4 border-fun-dark shadow-hard hover:-translate-y-2 hover:shadow-hard-lg transition-all duration-300">
                       <div className="bg-fun-blue w-12 h-12 rounded-full flex items-center justify-center border-2 border-fun-dark mb-4 text-xl font-display text-fun-dark">
                         {i + 1}
                       </div>
                       <h4 className="font-display text-2xl text-fun-dark mb-3">{hobby.name}</h4>
                       <p className="text-gray-600 mb-4 leading-snug min-h-[3rem]">{hobby.description}</p>
                       <div className="bg-fun-yellow/30 p-3 rounded-xl border-2 border-fun-dark/10 text-sm font-bold text-fun-dark/70">
                         Why? {hobby.whyItFits}
                       </div>
                     </div>
                   ))}
                 </div>
            </div>

            <div className="flex justify-center pt-12 pb-8">
               <button 
                  onClick={handleReset}
                  className="bg-fun-dark text-white font-display text-xl px-8 py-4 rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-3 border-4 border-transparent hover:border-fun-pink"
               >
                  <RefreshCw size={24} />
                  Play Again
               </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
