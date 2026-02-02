import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Trait, PersonalityCode } from '../types';
import GameContainer from './ui/GameContainer';

interface ShootingGalleryProps {
  onAnswer: (traits: Trait[], personalityCodes?: PersonalityCode[]) => void;
  onGameEnd: () => void;
  onSkip?: () => void;
  isDarkMode?: boolean;
  progress?: number;
  userId?: number;
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

type ShootingGalleryAnswer = {
  text: string;
  description?: string;
  trait?: Trait | string;
  personalityCodes?: Array<PersonalityCode | string>;
};

type ShootingGalleryQuestion = {
  id: number;
  question: string;
  answers: ShootingGalleryAnswer[];
};

const API_BASE_URL = 'http://localhost:3001';

const personalityCodeToTrait: Record<string, Trait> = {
  F: Trait.ACTIVE,
  C: Trait.CREATIVE,
  N: Trait.CALM,
  S: Trait.SOCIAL,
  L: Trait.STRATEGIC
};


const BubbleTarget: React.FC<{
  text: string;
  description?: string;
  trait: Trait;
  onClick: () => void;
  isDarkMode: boolean;
  isPopped: boolean;
  tooltipBelow?: boolean;
}> = ({ text, description, trait, onClick, isDarkMode, isPopped, tooltipBelow }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute w-[16vmin] h-[16vmin] rounded-full flex flex-col items-center justify-center p-2 text-center group z-30 transition-all active:scale-95 focus:outline-none 
        ${isPopped ? 'scale-150 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
    >
      {/* Tooltip always above */}
      <div className={`absolute ${tooltipBelow ? 'top-[115%] origin-top' : 'bottom-[115%] origin-bottom'} left-1/2 -translate-x-1/2 w-[35vmin] p-3 border-4 shadow-[12px_12px_0px_rgba(0,0,0,0.3)] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 rounded-none backdrop-blur-xl ${isDarkMode ? 'bg-slate-950 border-white text-white' : 'bg-white border-sky-900 text-sky-900'}`}>
        <p className="font-press-start text-[1.4vmin] mb-2 border-b-2 border-current pb-1 uppercase tracking-tighter">{text}</p>
        <p className={`font-vt323 text-[2.2vmin] leading-tight ${isDarkMode ? 'text-indigo-100' : 'text-gray-700'}`}>{description}</p>
        <div className={`absolute ${tooltipBelow ? 'bottom-full rotate-180' : 'top-full'} left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] ${isDarkMode ? 'border-t-white' : 'border-t-sky-900'}`}></div>
      </div>

      <div className={`absolute inset-0 rounded-full backdrop-blur-[4px] border-4 shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br ${TRAIT_COLORS[trait]} opacity-30 group-hover:opacity-60`}>
        <div className="absolute top-[10%] left-[15%] w-[40%] h-[20%] bg-white/60 rounded-[50%] transform -rotate-45 blur-[2px]"></div>
        <div className="absolute -inset-2 bg-[radial-gradient(circle,white_0%,transparent_70%)] opacity-20 group-hover:animate-pulse"></div>
      </div>

      <div className="relative z-10 text-[6vmin] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:scale-125 transition-transform duration-300">
        {description || TRAIT_ICONS[trait]}
      </div>
    </button>
  );
};

const ShootingGallery: React.FC<ShootingGalleryProps> = ({ onAnswer, onGameEnd, onSkip, isDarkMode = false, progress, userId }) => {
  const [round, setRound] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isShot, setIsShot] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [poppedId, setPoppedId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<ShootingGalleryQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const skipLock = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-questions/shooting_gallery`);
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        if (isMounted && Array.isArray(data?.questions)) {
          setQuestions(data.questions);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError('Failed to load questions from the database.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex % questions.length] : null;
  const TOTAL_ROUNDS = 5;

  const handleSkip = () => {
    if (isShot || skipLock.current) return;
    skipLock.current = true;
    if (round < TOTAL_ROUNDS - 1) {
      setRound(prev => prev + 1);
      if (questions.length) {
        setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
      }
      setIsShot(false);
      setPoppedId(null);
    } else {
      onGameEnd();
    }
    setTimeout(() => {
      skipLock.current = false;
    }, 200);
  };

  const bubbleConfigs = useMemo(() => {
    const positions = [
      { top: 18, left: 18 },
      { top: 18, left: 55 },
      { top: 18, left: 78 },
      { top: 48, left: 22 },
      { top: 52, left: 52 },
      { top: 48, left: 78 }
    ];

    const shuffled = [...positions].sort(() => Math.random() - 0.5);
    return (currentQuestion?.answers || []).map((_, idx) => {
      const pos = shuffled[idx % shuffled.length];
      return {
        top: pos.top,
        left: pos.left,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 4,
        pathIndex: idx % 6
      };
    });
  }, [currentQuestionIndex, questions.length]);

  const saveAnswer = async (answer: ShootingGalleryAnswer, questionId: number) => {
    if (userId) {
      try {
        const personalityCode = answer.personalityCodes && answer.personalityCodes.length > 0 
          ? answer.personalityCodes[0] 
          : null;
        
        await fetch(`${API_BASE_URL}/api/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            game_type: 'SHOOTING_GALLERY',
            question_id: questionId,
            answer_choice: answer.text,
            personality_code: personalityCode
          })
        });
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    }
  };

  const handleShot = (trait: Trait, personalityCodes: PersonalityCode[] | undefined, index: number) => {
    if (isShot) return;
    setIsShot(true);
    setPoppedId(index);
    onAnswer([trait as Trait], personalityCodes as PersonalityCode[] | undefined);
    
    // Save answer to database
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.answers[index]) {
      saveAnswer(currentQuestion.answers[index], currentQuestion.id);
    }
    
    setTimeout(() => {
      if (round < TOTAL_ROUNDS - 1) {
        setRound(prev => prev + 1);
        if (questions.length) {
          setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
        }
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
      instruction={currentQuestion?.question || (isLoading ? 'Loading question...' : 'No questions found.')} 
      onSkip={handleSkip} 
      isDarkMode={isDarkMode} 
      progress={progress}
      howToPlay="The Radar identifies personality nodes floating in the digital void. Use your cursor (the Targeting Crosshair) to hover over a node and view its trait data. Left-click to 'Pop' the node and absorb its characteristics into your profile."
      scoringRules="Quick pops grant 'Reaction XP.' Popping nodes in rapid succession triggers the 'Combo Multiplier,' significantly increasing your final trait values. Avoid hesitant clicks to maintain high sensor accuracy."
    >
      {loadError && (
        <div className="w-full text-center text-sm text-red-500 mb-2">{loadError}</div>
      )}
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
            {(currentQuestion?.answers || []).map((answer, index) => {
                const config = bubbleConfigs[index];
                if (!config) return null;
                const derivedTrait = answer.trait
                  ? (answer.trait as Trait)
                  : (answer.personalityCodes && answer.personalityCodes.length > 0
                      ? personalityCodeToTrait[String(answer.personalityCodes[0])] || Trait.STRATEGIC
                      : Trait.STRATEGIC);
                return (
                    <div 
                      key={`${currentQuestionIndex}-${index}`} 
                      className="absolute" 
                      style={{ 
                        top: `${config.top}%`, 
                        left: `${config.left}%`, 
                        animation: `bubble-float-${config.pathIndex} ${config.duration}s ease-in-out ${config.delay}s infinite alternate`, 
                        zIndex: isShot ? 10 : 30
                      }}
                    >
                        <BubbleTarget 
                          text={answer.text} 
                          description={answer.description} 
                          trait={derivedTrait}
                          isDarkMode={isDarkMode} 
                          isPopped={poppedId === index}
                          tooltipBelow={config.top <= 24}
                          onClick={() => handleShot(derivedTrait, answer.personalityCodes as PersonalityCode[] | undefined, index)} 
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
      <style>{`
        @keyframes bubble-float-0 { 0% { transform: translate(0px, 0px); } 50% { transform: translate(38px, -30px); } 100% { transform: translate(-32px, 26px); } }
        @keyframes bubble-float-1 { 0% { transform: translate(0px, 0px); } 50% { transform: translate(-40px, 32px); } 100% { transform: translate(30px, -24px); } }
        @keyframes bubble-float-2 { 0% { transform: translate(0px, 0px); } 50% { transform: translate(32px, 38px); } 100% { transform: translate(-26px, -32px); } }
        @keyframes bubble-float-3 { 0% { transform: translate(0px, 0px); } 50% { transform: translate(-32px, -38px); } 100% { transform: translate(34px, 26px); } }
        @keyframes bubble-float-4 { 0% { transform: translate(0px, 0px); } 50% { transform: translate(28px, -40px); } 100% { transform: translate(-34px, 30px); } }
        @keyframes bubble-float-5 { 0% { transform: translate(0px, 0px); } 50% { transform: translate(-28px, 40px); } 100% { transform: translate(32px, -34px); } }
      `}</style>
    </GameContainer>
  );
};

export default ShootingGallery;