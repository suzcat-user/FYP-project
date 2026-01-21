import React, { useState, useMemo, useEffect } from 'react';
import { SHOOTING_GALLERY_QUESTIONS } from '../constants';
import { Trait } from '../types';
import GameContainer from './ui/GameContainer';

interface ShootingGalleryProps {
  onAnswer: (traits: Trait[]) => void;
  onGameEnd: () => void;
  onSkip?: () => void;
  isDarkMode?: boolean;
  progress?: number;
}

const TRAIT_ICONS: Record<Trait, string> = {
  [Trait.CREATIVE]: '🎨',
  [Trait.SOCIAL]: '💬',
  [Trait.STRATEGIC]: '🧠',
  [Trait.ACTIVE]: '👟',
  [Trait.EXPLORER]: '🔭',
  [Trait.CALM]: '🍃'
};

const TRAIT_COLORS: Record<Trait, string> = {
  [Trait.CREATIVE]: 'from-pink-400 to-rose-600',
  [Trait.SOCIAL]: 'from-yellow-300 to-orange-500',
  [Trait.STRATEGIC]: 'from-blue-400 to-indigo-600',
  [Trait.ACTIVE]: 'from-emerald-300 to-green-600',
  [Trait.EXPLORER]: 'from-cyan-300 to-sky-500',
  [Trait.CALM]: 'from-violet-300 to-purple-600'
};

const BubbleTarget: React.FC<{ 
  text: string; 
  description?: string; 
  trait: Trait;
  onClick: () => void; 
  isDarkMode: boolean;
  isPopped: boolean;
}> = ({ text, description, trait, onClick, isDarkMode, isPopped }) => {
  return (
    <button 
      onClick={onClick} 
      className={`absolute w-[16vmin] h-[16vmin] rounded-full flex flex-col items-center justify-center p-2 text-center group z-30 transition-all active:scale-95 focus:outline-none 
        ${isPopped ? 'scale-150 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
    >
      <div className={`absolute inset-0 rounded-full backdrop-blur-[4px] border-4 shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br ${TRAIT_COLORS[trait]} opacity-30 group-hover:opacity-60`}>
          <div className="absolute top-[10%] left-[15%] w-[40%] h-[20%] bg-white/60 rounded-[50%] transform -rotate-45 blur-[2px]"></div>
          <div className="absolute -inset-2 bg-[radial-gradient(circle,white_0%,transparent_70%)] opacity-20 group-hover:animate-pulse"></div>
      </div>
      
      <div className="relative z-10 text-[6vmin] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:scale-125 transition-transform duration-300">
        {TRAIT_ICONS[trait]}
      </div>

      <div className={`absolute bottom-[115%] left-1/2 -translate-x-1/2 w-[35vmin] p-3 border-4 shadow-[12px_12px_0px_rgba(0,0,0,0.3)] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 origin-bottom rounded-none backdrop-blur-xl ${isDarkMode ? 'bg-slate-950 border-white text-white' : 'bg-white border-sky-900 text-sky-900'}`}>
           <p className="font-press-start text-[1.4vmin] mb-2 border-b-2 border-current pb-1 uppercase tracking-tighter">{text}</p>
           <p className={`font-vt323 text-[2.2vmin] leading-tight ${isDarkMode ? 'text-indigo-100' : 'text-gray-700'}`}>{description}</p>
           <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] ${isDarkMode ? 'border-t-white' : 'border-t-sky-900'}`}></div>
      </div>
    </button>
  );
};

