import React from 'react';
import { WouldYouRatherIcon, TargetIcon, HoopsIcon } from './icons/LevelIcons';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <div className="absolute -top-8 -left-12 text-5xl transform rotate-[-15deg]">
          <span role="img" aria-label="sparkles">✨</span>
        </div>
        <div className="bg-white w-full max-w-lg p-8 sm:p-12 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <h1 className="font-fredoka text-5xl sm:text-6xl tracking-tighter mb-2">
            Start<span className="text-[#FF8FAB]">Hobby</span>
          </h1>
          <div className="inline-block bg-[#FDE24F] px-4 py-1 rounded-full border-2 border-black mb-4">
            <span className="font-bold text-sm">Start Your Happy!</span>
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