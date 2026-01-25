import React, { useState, useMemo } from 'react';
import { RING_TOSS_QUESTIONS } from '../constants';
import { Trait } from '../types';
import GameContainer from './ui/GameContainer';

interface RingTossProps {
  onAnswer: (traits: Trait[]) => void;
  onGameEnd: () => void;
  onSkip?: () => void;
  isDarkMode?: boolean;
  progress?: number;
}

interface DecorativeProps {
    className?: string;
    style?: React.CSSProperties;
    color?: string;
    animation?: string;
}

const Butterfly: React.FC<{ isDarkMode: boolean; style: React.CSSProperties; flapSpeed: string }> = ({ isDarkMode, style, flapSpeed }) => {
  return (
    <div className="absolute pointer-events-none z-10" style={style}>
      <div className={`relative w-[4vmin] h-[4vmin]`}>
         <div className="flex gap-[1px]" style={{ animation: `wing-flap ${flapSpeed}s ease-in-out infinite` }}>
            <div className={`w-[2vmin] h-[3vmin] rounded-tl-full rounded-bl-full border-2 transition-colors duration-500 ${isDarkMode ? 'bg-pink-400 border-pink-200 shadow-[0_0_10px_#f472b6]' : 'bg-cyan-400 border-white shadow-md'}`}></div>
            <div className={`w-[2vmin] h-[3vmin] rounded-tr-full rounded-br-full border-2 transition-colors duration-500 ${isDarkMode ? 'bg-pink-400 border-pink-200 shadow-[0_0_10px_#f472b6]' : 'bg-cyan-400 border-white shadow-md'}`}></div>
         </div>
      </div>
    </div>
  );
};

const GrassTuft: React.FC<DecorativeProps> = ({ className, style, color = "#22c55e" }) => (
  <svg viewBox="0 0 100 100" className={`absolute pointer-events-none ${className}`} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 100 Q 25 20 40 100" stroke={color} strokeWidth="8" fill="currentColor" opacity="0.3" />
    <path d="M30 100 Q 50 10 70 100" stroke={color} strokeWidth="8" fill="currentColor" opacity="0.5" />
    <path d="M60 100 Q 75 30 90 100" stroke={color} strokeWidth="8" fill="currentColor" opacity="0.7" />
  </svg>
);

const Flower: React.FC<DecorativeProps> = ({ className, color = "text-pink-400", style }) => (
   <svg viewBox="0 0 100 100" className={`w-8 h-8 absolute pointer-events-none animate-sway origin-bottom ${className} ${color}`} style={style} fill="currentColor">
     <circle cx="50" cy="50" r="15" className="text-yellow-300" />
     <circle cx="50" cy="20" r="15" />
     <circle cx="80" cy="50" r="15" />
     <circle cx="50" cy="80" r="15" />
     <circle cx="20" cy="50" r="15" />
     <path d="M45 80 L45 120" stroke="currentColor" strokeWidth="5" opacity="0.4" />
   </svg>
);

