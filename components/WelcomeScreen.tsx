import React, { useState, useEffect } from 'react';
import ArcadeButton from './ui/ArcadeButton';

interface WelcomeScreenProps {
  onStart: () => void;
  isDarkMode?: boolean;
}

const TRAITS = [
    { name: "Creative", icon: "🎨", color: "text-sky-400", desc: "Builds from imagination.", stat: "DREAMER", gear: "Infinite Pen" },
    { name: "Active", icon: "⚡", color: "text-blue-400", desc: "Always in high gear.", stat: "KINETIC", gear: "Turbo Kicks" },
    { name: "Strategic", icon: "♟️", color: "text-cyan-400", desc: "Predicts the outcome.", stat: "TACTICAL", gear: "Oracle Map" },
    { name: "Calm", icon: "🍃", color: "text-emerald-400", desc: "Peace in the storm.", stat: "BALANCE", gear: "Zen Flute" },
    { name: "Social", icon: "🤝", color: "text-indigo-400", desc: "The soul of the party.", stat: "CHARISMA", gear: "Mega Mic" },
    { name: "Explorer", icon: "🧭", color: "text-sky-500", desc: "Seeking new horizons.", stat: "VOYAGER", gear: "Star Lens" },
];
const ListOfHobbies = [ 
    "Woodworking", "Photography", "Gardening", "Cooking", "Hiking", 
    "Painting", "Cycling", "Writing", "Dancing", "Knitting", 
    "Fishing", "Yoga", "Bird Watching", "Pottery", "Coding",
    "Traveling", "Collecting", "Brewing", "Sculpting", "Calligraphy",
    "Origami", "Rock Climbing", "Meditation", "Astronomy", "Magic Tricks"
]

