import React, { useState, useCallback, useMemo } from 'react';
import { GameStep, Trait, Scores, Hobby } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import WouldYouRather from './components/WouldYouRather';
import RingToss from './components/RingToss';
import ShootingGallery from './components/ShootingGallery';
import ResultsScreen from './components/ResultsScreen';
import CommunityScreen from './components/CommunityScreen';
import HobbyCommunity from './components/HobbyCommunity';
import AuthScreen from './components/AuthScreen';
import ProfileScreen from './components/ProfileScreen';

const App: React.FC = () => {
  const [gameStep, setGameStep] = useState<GameStep>(GameStep.Auth);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [userName, setUserName] = useState<string>('Guest_Player');
  const [userEmail, setUserEmail] = useState<string>('');
  const [scores, setScores] = useState<Scores>({
    CREATIVE: 0,
    ACTIVE: 0,
    STRATEGIC: 0,
    CALM: 0,
    SOCIAL: 0,
    EXPLORER: 0
  });

  const handleLogin = useCallback((username: string, email: string) => {
    setUserName(username);
    setUserEmail(email);
    setGameStep(GameStep.Welcome);
  }, []);

  const handleNextGame = useCallback(() => {
    setGameStep(prevStep => {
      switch (prevStep) {
        case GameStep.Auth: return GameStep.Welcome;
        case GameStep.Welcome: return GameStep.WouldYouRather;
        case GameStep.WouldYouRather: return GameStep.RingToss;
        case GameStep.RingToss: return GameStep.ShootingGallery;
        case GameStep.ShootingGallery: return GameStep.Results;
        case GameStep.Results: return GameStep.Community;
        case GameStep.Community: return GameStep.Welcome;
        default: return prevStep;
      }
    });
  }, []);

  const handleAnswer = useCallback((traits: Trait[]) => {
    setScores(prevScores => {
      const newScores = { ...prevScores };
      traits.forEach(trait => {
        const randomBonus = Math.random() * 0.75;
        newScores[trait] = (newScores[trait] || 0) + (1 + randomBonus);
      });
      return newScores;
    });
  }, []);

  const handleGoToHobbyCommunity = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setGameStep(GameStep.HobbyCommunity);
  };

  const totalScore = useMemo(() => {
    const values = Object.values(scores) as number[];
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.floor(sum * 100);
  }, [scores]);

  const gameProgress = useMemo(() => {
    switch (gameStep) {
      case GameStep.WouldYouRather: return 1;
      case GameStep.RingToss: return 2;
      case GameStep.ShootingGallery: return 3;
      default: return 0;
    }
  }, [gameStep]);

  const renderGameStep = () => {
    switch (gameStep) {
      case GameStep.Auth:
        return <AuthScreen onLogin={handleLogin} isDarkMode={isDarkMode} />;
      case GameStep.Welcome:
        return <WelcomeScreen onStart={handleNextGame} isDarkMode={isDarkMode} />;
      case GameStep.WouldYouRather:
        return <WouldYouRather onAnswer={handleAnswer} onGameEnd={handleNextGame} onSkip={handleNextGame} isDarkMode={isDarkMode} progress={gameProgress} />;
      case GameStep.RingToss:
        return <RingToss onAnswer={handleAnswer} onGameEnd={handleNextGame} onSkip={handleNextGame} isDarkMode={isDarkMode} progress={gameProgress} />;
      case GameStep.ShootingGallery:
        return <ShootingGallery onAnswer={handleAnswer} onGameEnd={handleNextGame} onSkip={handleNextGame} isDarkMode={isDarkMode} progress={gameProgress} />;
      case GameStep.Results:
        return <ResultsScreen scores={scores} onNext={handleNextGame} onSelectHobby={handleGoToHobbyCommunity} isDarkMode={isDarkMode} />;
      case GameStep.Community:
        return <CommunityScreen onRestart={handleNextGame} scores={scores} isDarkMode={isDarkMode} />;
      case GameStep.HobbyCommunity:
        return <HobbyCommunity hobby={selectedHobby} onBack={() => setGameStep(GameStep.Results)} isDarkMode={isDarkMode} currentUser="USER_ID" />;
      case GameStep.Profile:
        return <ProfileScreen scores={scores} userName={userName} userEmail={userEmail} onBack={() => setGameStep(GameStep.Welcome)} isDarkMode={isDarkMode} />;
      default:
        return <WelcomeScreen onStart={handleNextGame} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex items-center justify-center transition-colors duration-500 bg-[#000a18]`}>
      {/* Visual CRT Overlays (Non-flickering) */}
      <div className="absolute inset-0 pointer-events-none z-[100] bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.3)_100%)]"></div>
      
      {/* Main Cabinet Frame */}
      <div className={`w-[98vw] h-[96vh] relative flex flex-col border-[12px] border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.3)] transition-all duration-500 ${isDarkMode ? 'border-[#1e1b4b] shadow-purple-900/40' : 'border-[#0c4a6e]'}`}>
        
        {/* Hardware Bezel */}
        <div className="absolute inset-0 border-[4px] border-white/5 pointer-events-none z-50 rounded-2xl"></div>

        {/* HUD Top Bar */}
        <div className={`h-16 md:h-20 text-white flex justify-between items-center font-press-start text-[1.2vmin] md:text-[1.6vmin] z-50 relative px-6 border-b-8 shadow-2xl transition-colors duration-500 ${isDarkMode ? 'bg-[#1e1b4b] border-indigo-500/30' : 'bg-sky-950 border-sky-400/30'}`}>
             {/* Left Section - Logo, User ID, Score */}
             <div className="flex gap-6 items-center">
                 {/* Logo - Clickable Home Button (disabled on Auth screen) */}
                 <button
                    onClick={() => gameStep !== GameStep.Auth && setGameStep(GameStep.Welcome)}
                    disabled={gameStep === GameStep.Auth}
                    className={`${gameStep !== GameStep.Auth ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-300`}
                    title={gameStep !== GameStep.Auth ? "Return to Home" : ""}
                 >
                    <img src="components/Logos-02.png" alt="Hobby Arcade Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg" />
                 </button>
                 
                 {/* User ID */}
                 {gameStep !== GameStep.Auth && (
                   <button onClick={() => setGameStep(GameStep.Profile)} className="flex flex-col items-center group hover:scale-105 transition-transform">
                      <span className="text-rose-500 animate-pulse drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">1UP</span>
                      <span className="text-sky-300">{userName}</span>
                   </button>
                 )}
                 
                 {/* Score */}
                 <div className="flex flex-col">
                    <span className="text-sky-500/50 text-[1vmin]">SCORE</span>
                    <span className="text-sky-100 font-press-start">{totalScore.toString().padStart(6, '0')}</span>
                 </div>
             </div>

             <div className="flex flex-col items-center">
                <div className="text-yellow-400 chromatic tracking-widest uppercase mb-1">HOBBY ARCADE</div>
                <div className="h-1 w-32 bg-sky-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-sky-400 animate-[marquee_2s_linear_infinite]"></div>
                </div>
             </div>

             <div className="flex gap-8 items-center">
                 <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`px-4 py-2 border-2 text-[1.2vmin] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${isDarkMode ? 'border-purple-500 bg-purple-500/20 text-purple-400' : 'border-sky-400 bg-sky-400/20 text-sky-300'}`}
                 >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-purple-400' : 'bg-sky-400'}`}></div>
                    {isDarkMode ? 'POWER: DARK' : 'POWER: LIGHT'}
                 </button>

                 {/* Log Out Button - Hidden on Auth screen */}
                 {gameStep !== GameStep.Auth && (
                   <button 
                      onClick={() => setGameStep(GameStep.Auth)}
                      className={`px-4 py-2 border-2 text-[1.2vmin] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${isDarkMode ? 'border-red-600 bg-red-600/20 text-red-300' : 'border-red-500 bg-red-500/20 text-red-400'}`}
                      title="Log Out"
                   >
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-red-300' : 'bg-red-400'}`}></div>
                      LOG OUT
                   </button>
                 )}

                 <div className="flex flex-col items-end">
                     <span className="text-sky-500/50 text-[1vmin]">CREDITS</span>
                     <span className="text-white neon-glow-blue">FREE PLAY</span>
                 </div>
             </div>
        </div>

        {/* Screen Content */}
        <div className={`flex-1 w-full h-full overflow-hidden relative crt-bloom transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
           {renderGameStep()}
        </div>
      </div>
    </div>
  );
};

export default App;