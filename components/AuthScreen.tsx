
import React, { useState } from 'react';
import ArcadeButton from './ui/ArcadeButton';

interface AuthScreenProps {
  onLogin: (username: string, email: string, user_id: number) => void;
  isDarkMode?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isDarkMode = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim() || null,
          password
        })
      });

      const data = await response.json();

      if (data.success && data.user) {
        onLogin(data.user.username, data.user.email || email, data.user.user_id);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-full w-full flex items-center justify-center relative overflow-y-auto overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-sky-50'}`}>
       {/* Background Decor */}
      
      <div className={`absolute bottom-[10%] left-[5%] w-[12vmin] h-[12vmin] border-4 transform rotate-12 opacity-40 transition-colors ${isDarkMode ? 'border-indigo-500' : 'border-sky-300'}`}></div>

      <div className={`backdrop-blur-md px-2 sm:px-3 md:px-5 py-3 sm:py-5 md:py-6 rounded-xl border-3 sm:border-4 md:border-5 shadow-[2.5px_2.5px_0px_0px] sm:shadow-[4px_4px_0px_0px] md:shadow-[6px_6px_0px_0px] w-[95%] sm:w-[90%] max-w-[550px] flex flex-col relative z-10 my-4 sm:my-6 md:my-8 transition-all duration-500 ${isDarkMode ? 'bg-slate-950/90 border-indigo-700 shadow-indigo-950' : 'bg-white/90 border-sky-900 shadow-[#0ea5e9]'}`}>
        
        {/* Header Tabs */}
        <div className={`flex w-full mb-2 sm:mb-3 md:mb-4 border-b-2 md:border-b-3 transition-colors ${isDarkMode ? 'border-indigo-900' : 'border-gray-200'}`}>
            <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 font-press-start text-[10px] sm:text-[11px] md:text-[13px] lg:text-[1.6vmin] py-2 sm:py-2.5 transition-colors ${isLogin ? (isDarkMode ? 'text-pink-400 border-b-2 md:border-b-3 border-pink-400 -mb-[2px] md:-mb-[3px]' : 'text-sky-600 border-b-2 md:border-b-3 border-sky-600 -mb-[2px] md:-mb-[3px]') : 'text-gray-400 hover:text-gray-600'}`}
            >
                LOGIN
            </button>
            <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 font-press-start text-[10px] sm:text-[11px] md:text-[13px] lg:text-[1.6vmin] py-2 sm:py-2.5 transition-colors ${!isLogin ? (isDarkMode ? 'text-pink-400 border-b-2 md:border-b-3 border-pink-400 -mb-[2px] md:-mb-[3px]' : 'text-sky-600 border-b-2 md:border-b-3 border-sky-600 -mb-[2px] md:-mb-[3px]') : 'text-gray-400 hover:text-gray-600'}`}
            >
                SIGN UP
            </button>
        </div>

        <h2 className={`font-press-start text-[11px] sm:text-[13px] md:text-[15px] lg:text-[2vmin] text-center mb-3 sm:mb-4 transition-colors ${isDarkMode ? 'text-indigo-100' : 'text-gray-800'}`}>
            {isLogin ? 'INSERT CREDENTIALS' : 'NEW PLAYER ENTRY'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-3.5 md:gap-4">
            {!isLogin && (
                <div>
                    <label className={`font-press-start text-[9px] sm:text-[10px] md:text-[11px] lg:text-[1.2vmin] mb-1.5 block transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-600'}`}>USERNAME</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full font-vt323 text-[15px] sm:text-[16px] md:text-[18px] lg:text-[2.4vmin] p-2.5 sm:p-3 border-2 md:border-3 outline-none shadow-inner transition-colors ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-sky-500'}`}
                        placeholder="Enter your username"
                        required
                    />
                </div>
            )}
            <div>
                <label className={`font-press-start text-[9px] sm:text-[10px] md:text-[11px] lg:text-[1.2vmin] mb-1.5 block transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-600'}`}>EMAIL</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full font-vt323 text-[15px] sm:text-[16px] md:text-[18px] lg:text-[2.4vmin] p-2.5 sm:p-3 border-2 md:border-3 outline-none shadow-inner transition-colors ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-sky-500'}`}
                    placeholder="player@example.com"
                />
            </div>
                        {isLogin && (
                            <div>
                                <label className={`font-press-start text-[9px] sm:text-[10px] md:text-[11px] lg:text-[1.2vmin] mb-1.5 block transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-600'}`}>USERNAME</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className={`w-full font-vt323 text-[15px] sm:text-[16px] md:text-[18px] lg:text-[2.4vmin] p-2.5 sm:p-3 border-2 md:border-3 outline-none shadow-inner transition-colors ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-sky-500'}`}
                                    placeholder="player123"
                                />
                            </div>
                        )}
            <div>
                <label className={`font-press-start text-[9px] sm:text-[10px] md:text-[11px] lg:text-[1.2vmin] mb-1.5 block transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-600'}`}>PASSWORD</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full font-vt323 text-[15px] sm:text-[16px] md:text-[18px] lg:text-[2.4vmin] p-2.5 sm:p-3 border-2 md:border-3 outline-none shadow-inner transition-colors ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-sky-500'}`}
                    placeholder="********"
                />
            </div>

            <ArcadeButton 
              type="submit" 
              disabled={loading}
              className={`w-full mt-2 sm:mt-3 text-[11px] sm:text-[12px] md:text-[14px] lg:text-[1.6vmin] py-3 transition-all ${isDarkMode ? 'bg-pink-600 text-white border-indigo-900 shadow-indigo-900 hover:bg-pink-500' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'LOADING...' : (isLogin ? 'START GAME' : 'REGISTER')}
            </ArcadeButton>
        </form>

        <div className="relative flex py-3 sm:py-4 items-center">
            <div className={`flex-grow border-t-2 transition-colors ${isDarkMode ? 'border-indigo-900' : 'border-gray-300'}`}></div>
            <span className={`flex-shrink-0 mx-3 font-press-start text-[8px] sm:text-[9px] md:text-[10px] lg:text-[1vmin] transition-colors ${isDarkMode ? 'text-indigo-500' : 'text-gray-400'}`}>OR CONNECT WITH</span>
            <div className={`flex-grow border-t-2 transition-colors ${isDarkMode ? 'border-indigo-900' : 'border-gray-300'}`}></div>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
            <button 
                type="button"
                onClick={() => onLogin('Google_User', 'google@user.com', 9999)} // Simulated Google login
                className={`group relative w-full py-2.5 sm:py-3 px-3 border-2 md:border-3 transition-all flex items-center justify-center gap-2 sm:gap-2.5 ${isDarkMode ? 'bg-slate-900 border-indigo-900 text-indigo-100 shadow-[2px_2px_0px_0px_#db2777] md:shadow-[3px_3px_0px_0px_#db2777] hover:shadow-[1px_1px_0px_0px_#db2777]' : 'bg-white border-gray-800 text-gray-700 shadow-[2px_2px_0px_0px_#ea4335] md:shadow-[3px_3px_0px_0px_#ea4335] hover:shadow-[1px_1px_0px_0px_#ea4335]'} hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
            >
                 <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-press-start text-[10px] sm:text-[11px] md:text-[12px] lg:text-[1.2vmin] group-hover:opacity-80">GOOGLE</span>
            </button>
        </div>
        
        {/* Footer */}
        <p className={`mt-3 sm:mt-4 text-center font-vt323 text-[13px] sm:text-[15px] md:text-[17px] lg:text-[2vmin] transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-gray-500'}`}>
             BY STARTING, YOU AGREE TO OUR <span className={`underline cursor-pointer transition-colors ${isDarkMode ? 'text-pink-400 hover:text-pink-300' : 'text-sky-600 hover:text-sky-800'}`}>TOS</span>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
