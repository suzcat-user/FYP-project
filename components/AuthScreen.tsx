
import React, { useState } from 'react';
import ArcadeButton from './ui/ArcadeButton';

interface AuthScreenProps {
  onLogin: () => void;
  isDarkMode?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isDarkMode = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
        onLogin();
    }, 500);
  };

  return (
    <div className={`h-full w-full flex items-center justify-center relative overflow-y-auto transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-sky-50'}`}>
       {/* Background Decor */}
      <div className={`absolute top-[5%] right-[10%] w-[8vmin] h-[8vmin] rounded-full blur-xl opacity-60 transition-colors ${isDarkMode ? 'bg-pink-600' : 'bg-yellow-300'}`}></div>
      <div className={`absolute bottom-[10%] left-[5%] w-[12vmin] h-[12vmin] border-4 transform rotate-12 opacity-40 transition-colors ${isDarkMode ? 'border-indigo-500' : 'border-sky-300'}`}></div>

      <div className={`backdrop-blur-md p-[4vmin] rounded-xl border-8 shadow-[10px_10px_0px_0px] w-[90%] max-w-[600px] flex flex-col relative z-10 my-4 transition-all duration-500 ${isDarkMode ? 'bg-slate-950/90 border-indigo-700 shadow-indigo-950' : 'bg-white/90 border-sky-900 shadow-[#0ea5e9]'}`}>
        
        {/* Header Tabs */}
        <div className={`flex w-full mb-[4vmin] border-b-4 transition-colors ${isDarkMode ? 'border-indigo-900' : 'border-gray-200'}`}>
            <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 font-press-start text-[2vmin] py-4 transition-colors ${isLogin ? (isDarkMode ? 'text-pink-400 border-b-4 border-pink-400 -mb-[4px]' : 'text-sky-600 border-b-4 border-sky-600 -mb-[4px]') : 'text-gray-400 hover:text-gray-600'}`}
            >
                LOGIN
            </button>
            <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 font-press-start text-[2vmin] py-4 transition-colors ${!isLogin ? (isDarkMode ? 'text-pink-400 border-b-4 border-pink-400 -mb-[4px]' : 'text-sky-600 border-b-4 border-sky-600 -mb-[4px]') : 'text-gray-400 hover:text-gray-600'}`}
            >
                SIGN UP
            </button>
        </div>

        <h2 className={`font-press-start text-[2.5vmin] text-center mb-[4vmin] transition-colors ${isDarkMode ? 'text-indigo-100' : 'text-gray-800'}`}>
            {isLogin ? 'INSERT CREDENTIALS' : 'NEW PLAYER ENTRY'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[3vmin]">
            <div>
                <label className={`font-press-start text-[1.5vmin] mb-2 block transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-600'}`}>EMAIL</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full font-vt323 text-[3vmin] p-[1.5vmin] border-4 outline-none shadow-inner transition-colors ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-sky-500'}`}
                    placeholder="player@example.com"
                />
            </div>
            <div>
                <label className={`font-press-start text-[1.5vmin] mb-2 block transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-600'}`}>PASSWORD</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full font-vt323 text-[3vmin] p-[1.5vmin] border-4 outline-none shadow-inner transition-colors ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-sky-500'}`}
                    placeholder="********"
                />
            </div>

            <ArcadeButton type="submit" className={`w-full mt-[2vmin] text-[2vmin] transition-all ${isDarkMode ? 'bg-pink-600 text-white border-indigo-900 shadow-indigo-900 hover:bg-pink-500' : ''}`}>
                {isLogin ? 'START GAME' : 'REGISTER'}
            </ArcadeButton>
        </form>

        <div className="relative flex py-[4vmin] items-center">
            <div className={`flex-grow border-t-2 transition-colors ${isDarkMode ? 'border-indigo-900' : 'border-gray-300'}`}></div>
            <span className={`flex-shrink-0 mx-4 font-press-start text-[1.2vmin] transition-colors ${isDarkMode ? 'text-indigo-500' : 'text-gray-400'}`}>OR CONNECT WITH</span>
            <div className={`flex-grow border-t-2 transition-colors ${isDarkMode ? 'border-indigo-900' : 'border-gray-300'}`}></div>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-[2vmin]">
            <button 
                type="button"
                onClick={onLogin}
                className={`group relative w-full py-[1.5vmin] px-4 border-4 transition-all flex items-center justify-center gap-[2vmin] ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-indigo-100 shadow-[4px_4px_0px_0px_#db2777] hover:shadow-[2px_2px_0px_0px_#db2777]' : 'bg-white border-gray-800 text-gray-700 shadow-[4px_4px_0px_0px_#ea4335] hover:shadow-[2px_2px_0px_0px_#ea4335]'} hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`}
            >
                 <svg className="w-[3vmin] h-[3vmin]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-press-start text-[1.5vmin] group-hover:opacity-80">GOOGLE</span>
            </button>
        </div>
        
        {/* Footer */}
        <p className={`mt-[4vmin] text-center font-vt323 text-[2.5vmin] transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>
             BY STARTING, YOU AGREE TO OUR <span className={`underline cursor-pointer transition-colors ${isDarkMode ? 'text-pink-400 hover:text-pink-300' : 'text-sky-600 hover:text-sky-800'}`}>TOS</span>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