const ShootingGallery: React.FC<ShootingGalleryProps> = ({ onAnswer, onGameEnd, onSkip, isDarkMode = false, progress }) => {
  const [round, setRound] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isShot, setIsShot] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [poppedId, setPoppedId] = useState<number | null>(null);

  const currentQuestion = SHOOTING_GALLERY_QUESTIONS[currentQuestionIndex];
  const TOTAL_ROUNDS = 5;

  const handleSkip = () => {
    if (round < TOTAL_ROUNDS - 1) {
      setRound(prev => prev + 1);
      setCurrentQuestionIndex(prev => (prev + 1) % SHOOTING_GALLERY_QUESTIONS.length);
      setIsShot(false);
      setPoppedId(null);
    } else {
      onGameEnd();
    }
  };

  const bubbleConfigs = useMemo(() => currentQuestion.answers.map(() => {
    return {
      top: 15 + Math.random() * 50,
      left: 10 + Math.random() * 70,
      delay: Math.random() * 8, 
      duration: 5 + Math.random() * 6,
      // Random drift vectors for movement
      moveX: Math.random() * 100 - 50,
      moveY: Math.random() * 80 - 40
    };
  }), [currentQuestionIndex]);

  const handleShot = (trait: Trait, index: number) => {
    if (isShot) return;
    setIsShot(true);
    setPoppedId(index);
    onAnswer([trait]);
    
    setTimeout(() => {
      if (round < TOTAL_ROUNDS - 1) {
        setRound(prev => prev + 1);
        setCurrentQuestionIndex(prev => (prev + 1) % SHOOTING_GALLERY_QUESTIONS.length);
        setIsShot(false);
        setPoppedId(null);
      } else {
        onGameEnd();
      }
    }, 600);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <GameContainer 
      title="Reflex Pop" 
      instruction={currentQuestion.question} 
      onSkip={handleSkip} 
      isDarkMode={isDarkMode} 
      progress={progress}
      howToPlay="The Radar identifies personality nodes floating in the digital void. Use your cursor (the Targeting Crosshair) to hover over a node and view its trait data. Left-click to 'Pop' the node and absorb its characteristics into your profile."
      scoringRules="Quick pops grant 'Reaction XP.' Popping nodes in rapid succession triggers the 'Combo Multiplier,' significantly increasing your final trait values. Avoid hesitant clicks to maintain high sensor accuracy."
    >
      <div 
        onMouseMove={handleMouseMove}
        className={`flex-1 w-full h-full flex flex-col relative overflow-hidden cursor-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-900'}`}
      >
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
                backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                transform: `perspective(500px) rotateX(10deg) translateY(${(mousePos.y / 100)}px) translateX(${(mousePos.x / 100)}px)`
             }}>
        </div>

        {/* Mouse Follow Crosshair */}
        <div 
          className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
          style={{ transform: `translate(${mousePos.x - 40}px, ${mousePos.y - 40}px)` }}
        >
            <div className="w-20 h-20 relative flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-green-500 rounded-full opacity-30 animate-pulse"></div>
                <div className="w-1 h-6 bg-green-500 absolute top-0"></div>
                <div className="w-1 h-6 bg-green-500 absolute bottom-0"></div>
                <div className="h-1 w-6 bg-green-500 absolute left-0"></div>
                <div className="h-1 w-6 bg-green-500 absolute right-0"></div>
                <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
            </div>
        </div>

        <div className="absolute inset-0 z-20">
            {currentQuestion.answers.map((answer, index) => {
                const config = bubbleConfigs[index];
                if (!config) return null;
                return (
                    <div 
                      key={`${currentQuestionIndex}-${index}`} 
                      className="absolute" 
                      style={{ 
                        top: `${config.top}%`, 
                        left: `${config.left}%`, 
                        animation: `float-around ${config.duration}s ease-in-out infinite alternate`, 
                        animationDelay: `-${config.delay}s`,
                        zIndex: isShot ? 10 : 30,
                        transform: `translate(${config.moveX}px, ${config.moveY}px)`
                      }}
                    >
                        <BubbleTarget 
                          text={answer.text} 
                          description={answer.description} 
                          trait={answer.trait}
                          isDarkMode={isDarkMode} 
                          isPopped={poppedId === index}
                          onClick={() => handleShot(answer.trait, index)} 
                        />
                    </div>
                );
            })}
        </div>

        <div className="absolute top-4 left-4 font-press-start text-[1vmin] text-green-500 flex flex-col gap-1 z-40 pointer-events-none">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span>RADAR_ACTIVE</span>
            </div>
        </div>

        <div className="absolute top-4 right-4 font-press-start text-[1.2vmin] text-yellow-400 z-40 pointer-events-none text-right">
            ROUND: {round + 1}/5
        </div>

        <div className={`absolute inset-0 pointer-events-none z-[100] transition-opacity duration-150 ${isShot ? 'opacity-30 bg-white' : 'opacity-0'}`}></div>
      </div>
      
      <div className={`mt-2 flex items-center justify-between px-6 py-2 transition-colors duration-500 bg-slate-900 border-t-4 border-slate-800`}>
           <div className="flex gap-2">
               {[...Array(5)].map((_, i) => (
                   <div key={i} className={`w-8 h-2 border transition-all ${i <= round ? 'bg-green-500 border-green-300 shadow-[0_0_5px_#22c55e]' : 'bg-transparent border-gray-700'}`}></div>
               ))}
           </div>
           <p className="text-[1.5vmin] animate-blink font-press-start text-green-400 tracking-tighter uppercase">Scroll for manual</p>
           <div className="font-press-start text-[1vmin] text-white/40 uppercase">Sensors: Active</div>
      </div>
    </GameContainer>
  );
};

export default ShootingGallery;