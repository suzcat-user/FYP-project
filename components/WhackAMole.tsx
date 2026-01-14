
import React, { useState, useEffect } from 'react';
import { WHACK_A_MOLE_QUESTIONS } from '../constants';
import { Trait } from '../types';
import GameContainer from './ui/GameContainer';

interface WhackAMoleProps {
  onAnswer: (traits: Trait[]) => void;
  onGameEnd: () => void;
  onSkip: () => void;
  isDarkMode?: boolean;
}

// --- Decorative Components ---

interface DecorativeProps {
    className?: string;
    style?: React.CSSProperties;
    color?: string;
    animation?: string;
}

const GrassTuft: React.FC<DecorativeProps> = ({ className, style, color = "#86efac" }) => (
  <svg viewBox="0 0 100 100" className={`absolute pointer-events-none ${className}`} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 100 Q 25 20 40 100" stroke={color} strokeWidth="8" fill="currentColor" opacity="0.4" />
    <path d="M30 100 Q 50 10 70 100" stroke={color} strokeWidth="8" fill="currentColor" opacity="0.6" />
    <path d="M60 100 Q 75 30 90 100" stroke={color} strokeWidth="8" fill="currentColor" opacity="0.8" />
  </svg>
);

const Mole: React.FC<{ text: string; onClick: () => void; active: boolean; isDarkMode: boolean }> = ({ text, onClick, active, isDarkMode }) => {
  const animationClass = active ? 'animate-pop-up' : 'animate-hide-down';
  return (
    <div className="relative flex flex-col items-center z-20">
      <div className={`w-[20vmin] h-[20vmin] rounded-full flex items-center justify-center overflow-hidden border-[0.5vmin] relative z-10 shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-indigo-950 border-pink-900' : 'bg-[#a1662f] border-[#7a4d23]'}`}>
        <div className={`w-full h-full flex flex-col items-center justify-end transform ${animationClass}`}>
          <div className={`text-center text-[1.8vmin] font-bold p-2 w-full cursor-pointer h-full flex items-center justify-center leading-tight transition-colors duration-500 ${isDarkMode ? 'bg-pink-600 text-white hover:bg-pink-500' : 'bg-pink-300 text-gray-800 hover:bg-pink-200'}`} onClick={onClick}>
              {text}
          </div>
          <div className={`relative w-[14vmin] h-[14vmin] rounded-full -mb-[2vmin] border-[0.5vmin] shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-indigo-700' : 'bg-[#f4a460] border-[#d28c50]'}`}>
              {/* Eyes */}
              <div className={`absolute top-[35%] left-[25%] w-[1.5vmin] h-[1.5vmin] rounded-full ${isDarkMode ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-gray-800'}`}></div>
              <div className={`absolute top-[35%] right-[25%] w-[1.5vmin] h-[1.5vmin] rounded-full ${isDarkMode ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-gray-800'}`}></div>
              {/* Nose */}
              <div className={`absolute top-[55%] left-1/2 -translate-x-1/2 w-[2.5vmin] h-[2vmin] rounded-full border-2 ${isDarkMode ? 'bg-pink-400 border-pink-600' : 'bg-pink-500 border-pink-700'}`}></div>
          </div>
        </div>
      </div>
      <div className="w-[24vmin] h-[3vmin] bg-black/20 rounded-full absolute -bottom-2 z-0 blur-sm"></div>
    </div>
  );
};

const TOTAL_ROUNDS = 2;

const WhackAMole: React.FC<WhackAMoleProps> = ({ onAnswer, onGameEnd, onSkip, isDarkMode = false }) => {
  const [round, setRound] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeMoles, setActiveMoles] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoize positions
  const [grassPositions] = useState(() => Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 90}%`,
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * 20 - 10,
  })));

  const currentQuestion = WHACK_A_MOLE_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    setIsTransitioning(true);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    currentQuestion.answers.forEach((_, index) => {
      const delay = Math.random() * 500 + 100;
      timeouts.push(setTimeout(() => {
        setActiveMoles(prev => [...prev, index]);
      }, delay));
    });

    const transitionTimeout = setTimeout(() => setIsTransitioning(false), 800);
    
    return () => {
        timeouts.forEach(clearTimeout);
        clearTimeout(transitionTimeout);
    };
  }, [currentQuestionIndex]);

  const handleRegenerate = () => {
    if (isTransitioning) return;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * WHACK_A_MOLE_QUESTIONS.length);
    } while (newIndex === currentQuestionIndex && WHACK_A_MOLE_QUESTIONS.length > 1);
    
    setActiveMoles([]);
    setCurrentQuestionIndex(newIndex);
  };

  const handleMoleClick = (trait: Trait, moleIndex: number) => {
    if (isTransitioning) return;
    
    onAnswer([trait]);
    setActiveMoles(prev => prev.filter(m => m !== moleIndex));
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveMoles([]);
      if (round < TOTAL_ROUNDS - 1) {
        setRound(prev => prev + 1);
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * WHACK_A_MOLE_QUESTIONS.length);
        } while (newIndex === currentQuestionIndex && WHACK_A_MOLE_QUESTIONS.length > 1);
        setCurrentQuestionIndex(newIndex);
      } else {
        onGameEnd();
      }
    }, 500);
  };

  return (
    <GameContainer title="Whack-A-Mole" instruction={currentQuestion.question} onSkip={onSkip} onRegenerate={handleRegenerate} isDarkMode={isDarkMode}>
      <div className={`relative w-full h-full flex-1 rounded-3xl overflow-hidden border-4 shadow-inner flex flex-col justify-center items-center transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 border-indigo-900' : 'bg-[#dcfce7] border-sky-900'}`}>
        
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
            {grassPositions.map((pos) => (
                <GrassTuft 
                    key={`grass-${pos.id}`}
                    className={`w-[8vmin] h-[8vmin] transition-colors duration-500 ${isDarkMode ? 'text-indigo-800' : 'text-green-400'}`}
                    color={isDarkMode ? '#4338ca' : '#86efac'}
                    style={{ top: pos.top, left: pos.left, transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)` }}
                />
            ))}
            {isDarkMode && (
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]"></div>
            )}
        </div>

        {/* Moles Grid */}
        <div className="grid grid-cols-3 gap-x-[5vmin] gap-y-[5vmin] p-[5vmin] relative z-20 w-full h-full content-center justify-items-center">
          {currentQuestion.answers.map((answer, index) => (
            <Mole
              key={index}
              text={answer.text}
              active={activeMoles.includes(index)}
              isDarkMode={isDarkMode}
              onClick={() => handleMoleClick(answer.trait, index)}
            />
          ))}
        </div>
      </div>
    </GameContainer>
  );
};

export default WhackAMole;
