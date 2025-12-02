import React, { useState } from 'react';

interface WouldYouRatherGameProps {
  onComplete: (selections: string[]) => void;
}

const QUESTIONS = [
  // Curated list of 10 questions
  { question: "Would you rather...", options: ["Build a giant pillow fort", "Explore a secret garden"], colors: ["bg-[#84D2F6]", "bg-[#90F1AC]"] },
  { question: "Would you rather have the power to...", options: ["Talk to animals", "Invent a flying car"], colors: ["bg-[#F8A07E]", "bg-[#FDE24F]"] },
  { question: "How would you spend a free afternoon?", options: ["At a bustling arcade", "In a cozy library"], colors: ["bg-[#FF8FAB]", "bg-[#A78BFA]"] },
  { question: "What would be your dream pet?", options: ["A tiny dragon", "A loyal robot dog"], colors: ["bg-[#FDE24F]", "bg-[#90F1AC]"] },
  { question: "You find a mysterious old map. Do you...", options: ["Follow it immediately", "Research it at the library first"], colors: ["bg-[#F8A07E]", "bg-[#A78BFA]"] },
  { question: "For your birthday party, would you prefer...", options: ["A huge party with all your friends", "A small gathering with your closest pals"], colors: ["bg-[#FF8FAB]", "bg-[#84D2F6]"] },
  { question: "Would you rather have a room that is...", options: ["Perfectly organized and tidy", "A creative, beautiful mess"], colors: ["bg-[#84D2F6]", "bg-[#F8A07E]"] },
  { question: "You're directing a movie. It would be...", options: ["A hilarious comedy", "An epic action-adventure"], colors: ["bg-[#FDE24F]", "bg-[#F8A07E]"] },
  { question: "Would you rather have a notebook that...", options: ["Brings your drawings to life", "Answers any question you write in it"], colors: ["bg-[#F8A07E]", "bg-[#84D2F6]"] },
  { question: "Would you rather explore...", options: ["The deepest part of the ocean", "The farthest reaches of outer space"], colors: ["bg-[#84D2F6]", "bg-[#333] text-white"] },
];

const WouldYouRatherGame: React.FC<WouldYouRatherGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = (newAnswers: string[]) => {
     setTimeout(() => {
        if (currentIndex + 1 < QUESTIONS.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newAnswers);
        }
        setIsAnimating(false);
    }, 300);
  }

  const handleAnswer = (option: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleSkip = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    handleNext(answers);
  }

  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercentage = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-block bg-[#F8A07E] text-black font-bold px-4 py-1 rounded-full border-2 border-black mb-2">LEVEL 1</div>
        <h2 className="font-fredoka text-4xl sm:text-5xl">Make a Choice!</h2>
      </div>

      <div className={`bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] w-full max-w-2xl transition-transform duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <p className="text-center font-bold text-2xl mb-8">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`${currentQuestion.colors[index]} font-fredoka text-black text-xl p-6 rounded-2xl border-4 border-black text-center h-48 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="text-center mt-6">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-black font-bold py-2 px-4 rounded-full transition-colors"
            >
                Skip Question
            </button>
        </div>
      </div>
      
      <div className="w-full max-w-2xl mt-8">
          <div className="w-full bg-white rounded-full border-2 border-black p-1">
              <div 
                className="bg-[#90F1AC] h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%`}}
              ></div>
          </div>
          <p className="text-center font-bold mt-2 text-sm">Question {currentIndex + 1} of {QUESTIONS.length}</p>
      </div>
       <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default WouldYouRatherGame;