import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onStartOver: () => void;
  showStartOver: boolean;
  onNavigateToCommunity: () => void;
  onNavigateToProfile: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const Logo = ({ onStartOver }: { onStartOver: () => void }) => (
  <div onClick={onStartOver} className="cursor-pointer flex items-center space-x-2">
    <div className="w-8 h-8 bg-[#FF8FAB] rounded-lg flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    <h1 className="font-fredoka text-2xl tracking-tighter">
      Start<span className="text-[#FF8FAB]">Hobby</span>
    </h1>
  </div>
);

const Avatar: React.FC<{ avatar: string }> = ({ avatar }) => {
    const isUrl = avatar.startsWith('http');
    return (
        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg border-2 border-black cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden">
            {isUrl ? (
                <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
                <span>{avatar}</span>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onStartOver, showStartOver, onNavigateToCommunity, onNavigateToProfile, onBack, showBack }) => {
  return (
    <header className="w-full max-w-5xl mb-8">
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full border-2 border-black flex justify-between items-center shadow-md">
        <Logo onStartOver={onStartOver} />
        <div className="flex items-center gap-2">
          {showBack && onBack && (
             <button 
              onClick={onBack}
              className="font-fredoka bg-[#84D2F6] text-black text-sm px-4 py-2 rounded-full border-2 border-black hover:bg-[#6ab9d8] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-px active:translate-y-0"
            >
              ← Back
            </button>
          )}
          <button 
            onClick={onNavigateToCommunity}
            className="font-fredoka bg-[#FF8FAB] text-black text-sm px-4 py-2 rounded-full border-2 border-black hover:bg-[#e67a97] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-px active:translate-y-0"
          >
            Community Hub
          </button>
          {showStartOver && (
            <button 
              onClick={onStartOver}
              className="font-fredoka bg-[#84D2F6] text-black text-sm px-4 py-2 rounded-full border-2 border-black hover:bg-[#6ab9d8] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-px active:translate-y-0"
            >
              ← Start Over
            </button>
          )}
          {currentUser && (
            <div className="flex items-center gap-2">
              <button onClick={onNavigateToProfile}>
                <Avatar avatar={currentUser.avatar} />
              </button>
              <button onClick={onLogout} className="font-fredoka bg-gray-300 text-black text-sm px-4 py-2 rounded-full border-2 border-black hover:bg-gray-400 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-px active:translate-y-0">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;