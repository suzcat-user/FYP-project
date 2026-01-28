import React, { useEffect, useState } from 'react';
import { Trait, PersonalityCode } from '../types';
import GameContainer from './ui/GameContainer';

interface WouldYouRatherProps {
  onAnswer: (traits: Trait[], personalityCodes?: PersonalityCode[]) => void;
  onGameEnd: () => void;
  onSkip?: () => void;
  isDarkMode?: boolean;
  progress?: number;
  userId?: number;
}

const DEFAULT_TOTAL_ROUNDS = 5;

type WouldYouRatherOption = {
  text: string;
  trait?: Trait | string;
  personalityCodes?: Array<PersonalityCode | string>;
};

type WouldYouRatherQuestion = {
  id?: number;
  question: string;
  options: WouldYouRatherOption[];
};

const API_BASE_URL = 'http://localhost:3001';

const personalityCodeToTrait: Record<string, Trait> = {
  F: Trait.ACTIVE,
  C: Trait.CREATIVE,
  N: Trait.CALM,
  S: Trait.SOCIAL,
  L: Trait.STRATEGIC
};

const WouldYouRather: React.FC<WouldYouRatherProps> = ({ onAnswer, onGameEnd, onSkip, isDarkMode = false, progress, userId }) => {
  const [round, setRound] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [animating, setAnimating] = useState<'left' | 'right' | null>(null);
  const [questions, setQuestions] = useState<WouldYouRatherQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/game-questions/would_you_rather`);
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        if (isMounted && Array.isArray(data?.questions)) {
          const normalized = data.questions.map((q: any, index: number) => {
            const rawOptions = Array.isArray(q?.options) ? q.options : [];
            const options = rawOptions.map((opt: any) => {
              if (typeof opt === 'string') {
                return { text: opt };
              }
              if (opt && typeof opt === 'object') {
                if (typeof opt.text === 'string') return opt;
                if (typeof opt.option === 'string') return { ...opt, text: opt.option };
              }
              return { text: 'N/A' };
            });
            return {
              id: q?.id ?? q?.question_id ?? index,
              question: q?.question || q?.question_text || 'Would you rather...?',
              options
            } as WouldYouRatherQuestion;
          });
          setQuestions(normalized);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load questions';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <GameContainer title="Decision Duel" instruction="LOADING..." isDarkMode={isDarkMode}>
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-white text-2xl">Loading questions...</div>
        </div>
      </GameContainer>
    );
  }

  if (error || questions.length === 0) {
    return (
      <GameContainer title="Decision Duel" instruction="ERROR" isDarkMode={isDarkMode}>
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-red-400 text-2xl">{error || 'No questions found'}</div>
        </div>
      </GameContainer>
    );
  }

  const totalRounds = questions.length > 0 ? questions.length : DEFAULT_TOTAL_ROUNDS;
  const currentQuestion = questions[currentQuestionIndex % questions.length];
  const currentOptions = currentQuestion?.options || [];

  const saveAnswer = async (option: WouldYouRatherOption) => {
    if (userId) {
      try {
        // Get the first personality code from the option
        const personalityCode = option.personalityCodes && option.personalityCodes.length > 0 
          ? option.personalityCodes[0] 
          : null;
        
        await fetch(`${API_BASE_URL}/api/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            game_type: 'WOULD_YOU_RATHER',
            question_id: currentQuestion?.id ?? null,
            answer_choice: option.text,
            personality_code: personalityCode
          })
        });
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    }
  };

  const handleSkip = () => {
    if (round < totalRounds - 1) {
      setRound(prev => prev + 1);
      setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
    } else {
      onGameEnd();
    }
  };

  const handleChoice = (index: number) => {
    if (animating) return;

    const option = currentOptions[index];
    if (!option) return;

    const derivedTrait = option.trait
      ? (option.trait as Trait)
      : (option.personalityCodes && option.personalityCodes.length > 0
          ? personalityCodeToTrait[String(option.personalityCodes[0])] || Trait.STRATEGIC
          : Trait.STRATEGIC);
    
    saveAnswer(option);
    onAnswer([derivedTrait], option.personalityCodes as PersonalityCode[] | undefined);
    setAnimating(index === 0 ? 'left' : 'right');

    setTimeout(() => {
        setAnimating(null);
        if (round < totalRounds - 1) {
            setRound(prev => prev + 1);
            setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
        } else {
            onGameEnd();
        }
    }, 800);
  };

  return (
    <GameContainer 
      title="Decision Duel" 
      instruction={currentQuestion?.question || "PICK YOUR DESTINY!"} 
      onSkip={handleSkip} 
      isDarkMode={isDarkMode} 
      progress={progress}
      howToPlay="The Duel splits your screen into two distinct futures. Read both scenarios carefully and click the path that resonates with your soul. There are no wrong answers—only branches in your timeline."
      scoringRules="Choosing a path instantly awards a +1.0 trait bonus. Each consecutive round builds your 'Decision Streak,' increasing the weight of your choices as you approach the final level."
    >
      <div className="flex w-full h-full bg-slate-950 relative overflow-hidden group">
        
        {/* OPTION A: LEFT (CYBER PINK) */}
        <button 
          onClick={() => handleChoice(0)}
          disabled={animating !== null || !currentOptions[0]}
          className={`flex-1 h-full relative transition-all duration-700 flex flex-col items-center justify-center p-8 overflow-hidden group/left
            ${animating === 'left' ? 'flex-[20] z-20' : animating === 'right' ? 'flex-0 opacity-0' : 'flex-1'}
            hover:bg-rose-950/20 disabled:cursor-not-allowed
          `}
        >
          {/* Moving Stripe Background */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e 0, #f43f5e 20px, transparent 20px, transparent 40px)',
            backgroundSize: '200% 200%',
            animation: 'grid-move 10s linear infinite'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/40 via-transparent to-transparent opacity-60 group-hover/left:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 text-center transform group-hover/left:scale-105 transition-transform duration-300">
            <span className="font-press-start text-[1.5vmin] text-rose-300 mb-4 block animate-pulse">PATH_01</span>
            <h2 className="font-vt323 text-[7.5vmin] text-white leading-none mb-6 drop-shadow-[0_0_15px_#f43f5e] chromatic">
              {currentOptions[0]?.text || 'N/A'}
            </h2>
            <div className="w-24 h-1.5 bg-rose-500 mx-auto shadow-[0_0_15px_#f43f5e]"></div>
          </div>
        </button>

        {/* VS CENTER SPLIT */}
        {!animating && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <div className="relative w-[15vmin] h-[15vmin] flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-rose-500/30 animate-[ping_2s_infinite]"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-[ping_3s_infinite]"></div>
                <div className="w-[12vmin] h-[12vmin] bg-slate-900 text-white font-press-start text-[4vmin] flex items-center justify-center rounded-xl border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                       <span className="neon-text-blue">VS</span>
                    </div>
                </div>
            </div>
        )}

        {/* OPTION B: RIGHT (ELECTRIC CYAN) */}
        <button 
          onClick={() => handleChoice(1)}
          disabled={animating !== null || !currentOptions[1]}
          className={`flex-1 h-full relative transition-all duration-700 flex flex-col items-center justify-center p-8 overflow-hidden group/right
            ${animating === 'right' ? 'flex-[20] z-20' : animating === 'left' ? 'flex-0 opacity-0' : 'flex-1'}
            hover:bg-cyan-950/20 disabled:cursor-not-allowed
          `}
        >
          {/* Moving Dot Background */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 0)',
            backgroundSize: '30px 30px',
            animation: 'grid-move 15s linear infinite reverse'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-l from-cyan-600/40 via-transparent to-transparent opacity-60 group-hover/right:opacity-100 transition-opacity"></div>
          <div className="relative z-10 text-center transform group-hover/right:scale-105 transition-transform duration-300">
            <span className="font-press-start text-[1.5vmin] text-cyan-300 mb-4 block animate-pulse">PATH_02</span>
            <h2 className="font-vt323 text-[7.5vmin] text-white leading-none mb-6 drop-shadow-[0_0_15px_#06b6d4] chromatic">
              {currentOptions[1]?.text || 'N/A'}
            </h2>
            <div className="w-24 h-1.5 bg-cyan-500 mx-auto shadow-[0_0_15px_#06b6d4]"></div>
          </div>
        </button>

        <div className={`absolute inset-0 pointer-events-none z-50 transition-all duration-300 ${animating ? 'opacity-100 bg-white' : 'opacity-0'}`}></div>
      </div>

      <div className={`h-20 flex items-center justify-between px-10 font-press-start text-[1.2vmin] border-t-8 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 border-rose-900/40' : 'bg-slate-900 border-cyan-900/40'}`}>
          <div className="flex flex-col items-center">
        <div className="animate-blink text-yellow-400 mb-1">SCROLL DOWN FOR MANUAL</div>
          </div>
      </div>
    </GameContainer>
  );
};

export default WouldYouRather;