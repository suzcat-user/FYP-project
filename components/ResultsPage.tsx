import React from 'react';
import { PersonalityResult } from '../types';

interface ResultsPageProps {
  result: PersonalityResult | null;
  isLoading: boolean;
  error: string | null;
  onPlayAgain: () => void;
  onNavigateToCommunity: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#FF8FAB]"></div>
        <p className="font-fredoka text-2xl mt-4">Charting your personality map...</p>
        <p className="mt-2">This can take a moment!</p>
    </div>
);


const ResultsPage: React.FC<ResultsPageProps> = ({ result, isLoading, error, onPlayAgain, onNavigateToCommunity }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!result) {
    return (
        <div className="text-center p-8">
            <h2 className="font-fredoka text-3xl mb-4">Oh no!</h2>
            <p className="max-w-md">{error || "Something went wrong while discovering your personality. Please try again!"}</p>
            <button
                onClick={onPlayAgain}
                className="font-fredoka mt-8 bg-gray-800 text-white text-lg px-8 py-3 rounded-xl border-2 border-black hover:bg-gray-700 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-0.5 active:translate-y-0"
            >
                Play Again
            </button>
        </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center text-center p-4 animate-fade-in">
        <div className="inline-block bg-[#FDE24F] px-4 py-1 rounded-full border-2 border-black mb-4">
            <span className="font-bold text-sm">YOUR OFFICIAL PERSONALITY</span>
        </div>
        <h2 className="font-fredoka text-5xl sm:text-6xl text-gray-800 tracking-tight">{result.personalityTitle}</h2>
        <div className="my-6 bg-white/70 p-4 rounded-xl border-2 border-dashed border-pink-400">
            <p className="text-2xl font-medium text-pink-500">{result.tagline}</p>
        </div>
        <div className="bg-white max-w-xl p-6 rounded-2xl border-2 border-black shadow-md mb-8">
            <p>{result.description}</p>
        </div>

        <div className="mb-8 flex items-center space-x-3">
             <div className="w-10 h-10 bg-[#90F1AC] rounded-full flex items-center justify-center border-2 border-black">
                <span className="text-2xl">💚</span>
             </div>
            <h3 className="font-fredoka text-3xl text-gray-800">Hobbies For You</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
            {result.hobbies.map((hobby, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col text-left">
                    <div className="flex items-start mb-3">
                        <div className="w-8 h-8 bg-[#84D2F6] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-black border-2 border-black mr-3">{index + 1}</div>
                        <div>
                            <h4 className="font-bold text-lg">{hobby.name}</h4>
                            <p className="text-sm text-gray-600">{hobby.description}</p>
                        </div>
                    </div>
                    <div className="mt-auto pt-3 border-t-2 border-dashed border-gray-200">
                        <p className="text-xs bg-yellow-100 p-2 rounded-lg border border-yellow-300"><span className="font-bold">Why?</span> {hobby.reason}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
                onClick={onPlayAgain}
                className="font-fredoka bg-gray-800 text-white text-lg px-8 py-3 rounded-xl border-2 border-black hover:bg-gray-700 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Play Again
            </button>
            <button
                onClick={onNavigateToCommunity}
                className="font-fredoka bg-[#90F1AC] text-black text-lg px-8 py-3 rounded-xl border-2 border-black hover:bg-[#7bce93] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 flex items-center"
            >
                Explore in Community
                <span className="ml-2">🌍</span>
            </button>
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

export default ResultsPage;