const Stake: React.FC<{
  onClick: () => void;
  isThrown: boolean;
  isSelected: boolean;
  colorClass: string;
  label: string;
  isDarkMode: boolean;
}> = ({ onClick, isThrown, isSelected, colorClass, label, isDarkMode }) => {
  return (
    <button
      onClick={onClick}
      disabled={isThrown}
      className="relative w-[12vmin] h-[25vmin] flex flex-col items-center justify-end group focus:outline-none"
    >
      <div 
        className={`absolute w-[10vmin] h-[4vmin] z-0 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isSelected 
                ? 'top-[22vmin] scale-100 rotate-[5deg]' 
                : '-top-[30vmin] scale-[2] rotate-[45deg] opacity-0 group-hover:opacity-60 group-hover:-top-[15vmin]' 
            }`}
      >
         <div className={`w-full h-full rounded-full border-[1.2vmin] bg-transparent shadow-[0_4px_4px_rgba(0,0,0,0.4)] ${isDarkMode ? 'border-pink-500 shadow-pink-900/40' : 'border-[#e2e8f0]'}`}></div>
      </div>

      <div className={`w-[2vmin] h-[20vmin] ${colorClass} rounded-t-full relative z-10 shadow-[-2px_0_2px_rgba(0,0,0,0.3)_inset] border-l border-white/20 transition-transform duration-300 group-hover:-translate-y-2`}>
         <div className="absolute top-2 right-1/4 h-[90%] w-[20%] bg-white/30 rounded-full blur-[1px]"></div>
         <div className={`absolute bottom-[105%] left-1/2 -translate-x-1/2 p-6 border-4 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 min-w-[55vmin] max-w-[65vmin] rounded-none scale-90 group-hover:scale-100 origin-bottom ${isDarkMode ? 'bg-slate-900 border-indigo-500' : 'bg-white border-sky-900'}`}>
             <div className="flex items-center justify-center">
               <div className={`font-vt323 text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-center ${isDarkMode ? 'text-pink-400' : 'text-sky-900'}`}>{label}</div>
             </div>
             <div className={`absolute top-full left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] ${isDarkMode ? 'border-t-indigo-500' : 'border-t-sky-900'}`}></div>
         </div>
      </div>

      <div 
        className={`absolute w-[10vmin] h-[4vmin] z-20 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isSelected 
                ? 'top-[22vmin] scale-100 rotate-[5deg]' 
                : '-top-[30vmin] scale-[2] rotate-[45deg] opacity-0 group-hover:opacity-60 group-hover:-top-[15vmin]' 
            }`}
        style={{ clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)' }}
      >
        <div className={`w-full h-full rounded-full border-[1.2vmin] bg-transparent shadow-[0_4px_4px_rgba(0,0,0,0.4)] relative ${isDarkMode ? 'border-pink-500 shadow-pink-900/40' : 'border-[#e2e8f0]'}`}>
             <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"></div>
        </div>
      </div>
    </button>
  );
}

const STAKE_COLORS = [
    'bg-gradient-to-b from-rose-500 to-rose-700 shadow-[0_0_10px_#f43f5e]', 
    'bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-[0_0_10px_#22d3ee]', 
    'bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_10px_#fbbf24]', 
    'bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-[0_0_10px_#10b981]', 
    'bg-gradient-to-b from-purple-500 to-purple-700 shadow-[0_0_10px_#a855f7]', 
    'bg-gradient-to-b from-fuchsia-500 to-fuchsia-700 shadow-[0_0_10px_#d946ef]'
];

const TOTAL_ROUNDS = 5;

const RingToss: React.FC<RingTossProps> = ({ onAnswer, onGameEnd, onSkip, isDarkMode = false, progress }) => {
  const [round, setRound] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isThrown, setIsThrown] = useState(false);

  const grassPositions = useMemo(() => Array.from({ length: 100 }).map(() => ({
      top: `${-10 + Math.random() * 110}%`,
      left: `${-10 + Math.random() * 110}%`,
      scale: 0.3 + Math.random() * 0.7,
      rotate: Math.random() * 30 - 15,
  })), []);
  
  const flowerPositions = useMemo(() => Array.from({ length: 40 }).map(() => ({
      top: `${15 + Math.random() * 80}%`,
      left: `${Math.random() * 95}%`,
      scale: 0.5 + Math.random() * 0.5,
      color: ['text-rose-400', 'text-fuchsia-400', 'text-cyan-400', 'text-yellow-400', 'text-violet-400'][Math.floor(Math.random() * 5)]
  })), []);

  const butterflyPositions = useMemo(() => Array.from({ length: 8 }).map(() => ({
    top: `${Math.random() * 60}%`,
    left: `${Math.random() * 80}%`,
    delay: Math.random() * 5,
    speed: 10 + Math.random() * 10,
    flap: (0.1 + Math.random() * 0.2).toFixed(2)
  })), []);

  const currentQuestion = RING_TOSS_QUESTIONS[currentQuestionIndex];

  const handleSkip = () => {
    if (isThrown) return;
    if (round < TOTAL_ROUNDS - 1) {
      setRound(prev => prev + 1);
      setCurrentQuestionIndex(prev => (prev + 1) % RING_TOSS_QUESTIONS.length);
      setSelectedAnswer(null);
      setIsThrown(false);
    } else {
      onGameEnd();
    }
  };

  const handleThrow = (trait: Trait, index: number) => {
    if (isThrown) return;
    setSelectedAnswer(index);
    setIsThrown(true);
    onAnswer([trait]);
    
    setTimeout(() => {
      if (round < TOTAL_ROUNDS - 1) {
        setRound(prev => prev + 1);
        setCurrentQuestionIndex(prev => (prev + 1) % RING_TOSS_QUESTIONS.length);
        setSelectedAnswer(null);
        setIsThrown(false);
      } else {
        onGameEnd();
      }
    }, 1500);
  };

  const POSITIONS = [
      { x: -35, y: -8, z: 0.8 }, { x: 0, y: -13, z: 0.75 }, { x: 35, y: -8, z: 0.8 },
      { x: -20, y: 2, z: 0.9 }, { x: 20, y: 2, z: 0.9 }, { x: 0, y: 12, z: 0.95 }
  ];

  return (
    <GameContainer 
      title="Precision Toss" 
      instruction={currentQuestion.question} 
      onSkip={handleSkip} 
      isDarkMode={isDarkMode} 
      progress={progress}
      howToPlay="The Meadow is filled with potential destiny stakes. Use your mouse to aim at the stake that best represents your answer. Click to 'Toss' your ring. The ring will automatically seek the targeted stake if your aim is true."
      scoringRules="Successfully tossing a ring onto a stake grants +1.2 XP. Each round features a unique set of 6 stakes. Completing all 5 rounds without skipping unlocks the 'Master Thrower' achievement in your profile."
    >
      <div className={`flex-1 w-full h-full relative overflow-hidden transition-colors duration-500 border-4 shadow-inner rounded-lg 
          ${isDarkMode ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 border-indigo-900' : 'bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-500 border-sky-900'}`}>
          
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(219,39,119,0.2)' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? 'rgba(219,39,119,0.2)' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
          </div>
          
          {grassPositions.map((pos, i) => (
             <GrassTuft key={i} style={{ top: pos.top, left: pos.left, transform: `scale(${pos.scale}) rotate(${pos.rotate}deg)` }} className={`w-[8vmin] h-[8vmin] z-0 transition-colors duration-500 ${isDarkMode ? 'text-indigo-800' : 'text-green-800'}`} color={isDarkMode ? '#312e81' : '#064e3b'} />
          ))}
          
          {flowerPositions.map((pos, i) => (
             <Flower key={i} style={{ top: pos.top, left: pos.left, transform: `scale(${pos.scale})` }} className={`z-0 ${pos.color} drop-shadow-[0_0_5px_currentColor]`} />
          ))}

          {butterflyPositions.map((pos, i) => (
            <Butterfly 
              key={i} 
              isDarkMode={isDarkMode} 
              flapSpeed={pos.flap}
              style={{ 
                top: pos.top, 
                left: pos.left, 
                animation: `butterfly-fly ${pos.speed}s ease-in-out infinite`,
                animationDelay: `-${pos.delay}s`
              }} 
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-center pb-[12vmin] z-10" style={{ perspective: '100vmin' }}>
            <div className="relative w-full h-[60vmin] flex justify-center items-end" style={{ transformStyle: 'preserve-3d' }}>
                {currentQuestion.answers.slice(0, 6).map((answer, index) => {
                    const pos = POSITIONS[index % POSITIONS.length];
                    return (
                        <div key={index} className="absolute bottom-0 transition-transform duration-500 left-1/2" style={{ transform: `translateX(-50%) translateX(${pos.x}vmin) translateY(${pos.y}vmin) scale(${pos.z})`, zIndex: Math.floor(pos.z * 100) }}>
                            <Stake onClick={() => handleThrow(answer.trait, index)} isThrown={isThrown} isSelected={selectedAnswer === index} colorClass={STAKE_COLORS[index % STAKE_COLORS.length]} label={answer.text} isDarkMode={isDarkMode} />
                        </div>
                    );
                })}
            </div>
          </div>
      </div>
       <div className={`mt-2 flex items-center justify-between px-6 py-1 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white/50'}`}>
           <span className={`font-press-start text-[1.2vmin] ${isDarkMode ? 'text-pink-400' : 'text-sky-900'}`}>ROUND: {round + 1}/5</span>
           <p className={`text-[1.5vmin] animate-pulse font-press-start transition-colors duration-500 ${isDarkMode ? 'text-indigo-400' : 'text-sky-900'}`}>SCROLL FOR MANUAL</p>
           <div className="flex gap-1">
               {[...Array(5)].map((_, i) => (
                   <div key={i} className={`w-3 h-3 border-2 transition-colors ${i <= round ? (isDarkMode ? 'bg-pink-500 border-pink-300 shadow-[0_0_5px_#f472b6]' : 'bg-yellow-400 border-sky-900') : 'bg-transparent border-gray-400'}`}></div>
               ))}
           </div>
       </div>
    </GameContainer>
  );
};

export default RingToss;