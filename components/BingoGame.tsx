
import React, { useState } from 'react';
import { BINGO_QUESTIONS, BINGO_BOARD_LAYOUT } from '../constants';
import { Trait } from '../types';
import GameContainer from './ui/GameContainer';
import ArcadeButton from './ui/ArcadeButton';

interface BingoGameProps {
  onAnswer: (traits: Trait[]) => void;
  onGameEnd: () => void;
  onSkip?: () => void;
  isDarkMode?: boolean;
}

const TRAIT_COLORS: Record<Trait, string> = {
  [Trait.CREATIVE]: 'bg-purple-300 border-purple-900 text-purple-900',
  [Trait.SOCIAL]: 'bg-pink-300 border-pink-900 text-pink-900',
  [Trait.STRATEGIC]: 'bg-blue-300 border-blue-900 text-blue-900',
  [Trait.ACTIVE]: 'bg-green-300 border-green-900 text-green-900',
  [Trait.EXPLORER]: 'bg-yellow-300 border-yellow-900 text-yellow-900',
  [Trait.CALM]: 'bg-teal-300 border-teal-900 text-teal-900',
};

const DARK_TRAIT_COLORS: Record<Trait, string> = {
  [Trait.CREATIVE]: 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_purple]',
  [Trait.SOCIAL]: 'bg-pink-600 border-pink-400 text-white shadow-[0_0_10px_pink]',
  [Trait.STRATEGIC]: 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_blue]',
  [Trait.ACTIVE]: 'bg-green-600 border-green-400 text-white shadow-[0_0_10px_green]',
  [Trait.EXPLORER]: 'bg-yellow-600 border-yellow-400 text-white shadow-[0_0_10px_yellow]',
  [Trait.CALM]: 'bg-teal-600 border-teal-400 text-white shadow-[0_0_10px_teal]',
};

const BingoGame: React.FC<BingoGameProps> = ({ onAnswer, onGameEnd, onSkip, isDarkMode = false }) => {
  const [tileIndex, setTileIndex] = useState(0); 
  const [litTiles, setLitTiles] = useState<Set<number>>(new Set());
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(BINGO_QUESTIONS[0].id);

  const currentTrait = BINGO_BOARD_LAYOUT[tileIndex];
  const currentQuestion = BINGO_QUESTIONS.find(q => q.id === currentQuestionId) || BINGO_QUESTIONS[0];
  const isLastQuestion = tileIndex === BINGO_BOARD_LAYOUT.length - 1;

  const handleAnswer = (answeredYes: boolean) => {
    if (answeredYes && currentTrait) {
      onAnswer([currentTrait]);
      setLitTiles(prev => new Set(prev).add(tileIndex));
    }
    
    if (!isLastQuestion) {
      const nextIndex = tileIndex + 1;
      setTileIndex(nextIndex);
      const standardNextQ = BINGO_QUESTIONS.find(q => q.id === `q${nextIndex + 1}`);
      if (standardNextQ) setCurrentQuestionId(standardNextQ.id);
    }
  };

  return (
    <GameContainer title="Personality Bingo" instruction="FILL THE BOARD!" onSkip={onSkip} isDarkMode={isDarkMode}>
      <div className="flex flex-col md:flex-row gap-[4vmin] w-full h-full p-4">
        <div className="flex-1 flex flex-col justify-center space-y-[4vmin] order-2 md:order-1">
          <div className={`p-[4vmin] rounded-none border-4 shadow-lg flex items-center justify-center min-h-[20vmin] transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-700 text-indigo-100' : 'bg-white border-sky-900 text-sky-950'}`}>
            <p className="text-[3vmin] text-center leading-tight font-vt323 uppercase">
                {isLastQuestion && litTiles.size > 0 ? "BINGO COMPLETE!" : currentQuestion.question}
            </p>
          </div>
          {!isLastQuestion ? (
            <div className="flex justify-center gap-[4vmin]">
              <ArcadeButton onClick={() => handleAnswer(true)} className={`text-[2.5vmin] px-[5vmin] py-[2.5vmin] ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-400'}`}>YES</ArcadeButton>
              <ArcadeButton onClick={() => handleAnswer(false)} className={`text-[2.5vmin] px-[5vmin] py-[2.5vmin] ${isDarkMode ? 'bg-red-700 text-white' : 'bg-red-400'}`}>NO</ArcadeButton>
            </div>
          ) : (
            <div className="flex justify-center">
                <ArcadeButton onClick={onGameEnd} className="text-[2.5vmin] px-[5vmin] py-[3vmin]">FINISH</ArcadeButton>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center order-1 md:order-2 h-full">
          <div className={`grid grid-cols-3 gap-[1vmin] p-[1.5vmin] border-4 w-full max-w-[60vh] aspect-square transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-900' : 'bg-sky-950 border-sky-900'}`}>
            {BINGO_BOARD_LAYOUT.map((trait, index) => {
              const isLit = litTiles.has(index);
              const isCurrent = index === tileIndex && !isLastQuestion;
              const colorClass = trait ? (isDarkMode ? DARK_TRAIT_COLORS[trait] : TRAIT_COLORS[trait]) : 'bg-gray-200';
              
              return (
                <div key={index} className={`w-full h-full border-2 rounded-sm flex items-center justify-center p-1 transition-all duration-500 relative ${isLit ? colorClass : (isDarkMode ? 'bg-indigo-950 border-indigo-900' : 'bg-sky-800 border-sky-700')} ${isCurrent ? 'ring-4 ring-yellow-400 z-10' : ''}`}>
                  <span className={`text-center text-[2vmin] font-bold break-words w-full font-press-start ${isLit ? 'drop-shadow-md' : (isDarkMode ? 'text-indigo-900' : 'text-sky-500/50')}`}>{trait}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GameContainer>
  );
};

export default BingoGame;
