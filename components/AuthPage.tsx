import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { GoogleIcon, AppleIcon } from './icons/AuthIcons';

// A simple JWT decoder
function jwtDecode(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getAvatar = (name: string) => {
    const emojiAvatars = ['🧑‍🚀', '🧑‍🎨', '🧑‍💻', '🧑‍🎤', '🧑‍🔬', '🧑‍🍳', '🦸', '🧙', '🥷', '🧑‍🌾'];
    if (!name) return emojiAvatars[Math.floor(Math.random() * emojiAvatars.length)];
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return emojiAvatars[charCodeSum % emojiAvatars.length];
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUsername = isSignUp ? username : 'Guest';
    if (isSignUp && !username) {
        alert("Please enter a username.");
        return;
    }
    // Simulate login/signup
    onLoginSuccess({
      id: Date.now().toString(),
      username: finalUsername,
      email: email,
      avatar: getAvatar(finalUsername),
      description: "Welcome to my hobby adventure! Ready to discover something new.",
      hobbies: []
    });
  };

  const handleAppleLogin = () => {
    onLoginSuccess({
      id: 'apple-user-456',
      username: 'AppleUser',
      avatar: getAvatar('AppleUser'),
      email: 'user@icloud.com',
      description: "Welcome to my hobby adventure!",
      hobbies: []
    });
  };
  
  // --- Google Sign-In Integration ---
  useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        // IMPORTANT: Replace this with your own Google Client ID
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', 
        callback: handleCredentialResponse
      });
      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large", text: "signin_with", shape: "pill", width: "320" }
      );
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    const credential = response.credential;
    const profileObj = jwtDecode(credential);
    
    if (profileObj) {
        onLoginSuccess({
            id: profileObj.sub,
            username: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture, // This is a URL to the profile image
            description: 'Curious explorer of all things fun and interesting! Just signed in with Google.',
            hobbies: []
        });
    } else {
        console.error("Failed to decode JWT from Google");
    }
  };
  // --- End of Google Sign-In Integration ---

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
             <div className="w-12 h-12 bg-[#FF8FAB] rounded-xl flex items-center justify-center border-2 border-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </div>
            <h1 className="font-fredoka text-4xl tracking-tighter">
                Start<span className="text-[#FF8FAB]">Hobby</span>
            </h1>
        </div>
        <p className="mb-8 text-lg">Your adventure starts here!</p>

      <div className="bg-white w-full p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <h2 className="font-fredoka text-3xl mb-6">{isSignUp ? 'Create Account' : 'Welcome Back!'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#84D2F6]"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#84D2F6]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#84D2F6]"
            required
          />
          <button
            type="submit"
            className="font-fredoka w-full bg-[#90F1AC] text-black text-xl py-3 rounded-xl border-2 border-black hover:bg-[#7bce93] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t-2 border-gray-300" />
          <span className="mx-4 text-gray-500 font-bold text-sm">OR</span>
          <hr className="flex-grow border-t-2 border-gray-300" />
        </div>

        <div className="space-y-3 flex flex-col items-center">
            <div id="googleSignInButton"></div>
            <button onClick={handleAppleLogin} className="w-full max-w-[320px] flex items-center justify-center gap-3 px-4 py-2 rounded-full border-2 border-black bg-black text-white hover:bg-gray-800 transition-colors">
                <AppleIcon />
                <span className="font-bold">Sign in with Apple</span>
            </button>
        </div>

      </div>

      <p className="mt-8">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="font-bold text-[#FF8FAB] hover:underline ml-2"
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
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

export default AuthPage;