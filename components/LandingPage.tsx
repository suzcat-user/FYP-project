import React from 'react';
import { WouldYouRatherIcon, TargetIcon, HoopsIcon } from './icons/LevelIcons';
import { Gamepad2, Sparkles, Play, Target, Hammer, Circle, Grid3X3 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}
const FloatingStar: React.FC<{ inline?: boolean; className?: string }> = ({ inline, className }) => {
  const starStyle: React.CSSProperties = {
    display: 'inline-block',
    transformOrigin: 'center',
    animation: 'floatStar 3.5s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
  };

  if (inline) {
    return (
      <>
        <span
          aria-hidden="true"
          className={className ?? 'ml-2  text-[10rem] sm:text-[15rem]'}
          style={starStyle}
        >
          ✨
        </span>
        <style>{`
          @keyframes floatStar {
            0%   { transform: translateY(0px) rotate(0deg) scale(1); opacity: 1; }
            25%  { transform: translateY(-6px) rotate(8deg) scale(1.04); opacity: 0.95; }
            50%  { transform: translateY(-10px) rotate(-6deg) scale(1.06); opacity: 1; }
            75%  { transform: translateY(-6px) rotate(5deg) scale(1.03); opacity: 0.98; }
            100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 1; }
          }
        `}</style>
      </>
    );
  }
  return (
    <>
      <div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="text-4xl sm:text-5xl"
          style={starStyle}
        >
          ✨
        </span>
      </div>

      <style>{`
        @keyframes floatStar {
          0%   { transform: translateY(0px) rotate(0deg) scale(1); opacity: 1; }
          25%  { transform: translateY(-8px) rotate(10deg) scale(1.05); opacity: 0.95; }
          50%  { transform: translateY(-14px) rotate(-8deg) scale(1.08); opacity: 1; }
          75%  { transform: translateY(-8px) rotate(6deg) scale(1.04); opacity: 0.98; }
          100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">

        <div className="bg-white w-full max-w-lg p-8 sm:p-12 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
         <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 -ml-28 sm:-ml-34">
         <FloatingStar className="text-[10rem] sm:text-[15rem]" />
          </div>
          <h1 className="font-fredoka text-5xl sm:text-6xl tracking-tighter mb-2">
            Start<span className="text-[#FF8FAB]">Hobby</span>
          </h1>
          <div className="inline-block bg-[#FDE24F] px-4 py-1 rounded-full border-2 border-black mb-4">
            <span className="font-bold text-sm">Start Your Happiness!</span>
          </div>
          <p className="text-lg mb-8">
            Go on an adventure to discover your true personality!
          </p>
          <button 
            onClick={onStart}
            className="font-fredoka w-full bg-[#90F1AC] text-black text-2xl py-4 rounded-2xl border-4 border-black hover:bg-[#7bce93] transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
          >
            START ADVENTURE
            <span className="ml-3 text-3xl">▶</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <LevelCard color="bg-[#F8A07E]" title="Level 1: Choose!" subtitle="Would you rather...?" icon={<WouldYouRatherIcon />} />
        <LevelCard color="bg-[#84D2F6]" title="Level 2: Targets" subtitle="Shoot answers" icon={<TargetIcon />} />
        <LevelCard color="bg-[#FF8FAB]" title="Level 3: Hoops" subtitle="Throw rings" icon={<HoopsIcon />} />
      </div>
    </div>
  );
};

interface LevelCardProps {
    color: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

const LevelCard: React.FC<LevelCardProps> = ({ color, title, subtitle, icon }) => (
    <div className={`${color} p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center`}>
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm">{subtitle}</p>
    </div>
);


export default LandingPage;