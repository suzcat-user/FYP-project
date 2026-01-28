import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { GameStep, Trait, Scores, Hobby, PersonalityCode, PersonalityScores } from './types';
import { getHobbyRecommendations } from './services/hobbyRecommendations';
import WelcomeScreen from './components/WelcomeScreen';
import WouldYouRather from './components/WouldYouRather';
import RingToss from './components/RingToss';
import ShootingGallery from './components/ShootingGallery';
import ResultsScreen from './components/ResultsScreen';
import AllHobbiesScreen from './components/AllHobbiesScreen';
import CommunityScreen from './components/CommunityScreen';
import HobbyCommunity from './components/HobbyCommunity';
import AuthScreen from './components/AuthScreen';
import ProfileScreen from './components/ProfileScreen';
import PostPage from './components/PostPage';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [userName, setUserName] = useState<string>('Guest_Player');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userData, setUserData] = useState<{ user_id?: number; username?: string; score?: number } | null>(null);
  const [scores, setScores] = useState<Scores>({
    CREATIVE: 0,
    ACTIVE: 0,
    STRATEGIC: 0,
    CALM: 0,
    SOCIAL: 0,
    EXPLORER: 0
  });

  const [personalityScores, setPersonalityScores] = useState<PersonalityScores>({
    [PersonalityCode.F]: 0,
    [PersonalityCode.C]: 0,
    [PersonalityCode.N]: 0,
    [PersonalityCode.S]: 0,
    [PersonalityCode.L]: 0
  });

  const handleLogin = useCallback((username: string, email: string, user_id: number) => {
    const payload = { user_id, username, score: 0, email };
    setUserName(username);
    setUserEmail(email);
    setUserData(payload);
    localStorage.setItem('hobbyArcadeUser', JSON.stringify(payload));
    navigate('/home');
  }, [navigate]);

  useEffect(() => {
    const cached = localStorage.getItem('hobbyArcadeUser');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.user_id && parsed?.username) {
          setUserData(parsed);
          setUserName(parsed.username);
          setUserEmail(parsed.email || '');
        }
      } catch (err) {
        console.warn('Failed to restore cached user', err);
        localStorage.removeItem('hobbyArcadeUser');
      }
    }
  }, []);

  const handleNextGame = useCallback(() => {
    const currentPath = location.pathname;
    if (currentPath === '/auth') navigate('/home');
    else if (currentPath === '/home') navigate('/games/would-you-rather');
    else if (currentPath === '/games/would-you-rather') navigate('/games/ring-toss');
    else if (currentPath === '/games/ring-toss') navigate('/games/shooting-gallery');
    else if (currentPath === '/games/shooting-gallery') navigate('/results');
    else if (currentPath === '/results') navigate('/community');
    else if (currentPath === '/community') navigate('/home');
    else navigate('/home');
  }, [navigate, location.pathname]);

  const handleAnswer = useCallback((traits: Trait[], personalityCodes?: PersonalityCode[]) => {
    setScores(prevScores => {
      const newScores = { ...prevScores };
      traits.forEach(trait => {
        newScores[trait] = (newScores[trait] || 0) + 1; // Exactly +1 per trait
      });
      return newScores;
    });

    // Add personality scoring
    if (personalityCodes && personalityCodes.length > 0) {
      setPersonalityScores(prevScores => {
        const newScores = { ...prevScores };
        personalityCodes.forEach(code => {
          newScores[code] = (newScores[code] || 0) + 1; // Exactly +1 per code
        });
        return newScores;
      });
    }
  }, []);

  const handleGoToHobbyCommunity = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    navigate(`/community/${hobby.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleResetGame = useCallback(() => {
    // Reset all scores
    setScores({
      CREATIVE: 0,
      ACTIVE: 0,
      STRATEGIC: 0,
      CALM: 0,
      SOCIAL: 0,
      EXPLORER: 0
    });
    setPersonalityScores({
      [PersonalityCode.F]: 0,
      [PersonalityCode.C]: 0,
      [PersonalityCode.N]: 0,
      [PersonalityCode.S]: 0,
      [PersonalityCode.L]: 0
    });
    // Navigate back to home
    navigate('/home');
  }, [navigate]);

  const totalScore = useMemo(() => {
    const values = Object.values(scores) as number[];
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.floor(sum * 100);
  }, [scores]);

  const communityHobbies = useMemo(() => {
    return getHobbyRecommendations(personalityScores);
  }, [personalityScores]);

  const gameProgress = useMemo(() => {
    const path = location.pathname;
    if (path === '/games/would-you-rather') return 1;
    if (path === '/games/ring-toss') return 2;
    if (path === '/games/shooting-gallery') return 3;
    return 0;
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={`h-screen w-screen overflow-hidden flex items-center justify-center transition-colors duration-500 bg-[#000a18]`}>
      {/* Visual CRT Overlays (Non-flickering) */}
      <div className="absolute inset-0 pointer-events-none z-[100] bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.3)_100%)]"></div>
      
      {/* Main Cabinet Frame */}
      <div className={`w-[98vw] h-[96vh] relative flex flex-col border-[12px] border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.3)] transition-all duration-500 ${isDarkMode ? 'border-[#1e1b4b] shadow-purple-900/40' : 'border-[#0c4a6e]'}`}>
        
        {/* Hardware Bezel */}
        <div className="absolute inset-0 border-[4px] border-white/5 pointer-events-none z-50 rounded-2xl"></div>

        {/* HUD Top Bar */}
        <div className={`text-white flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:gap-6 font-press-start text-[9px] xs:text-[10px] sm:text-[11px] md:text-[1.3vmin] lg:text-[1.6vmin] z-50 relative px-3 sm:px-4 lg:px-6 py-2 sm:py-3 min-h-14 md:min-h-16 lg:min-h-20 border-b-8 shadow-2xl transition-colors duration-500 ${isDarkMode ? 'bg-[#1e1b4b] border-indigo-500/30' : 'bg-sky-950 border-sky-400/30'}`}>
             {/* Left Section - Logo, User ID, Score */}
             <div className="flex gap-2 sm:gap-3 lg:gap-6 items-center flex-shrink-0">
                 {/* Logo - Clickable Home Button (disabled on Auth screen) */}
                 <button
                    onClick={() => !isAuthPage && navigate('/home')}
                    disabled={isAuthPage}
                    className={`${!isAuthPage ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-300 flex-shrink-0`}
                    title={!isAuthPage ? "Return to Home" : ""}
                 >
                    <img src="/components/Logos-02.png" alt="Hobby Arcade Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain drop-shadow-lg" />
                 </button>
                 
                 {/* User ID */}
                 {!isAuthPage && (
                   <button onClick={() => navigate('/profile')} className="hidden sm:flex flex-col items-center group hover:scale-105 transition-transform whitespace-nowrap">
                      <span className="text-rose-500 animate-pulse drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">1UP</span>
                      <span className="text-sky-300 truncate max-w-[100px]">{userName}</span>
                   </button>
                 )}
                 
                 {/* Score */}
                 <div className="hidden sm:flex flex-col">
                    <span className="text-sky-500/50 text-[8px] sm:text-[9px] md:text-[1vmin]">SCORE</span>
                    <span className="text-sky-100 font-press-start">{totalScore.toString().padStart(6, '0')}</span>
                 </div>
             </div>

             <div className="flex flex-col items-center order-3 lg:order-2 flex-1 w-full lg:w-auto min-w-0">
                <div className="text-yellow-400 chromatic tracking-wide lg:tracking-widest uppercase mb-1 text-[11px] sm:text-[13px] md:text-[2vmin]">HOBBY ARCADE</div>
                <div className="h-0.5 sm:h-1 w-24 sm:w-32 bg-sky-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-sky-400 animate-[marquee_2s_linear_infinite]"></div>
                </div>
             </div>

             <div className="flex gap-2 sm:gap-3 lg:gap-8 items-center order-2 lg:order-3 flex-shrink-0">
                 {/* See All Communities Button - Hidden on Auth screen */}
                 {!isAuthPage && (
                   <button 
                     onClick={() => navigate('/all-hobbies')}
                     className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border-2 text-[9px] sm:text-[10px] md:text-[1.2vmin] transition-all hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 ${isDarkMode ? 'border-green-500 bg-green-500/20 text-green-300' : 'border-green-500 bg-green-500/20 text-green-400'}`}
                     title="See All Communities"
                   >
                     <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-green-300' : 'bg-green-400'}`}></div>
                     <span className="hidden sm:inline">COMMUNITIES</span>
                     <span className="sm:hidden">🏘️</span>
                   </button>
                 )}

                 <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border-2 text-[9px] sm:text-[10px] md:text-[1.2vmin] transition-all hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 ${isDarkMode ? 'border-purple-500 bg-purple-500/20 text-purple-400' : 'border-sky-400 bg-sky-400/20 text-sky-300'}`}
                 >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-purple-400' : 'bg-sky-400'}`}></div>
                    <span className="hidden sm:inline">{isDarkMode ? 'POWER: DARK' : 'POWER: LIGHT'}</span>
                    <span className="sm:hidden">{isDarkMode ? 'DARK' : 'LIGHT'}</span>
                 </button>

                 {/* Log Out Button - Hidden on Auth screen */}
                  {!isAuthPage && (
                   <button 
                     onClick={() => {
                      setUserData(null);
                      setUserName('Guest_Player');
                      setUserEmail('');
                      localStorage.removeItem('hobbyArcadeUser');
                      navigate('/auth');
                     }}
                     className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border-2 text-[9px] sm:text-[10px] md:text-[1.2vmin] transition-all hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 ${isDarkMode ? 'border-red-600 bg-red-600/20 text-red-300' : 'border-red-500 bg-red-500/20 text-red-400'}`}
                     title="Log Out"
                   >
                     <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isDarkMode ? 'bg-red-300' : 'bg-red-400'}`}></div>
                     <span className="hidden sm:inline">LOG OUT</span>
                     <span className="sm:hidden">OUT</span>
                   </button>
                  )}

                 <div className="hidden md:flex flex-col items-end text-right">
                     <span className="text-sky-500/50 text-[8px] sm:text-[9px] md:text-[1vmin]">CREDITS</span>
                     <span className="text-white neon-glow-blue text-[10px] sm:text-[11px] md:text-[1.2vmin]">FREE PLAY</span>
                 </div>
             </div>
        </div>

        {/* Screen Content */}
        <div className={`flex-1 w-full h-full overflow-hidden relative crt-bloom transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
           <Routes>
             <Route path="/" element={<Navigate to="/auth" replace />} />
             <Route path="/auth" element={<AuthScreen onLogin={handleLogin} isDarkMode={isDarkMode} />} />
             <Route path="/home" element={<WelcomeScreen onStart={handleNextGame} isDarkMode={isDarkMode} />} />
             <Route path="/games/would-you-rather" element={<WouldYouRather onAnswer={handleAnswer} onGameEnd={handleNextGame} onSkip={handleNextGame} isDarkMode={isDarkMode} progress={gameProgress} userId={userData?.user_id} />} />
             <Route path="/games/ring-toss" element={<RingToss onAnswer={handleAnswer} onGameEnd={handleNextGame} onSkip={handleNextGame} isDarkMode={isDarkMode} progress={gameProgress} userId={userData?.user_id} />} />
             <Route path="/games/shooting-gallery" element={<ShootingGallery onAnswer={handleAnswer} onGameEnd={handleNextGame} onSkip={handleNextGame} isDarkMode={isDarkMode} progress={gameProgress} userId={userData?.user_id} />} />
             <Route path="/results" element={<ResultsScreen scores={scores} personalityScores={personalityScores} onNext={handleNextGame} onSelectHobby={handleGoToHobbyCommunity} onReset={handleResetGame} isDarkMode={isDarkMode} />} />
             <Route path="/all-hobbies" element={<AllHobbiesScreen onSelectHobby={handleGoToHobbyCommunity} isDarkMode={isDarkMode} />} />
             <Route path="/community" element={<CommunityScreen onRestart={handleNextGame} scores={scores} hobbies={communityHobbies} onSelectHobby={handleGoToHobbyCommunity} isDarkMode={isDarkMode} userId={userData?.user_id} />} />
             <Route path="/community/:hobbyName" element={<HobbyCommunity hobby={selectedHobby} onBack={() => navigate('/results')} isDarkMode={isDarkMode} currentUser={userData?.username || "GUEST"} userId={userData?.user_id} />} />
             <Route path="/posts/:postId" element={<PostPage isDarkMode={isDarkMode} currentUser={userData?.username || "GUEST"} userId={userData?.user_id} />} />
             <Route path="/profile" element={<ProfileScreen scores={scores} userName={userName} userEmail={userEmail} onBack={() => navigate('/home')} isDarkMode={isDarkMode} />} />
           </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;