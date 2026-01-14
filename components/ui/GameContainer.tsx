import React from 'react';

interface GameContainerProps {
  title: string;
  instruction: string;
  transparent?: boolean;
  children: React.ReactNode;
  onSkip?: () => void;
  onRegenerate?: () => void;
  isDarkMode?: boolean;
  progress?: number; // 0 to 3
  howToPlay?: string;
  scoringRules?: string;
}

const GameContainer: React.FC<GameContainerProps> = ({ 
  title, 
  instruction, 
  transparent = false, 
  children, 
  onSkip, 
  onRegenerate, 
  isDarkMode = false,
  progress = 0,
  howToPlay,
  scoringRules
}) => {
  return (
    <div className={`w-full h-full flex flex-col overflow-y-auto overflow-x-hidden relative transition-colors duration-500 ${transparent ? '' : isDarkMode ? 'bg-slate-950' : 'bg-[#e0f2fe]'}`}>
      
      {/* Header Area (Sticky) */}
      <div className={`text-center py-4 shrink-0 z-40 sticky top-0 transition-colors duration-500 ${transparent ? (isDarkMode ? 'bg-indigo-950/90' : 'bg-sky-900/80') + ' backdrop-blur-md border-b-4 border-white/20' : isDarkMode ? 'bg-slate-900 border-b-4 border-indigo-900' : 'bg-white border-b-4 border-sky-900'}`}>
        
        {/* Progress Bar */}
        {progress > 0 && (
            <div className="w-full max-w-md px-4 mb-2 mx-auto flex flex-col items-center">
                <div className="flex w-full justify-between items-center mb-1 font-press-start text-[0.8vmin]">
                    <span className={isDarkMode ? 'text-indigo-400' : 'text-sky-800'}>QUEST PROGRESS</span>
                    <span className={isDarkMode ? 'text-pink-500' : 'text-sky-950'}>LEVEL {progress}/3</span>
                </div>
                <div className={`w-full h-3 flex gap-1 p-[2px] border-2 ${isDarkMode ? 'bg-slate-950 border-indigo-900' : 'bg-gray-100 border-sky-900'}`}>
                    {[1, 2, 3].map(step => (
                        <div 
                            key={step} 
                            className={`flex-1 transition-all duration-500 ${
                                step <= progress 
                                ? (isDarkMode ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'bg-sky-500 shadow-[0_0_5px_#0ea5e9]')
                                : 'bg-transparent'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
        )}

        {/* Main Centered Content */}
        <div className="w-full relative px-4 max-w-4xl mx-auto flex flex-col items-center">
             <h1 className={`font-press-start text-[3vmin] md:text-[4vmin] tracking-widest uppercase transition-colors duration-500 ${isDarkMode ? 'text-pink-500 drop-shadow-[2px_2px_0px_#1e1b4b]' : 'text-sky-600 drop-shadow-[2px_2px_0px_#bae6fd]'}`}>{title}</h1>
             
             <div className="flex items-center justify-center gap-4 mt-1">
                 <p className={`font-vt323 text-[3vmin] leading-none transition-colors duration-500 ${transparent ? 'text-white drop-shadow-md' : isDarkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
                    {instruction}
                 </p>
                 {onRegenerate && (
                     <button 
                        onClick={onRegenerate}
                        title="New Question"
                        className={`p-2 rounded-md border-2 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all group ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-950' : 'bg-sky-400 hover:bg-sky-500 border-sky-800'}`}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[2.5vmin] h-[2.5vmin] group-hover:rotate-180 transition-transform duration-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                     </button>
                 )}
             </div>
        </div>

        {/* Desktop Skip Button */}
        {onSkip && (
             <button 
                onClick={onSkip}
                className={`absolute right-6 top-1/2 -translate-y-1/2 font-press-start text-[1.2vmin] px-4 py-2 border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 transition-all flex items-center gap-2 ${isDarkMode ? 'bg-pink-600 text-white border-pink-900 shadow-md shadow-pink-900/40' : 'bg-yellow-400 text-sky-900 border-sky-900'}`}
             >
                SKIP <span className="text-[1.5vmin]">»</span>
             </button>
         )}
      </div>

      {/* Game Content Area */}
      <div className="shrink-0 w-full h-[65vh] flex flex-col justify-center relative z-0 p-4 md:p-6">
        <div className={`w-full h-full flex flex-col justify-center relative rounded-xl overflow-hidden border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-900 shadow-indigo-950' : 'bg-white border-sky-900'}`}>
            {children}
        </div>
      </div>

      {/* Manual / Instructions Section */}
      <div className={`w-full p-10 md:p-20 border-t-8 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-indigo-900' : 'bg-white border-sky-100'}`}>
          <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-10">
                  <div className={`h-1 flex-1 ${isDarkMode ? 'bg-indigo-800' : 'bg-sky-200'}`}></div>
                  <h3 className={`font-press-start text-[2vmin] ${isDarkMode ? 'text-pink-400' : 'text-sky-800'}`}>OPERATOR_MANUAL.pdf</h3>
                  <div className={`h-1 flex-1 ${isDarkMode ? 'bg-indigo-800' : 'bg-sky-200'}`}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className={`space-y-6 p-8 border-4 ${isDarkMode ? 'bg-slate-950/50 border-indigo-500 shadow-[10px_10px_0px_rgba(236,72,153,0.1)]' : 'bg-sky-50 border-sky-800 shadow-[10px_10px_0px_rgba(14,165,233,0.1)]'}`}>
                      <h4 className="font-press-start text-[1.5vmin] text-yellow-500 uppercase">How to Play</h4>
                      <p className={`font-vt323 text-[3vmin] leading-snug ${isDarkMode ? 'text-indigo-100' : 'text-gray-700'}`}>
                          {howToPlay || "Follow the on-screen prompts and make your selection before the time runs out. Your choices directly influence your final personality archetype and hobby matches."}
                      </p>
                  </div>

                  <div className={`space-y-6 p-8 border-4 ${isDarkMode ? 'bg-slate-950/50 border-pink-500 shadow-[10px_10px_0px_rgba(99,102,241,0.1)]' : 'bg-white border-sky-800 shadow-[10px_10px_0px_rgba(14,165,233,0.1)]'}`}>
                      <h4 className="font-press-start text-[1.5vmin] text-cyan-500 uppercase">Scoring Logic</h4>
                      <p className={`font-vt323 text-[3vmin] leading-snug ${isDarkMode ? 'text-indigo-100' : 'text-gray-700'}`}>
                          {scoringRules || "Each successful action grants XP toward one of the 6 core traits. A 'Perfect' score is achieved by answering honestly and quickly. Your final rank is determined by total XP accumulation across all 3 levels."}
                      </p>
                  </div>
              </div>

              <div className="mt-20 text-center opacity-30">
                  <span className="font-press-start text-[1vmin] uppercase tracking-widest italic">
                      Property of Hobby Arcade Corp. © 1994 • No Unauthorized Distribution
                  </span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default GameContainer;