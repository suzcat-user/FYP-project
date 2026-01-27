import React, { useEffect, useState } from 'react';

interface WouldYouRatherGameProps {
  onComplete: (selections: string[]) => void;
}

type QuestionItem = {
  question: string;
  options: Array<{ text: string; personalityCodes?: string[] }>;
  colors: string[];
};

const API_BASE_URL = 'http://localhost:3002';

const WouldYouRatherGame: React.FC<WouldYouRatherGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-questions/would_you_rather`);
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

  const handleNext = (newAnswers: string[]) => {
     setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newAnswers);
        }
        setIsAnimating(false);
    }, 300);
  }

  const handleAnswer = (optionText: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newAnswers = [...answers, optionText];
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleSkip = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    handleNext(answers);
  }

  const handleBack = () => {
    if (isAnimating || currentIndex === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex - 1);
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setIsAnimating(false);
    }, 300);
  }

  const currentQuestion = questions[currentIndex];
  const progressPercentage = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-block bg-[#F8A07E] text-black font-bold px-4 py-1 rounded-full border-2 border-black mb-2">LEVEL 1</div>
        <h2 className="font-fredoka text-4xl sm:text-5xl">Make a Choice!</h2>
      </div>

      <div className={`bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] w-full max-w-2xl transition-transform duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {isLoading ? (
          <p className="text-center font-bold text-2xl mb-8">Loading questions...</p>
        ) : currentQuestion ? (
          <>
            <p className="text-center font-bold text-2xl mb-8">{currentQuestion.question}</p>
            {loadError && (
              <p className="text-center text-sm text-gray-500 mb-4">{loadError}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={`${option.text}-${index}`}
                  onClick={() => handleAnswer(option.text)}
                  className={`${currentQuestion.colors[index]} font-fredoka text-black text-xl p-6 rounded-2xl border-4 border-black text-center h-48 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center font-bold text-2xl mb-8">No questions found in the database.</p>
        )}
        <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0 || !currentQuestion}
              className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-black font-bold py-3 px-6 rounded-2xl border-4 border-black transition-all disabled:cursor-not-allowed"
            >
                ← Back
            </button>
            <button
              onClick={handleSkip}
              disabled={!currentQuestion}
              className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-black font-bold py-3 px-6 rounded-2xl border-4 border-black transition-all disabled:cursor-not-allowed"
            >
                Skip Question →
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
            <p className="text-center font-bold mt-2 text-sm">Question {questions.length ? currentIndex + 1 : 0} of {questions.length}</p>
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