const ListOfUsernames = [
  "CYBER_PHANTOM_92",
  "VECTOR_OUTLAW_77",
  "GLITCH_ROGUE_01",
  "BINARY_PUNK_88",
  "VOXEL_VANDAL_13",
  "STATIC_GHOST_55",
  "DATA_NOMAD_24",
  "NEON_BANDIT_99",
  "LOGIC_RIFT_66",
  "OZONE_HACKER_10", 
  "PIXEL_REBEL_84",
 "QUANTUM_RAIDER_37",
 "SYNTH_WARRIOR_21",
]
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, isDarkMode = false }) => {
  const [selectedHobby, setSelectedHobby] = useState(ListOfHobbies[Math.floor(Math.random() * ListOfHobbies.length)].toUpperCase());
  const [selectedUsername, setSelectedUsername] = useState(ListOfUsernames[Math.floor(Math.random() * ListOfUsernames.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedHobby(ListOfHobbies[Math.floor(Math.random() * ListOfHobbies.length)].toUpperCase());
      setSelectedUsername(ListOfUsernames[Math.floor(Math.random() * ListOfUsernames.length)]);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`h-full w-full overflow-y-auto transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/10' : 'bg-sky-50/10'} scroll-smooth relative`}>
      {/* Retro Grid Background */}
      <div className="retro-grid"></div>

      {/* HEADER SECTION */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10">
          <div className="absolute top-10 flex flex-col items-center gap-2">
             <div className={`flex gap-2 font-press-start text-[1vmin] ${isDarkMode ? 'text-slate-400/60' : 'text-sky-400/60'} uppercase`}>
                <span>TERMINAL: 09</span>
                <span>•</span>
                <span>STATUS: READY</span>
             </div>
          </div>

          <div className="relative z-20 flex flex-col items-center text-center">
            {/* Main Logo Area */}
            <div className="mb-12 relative group">
                <div className={`absolute -inset-8 ${isDarkMode ? 'bg-slate-500/10' : 'bg-sky-500/10'} blur-3xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                 <h1 className={`font-press-start text-[7vmin] leading-tight mb-4 tracking-tighter chromatic transition-all duration-300 uppercase text-sky-800 drop-shadow-[6px_6px_0px_#bae6fd]`}>
                    START HOBBY<br/>START HAPPY
                </h1>

                <div className="flex items-center justify-center gap-6">
                    <span className="h-[3px] w-24 bg-gradient-to-r from-transparent to-sky-500"></span>
                    <span className="font-press-start text-[1.5vmin] text-sky-600 uppercase tracking-[1vmin] animate-pulse">INSERT COIN</span>
                    <span className="h-[3px] w-24 bg-gradient-to-l from-transparent to-sky-500"></span>
                </div>
            </div>

            <div className="p-10 border-4 border-sky-400/40 bg-white/80 backdrop-blur-sm shadow-[15px_15px_0px_#bae6fd] mb-14 max-w-2xl transform hover:scale-[1.01] transition-transform">
                <p className="font-vt323 text-[4vmin] text-sky-900 leading-none">
                    "Find the spark that starts the flame." Discover your ultimate hobby through three precision-tuned arcade tests. 
                </p>
                <div className="mt-4 font-press-start text-[0.8vmin] text-sky-400 text-right uppercase italic">Neural Sync Established...</div>
            </div>

            <ArcadeButton 
              onClick={onStart} 
              className="px-20 py-10 text-[4vmin] group relative overflow-hidden bg-sky-600 border-sky-900 text-white shadow-[12px_12px_0px_#075985] hover:shadow-[6px_6px_0px_#075985] active:shadow-none"
            >
                <span className="relative z-10 animate-blink">PRESS START</span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            </ArcadeButton>

            <div className="mt-16 flex gap-10">
                <div className={`flex flex-col items-center border-2 ${isDarkMode ? 'border-slate-400/20 bg-slate-800' : 'border-sky-400/20 bg-white'} shadow-md p-5`}>
                    <span className={`font-press-start text-[0.8vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} mb-2 uppercase tracking-widest`}>LATEST_PASSION</span>
                    <span className={`font-vt323 text-3xl ${isDarkMode ? 'text-slate-200' : 'text-sky-800'}`}>{selectedHobby}</span>
                </div>
                <div className={`flex flex-col items-center border-2 ${isDarkMode ? 'border-slate-400/20 bg-slate-800' : 'border-sky-400/20 bg-white'} shadow-md p-5`}>
                    <span className={`font-press-start text-[0.8vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} mb-2 uppercase tracking-widest`}>ELITE_PLAYER</span>
                    <span className={`font-vt323 text-3xl ${isDarkMode ? 'text-slate-200' : 'text-sky-800'}`}>{selectedUsername}</span>
                </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 animate-bounce flex flex-col items-center opacity-40">
             <span className={`font-press-start text-[0.8vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-800'} mb-2`}>SCROLL_DOWN</span>
             <span className={`text-2xl ${isDarkMode ? 'text-slate-400' : 'text-sky-600'} mt-1`}>▼</span>
          </div>
      </section>

      {/* HERO CLASSES SECTION */}
      <section className={`py-40 px-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-y-[10px] ${isDarkMode ? 'border-slate-700' : 'border-sky-50'} relative overflow-hidden`}>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(100,116,139,0.05),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]'}`}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col items-center mb-24">
                  <h2 className={`font-press-start text-[5vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-4 tracking-tighter uppercase chromatic`}>ARCHETYPE PREVIEW</h2>
                  <div className={`h-2 w-64 ${isDarkMode ? 'bg-slate-400' : 'bg-sky-400'} shadow-[0_0_15px_${isDarkMode ? 'rgba(100,116,139,0.5)' : 'rgba(14,165,233,0.5)'}]`}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {TRAITS.map((trait, i) => (
                      <div key={i} className={`group relative border-4 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-sky-100 bg-white'} p-10 hover:border-sky-500 transition-all duration-300 hover:-translate-y-3 shadow-[10px_10px_0px_${isDarkMode ? '#475569' : '#f1f5f9'}] hover:shadow-[20px_20px_0px_#bae6fd]`}>
                          <div className={`absolute top-4 right-6 font-press-start text-xl opacity-5 italic ${isDarkMode ? 'text-slate-200' : 'text-sky-900'}`}>0{i+1}</div>
                          <div className="flex items-center gap-6 mb-8">
                              <div className="text-7xl group-hover:scale-125 transition-transform duration-500 drop-shadow-md">{trait.icon}</div>
                              <div>
                                  <h3 className={`font-press-start text-[2.5vmin] ${trait.color} uppercase tracking-tighter`}>{trait.name}</h3>
                                  <div className={`font-vt323 text-2xl ${isDarkMode ? 'text-slate-400/60' : 'text-sky-400/60'}`}>CLASS: {trait.stat}</div>
                              </div>
                          </div>
                          <p className={`font-vt323 text-[3vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-8 leading-none min-h-[3em]`}>{trait.desc}</p>
                          <div className={`border-t-2 ${isDarkMode ? 'border-slate-600' : 'border-sky-50'} pt-6 flex justify-between items-center`}>
                              <span className={`font-press-start text-[0.8vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} uppercase tracking-widest`}>SIG_GEAR</span>
                              <span className={`font-vt323 text-2xl ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} italic`}>{trait.gear}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-24 border-t-8 ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-sky-100 bg-sky-50/50'} text-center relative overflow-hidden`}>
          <div className={`font-press-start text-[1vmin] ${isDarkMode ? 'text-slate-500/40' : 'text-sky-900/40'} mb-4 uppercase tracking-[0.5vmin]`}>
              © HOBBY ARCADE • EST. 2025 • A FYP PROJECT
          </div>
          <div className={`font-vt323 text-2xl ${isDarkMode ? 'text-slate-500/10' : 'text-sky-900/10'} animate-pulse`}>
              [SYSTEM_READY] [ENCRYPTION_ACTIVE] [PING: 14MS]
          </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;