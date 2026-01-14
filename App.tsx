import React, { useState, useCallback } from 'react';
import { GameState, PersonalityResult, CommunityData, Post, Reply, User } from './types';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import WouldYouRatherGame from './components/WouldYouRatherGame';
import ShootingGame from './components/ShootingGame';
import RingTossGame from './components/RingTossGame';
import ResultsPage from './components/ResultsPage';
import CommunityPage from './components/CommunityPage';
import CommunityThread from './components/CommunityThread';
import { getPersonalityAndHobbies } from './services/geminiService';
import { initialCommunityData } from './components/communityData';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import EventsPage from './components/EventsPage';


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Landing);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [communities, setCommunities] = useState<CommunityData>(initialCommunityData);
  const [participatedEventIds, setParticipatedEventIds] = useState<string[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setGameState(GameState.Landing);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleReset();
  };

  const handleStart = () => {
    setGameState(GameState.WouldYouRather);
    setSelections([]);
    setResult(null);
    setError(null);
  };
  
  const handleReset = () => {
    setGameState(GameState.Landing);
    setSelections([]);
    setResult(null);
    setError(null);
    setSelectedCommunity(null);
  };

  const handleNavigateToCommunity = () => {
    setGameState(GameState.Community);
  };

  const handleNavigateToProfile = () => {
    setGameState(GameState.Profile);
  };
  
  const handleNavigateToEvents = (communityName: string) => {
    setSelectedCommunity(communityName);
    setGameState(GameState.Events);
  };

  const handleJoinEvent = (eventId: string) => {
    setParticipatedEventIds(prev => [...prev, eventId]);
    alert("Great! The event organizer will contact you with details soon.");
  };

  const handleBackToCommunityHub = () => {
    setGameState(GameState.Community);
    setSelectedCommunity(null);
  }

  const handleBack = () => {
    if (gameState === GameState.CommunityThread) {
        handleBackToCommunityHub();
    } else if (gameState === GameState.Profile) {
        handleReset();
    } else if (gameState === GameState.Events) {
        setGameState(GameState.CommunityThread);
    }
  };

  const handleSelectCommunity = (community: string) => {
    setSelectedCommunity(community);
    setGameState(GameState.CommunityThread);
  };

  const handleWouldYouRatherComplete = (answers: string[]) => {
    setSelections(prev => [...prev, ...answers]);
    setGameState(GameState.Shooting);
  };

  const handleShootingComplete = (answers: string[]) => {
    setSelections(prev => [...prev, ...answers]);
    setGameState(GameState.RingToss);
  };

  const handleShootingBack = () => {
    setGameState(GameState.WouldYouRather);
  };

  const handleRingTossBack = () => {
    setGameState(GameState.Shooting);
  };
  
  const handleRingTossComplete = useCallback(async (answers: string[]) => {
    const finalSelections = [...selections, ...answers];
    setSelections(finalSelections);
    setGameState(GameState.Loading);
    try {
      const personalityResult = await getPersonalityAndHobbies(finalSelections);
      setResult(personalityResult);
      setError(null);
      // Add discovered hobbies to user profile
      if (currentUser && personalityResult.hobbies) {
        const hobbyNames = personalityResult.hobbies.map(h => h.name);
        setCurrentUser(prevUser => {
          if (!prevUser) return null;
          const newHobbies = [...new Set([...prevUser.hobbies, ...hobbyNames])];
          return { ...prevUser, hobbies: newHobbies };
        });
      }
    } catch (e) {
      console.error(e);
      setError('We couldn’t quite find the map to your personality this time, but that just means you’re uncharted territory!');
      setResult({
        personalityTitle: "The Mystery Explorer",
        tagline: "\"Adventure is out there!\"",
        description: "We couldn’t quite find the map to your personality this time, but that just means you’re uncharted territory!",
        hobbies: [
            { name: "Scavenger Hunt", description: "Create your own adventure!", reason: "Why? You are full of surprises." }
        ]
      });
    } finally {
      setGameState(GameState.Results);
    }
  }, [selections, currentUser]);

  const handleUpdateUserDescription = (description: string) => {
    if (!currentUser) return;
    setCurrentUser(prevUser => prevUser ? { ...prevUser, description } : null);
  };

  const handleUpdateUserAvatar = (avatar: string) => {
    if (!currentUser) return;
    setCurrentUser(prevUser => prevUser ? { ...prevUser, avatar } : null);
  };

  const handleAddPost = (communityName: string, post: Omit<Post, 'id' | 'replies' | 'author' | 'avatar'>) => {
    if (!currentUser) return;
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      author: currentUser.username,
      avatar: currentUser.avatar,
      replies: [],
    };
    setCommunities(prev => ({
      ...prev,
      [communityName]: {
        ...prev[communityName],
        posts: [newPost, ...prev[communityName].posts],
      },
    }));
  };

  const handleAddReply = (communityName: string, postId: string, reply: Omit<Reply, 'id' | 'author' | 'avatar'>) => {
    if (!currentUser) return;
    const newReply: Reply = {
      ...reply,
      id: Date.now().toString(),
      author: currentUser.username,
      avatar: currentUser.avatar,
    };
    setCommunities(prev => {
        const updatedPosts = prev[communityName].posts.map(p => {
            if (p.id === postId) {
                return { ...p, replies: [...p.replies, newReply] };
            }
            return p;
        });
        return {
            ...prev,
            [communityName]: {
                ...prev[communityName],
                posts: updatedPosts,
            },
        };
    });
  };

  const handleDeletePost = (communityName: string, postId: string) => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        setCommunities(prev => ({
            ...prev,
            [communityName]: {
                ...prev[communityName],
                posts: prev[communityName].posts.filter(p => p.id !== postId),
            },
        }));
      }
  };

  const handleDeleteReply = (communityName: string, postId: string, replyId: string) => {
       if (window.confirm("Are you sure you want to delete this reply?")) {
          setCommunities(prev => {
              const updatedPosts = prev[communityName].posts.map(p => {
                  if (p.id === postId) {
                      return { ...p, replies: p.replies.filter(r => r.id !== replyId) };
                  }
                  return p;
              });
              return {
                  ...prev,
                  [communityName]: {
                      ...prev[communityName],
                      posts: updatedPosts,
                  },
              };
          });
       }
  };

  const renderContent = () => {
    switch(gameState) {
      case GameState.Landing:
        return <LandingPage onStart={handleStart} />;
      case GameState.WouldYouRather:
        return <WouldYouRatherGame onComplete={handleWouldYouRatherComplete} />;
      case GameState.Shooting:
        return <ShootingGame onComplete={handleShootingComplete} onBack={handleShootingBack} />;
      case GameState.RingToss:
        return <RingTossGame onComplete={handleRingTossComplete} onBack={handleRingTossBack} />;
      case GameState.Loading:
      case GameState.Results:
        return <ResultsPage result={result} isLoading={gameState === GameState.Loading} error={error} onPlayAgain={handleReset} onNavigateToCommunity={handleNavigateToCommunity} />;
      case GameState.Community:
        return <CommunityPage onSelectCommunity={handleSelectCommunity} />;
      case GameState.CommunityThread:
        return selectedCommunity && currentUser ? (
            <CommunityThread 
                currentUser={currentUser}
                communityName={selectedCommunity} 
                community={communities[selectedCommunity]}
                onAddPost={handleAddPost}
                onAddReply={handleAddReply}
                onDeletePost={handleDeletePost}
                onDeleteReply={handleDeleteReply}
                onNavigateToEvents={handleNavigateToEvents}
            />
        ) : <CommunityPage onSelectCommunity={handleSelectCommunity} />;
      case GameState.Profile:
        return currentUser ? (
            <ProfilePage user={currentUser} onUpdateDescription={handleUpdateUserDescription} onUpdateAvatar={handleUpdateUserAvatar}/>
        ) : <LandingPage onStart={handleStart} />;
      case GameState.Events:
        return selectedCommunity && communities[selectedCommunity] ? (
            <EventsPage
                communityName={selectedCommunity}
                community={communities[selectedCommunity]}
                onJoinEvent={handleJoinEvent}
                participatedEventIds={participatedEventIds}
            />
        ) : <CommunityPage onSelectCommunity={handleSelectCommunity} />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  if (!currentUser) {
    return (
       <div className="bg-[#FEF6E4] min-h-screen text-[#333] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          <AuthPage onLoginSuccess={handleLogin} />
       </div>
    )
  }

  const isCommunitySection = gameState === GameState.Community || gameState === GameState.CommunityThread || gameState === GameState.Events;
  const showBack = gameState === GameState.CommunityThread || gameState === GameState.Profile || gameState === GameState.Events;

  return (
    <div className="bg-[#FEF6E4] min-h-screen text-[#333] flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onStartOver={handleReset} 
        onNavigateToCommunity={handleNavigateToCommunity}
        onNavigateToProfile={handleNavigateToProfile}
        showStartOver={!isCommunitySection && gameState !== GameState.Landing && gameState !== GameState.Profile} 
        onBack={handleBack}
        showBack={showBack}
      />
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;