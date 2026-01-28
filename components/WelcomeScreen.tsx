import React, { useState, useEffect } from 'react';
import ArcadeButton from './ui/ArcadeButton';

interface WelcomeScreenProps {
  onStart: () => void;
  isDarkMode?: boolean;
}

// Function to load chatbot scripts
const loadChatbotScripts = () => {
  // Add cache-busting parameter to force fresh load
  const cacheBuster = `?v=${Date.now()}`;
  
  // Load the first script (inject.js)
  const script1 = document.createElement('script');
  script1.src = `https://cdn.botpress.cloud/webchat/v3.5/inject.js${cacheBuster}`;
  script1.async = true;
  document.body.appendChild(script1);

  // Load the second script (bot configuration)
  const script2 = document.createElement('script');
  script2.src = `https://files.bpcontent.cloud/2026/01/27/08/20260127082808-R5CGNPDZ.js${cacheBuster}`;
  script2.defer = true;
  document.body.appendChild(script2);

  return () => {
    // Cleanup: Remove scripts when component unmounts
    if (script1.parentNode) script1.parentNode.removeChild(script1);
    if (script2.parentNode) script2.parentNode.removeChild(script2);
    
    // Remove chatbot widget if it exists
    const chatbotContainer = document.getElementById('bp-web-widget-container');
    if (chatbotContainer && chatbotContainer.parentNode) {
      chatbotContainer.parentNode.removeChild(chatbotContainer);
    }
  };
};

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
  const [typedText, setTypedText] = useState('');
  const fullText = '"Find the spark that starts the flame." Discover your ultimate hobby through three precision-tuned arcade tests.';

  // Load chatbot scripts only on home page
  useEffect(() => {
    const cleanup = loadChatbotScripts();
    return cleanup;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedHobby(ListOfHobbies[Math.floor(Math.random() * ListOfHobbies.length)].toUpperCase());
      setSelectedUsername(ListOfUsernames[Math.floor(Math.random() * ListOfUsernames.length)]);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startDelay = 2500; // Wait for logo animation
    const typeSpeed = 25; // ms per character

    setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, typeSpeed);
    }, startDelay);
  }, []);

  return (
    <div className={`h-full w-full overflow-y-auto overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/10' : 'bg-sky-50/10'} scroll-smooth relative`}>
      <style>
        {`
          @keyframes topFlicker {
            0% { opacity: 0.1; }
            5% { opacity: 1; }
            10% { opacity: 0.1; }
            15% { opacity: 1; }
            20% { opacity: 0.1; }
            25% { opacity: 1; }
            30% { opacity: 0.1; }
            35% { opacity: 1; }
            40% { opacity: 0.1; }
            45% { opacity: 1; }
            50%, 100% { opacity: 1; }
          }
          @keyframes bottomFlicker {
            0%, 60% { opacity: 0.1; }
            65% { opacity: 1; }
            70% { opacity: 0.1; }
            75% { opacity: 1; }
            80% { opacity: 0.1; }
            85% { opacity: 1; }
            90% { opacity: 0.1; }
            95% { opacity: 1; }
            100% { opacity: 1; }
          }
          .top-flicker {
            animation: topFlicker 2s infinite;
          }
          .bottom-flicker {
            animation: bottomFlicker 2s infinite;
          }
          .perspective-grid {
            background-image: 
              linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            transform: perspective(1000px) rotateX(60deg);
            transform-origin: center bottom;
          }
        `}
      </style>
      {/* Animated Pixel Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 3D Perspective Grid */}
        <div className={`absolute bottom-0 left-0 right-0 h-80 perspective-grid ${isDarkMode ? 'opacity-40' : 'opacity-50'}`}></div>
      </div>

      {/* Retro Grid Background */}
      <div className="retro-grid"></div>

      {/* HEADER SECTION */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10">
          <div className="absolute top-10 flex flex-col items-center gap-2">
             <div className={`flex gap-2 font-press-start text-[0.8vmin] ${isDarkMode ? 'text-slate-400/60' : 'text-sky-400/60'} uppercase`}>
                <span>TERMINAL: 09</span>
                <span>•</span>
                <span>STATUS: READY</span>
             </div>
          </div>

          <div className="relative z-20 flex flex-col items-center text-center">
            {/* Main Logo Area */}
            <div className="mb-12 relative group">
                <div className={`absolute -inset-8 ${isDarkMode ? 'bg-slate-500/10' : 'bg-sky-500/10'} blur-3xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                 <h1 className={`font-press-start text-[5.5vmin] leading-tight mb-3 tracking-tighter chromatic transition-all duration-300 uppercase text-sky-800 drop-shadow-[6px_6px_0px_#bae6fd]`}>
                    <span className="top-flicker">START HOBBY</span><br/><span className="bottom-flicker">START HAPPY</span>
                </h1>

                <div className="flex items-center justify-center gap-6">
                    <span className="h-[3px] w-24 bg-gradient-to-r from-transparent to-sky-500"></span>
                    <span className="font-press-start text-[1.2vmin] text-sky-600 uppercase tracking-[0.8vmin] animate-pulse">INSERT COIN</span>
                    <span className="h-[3px] w-24 bg-gradient-to-l from-transparent to-sky-500"></span>
                </div>
            </div>

            <div className="p-7 border-4 border-sky-400/40 bg-white/80 backdrop-blur-sm shadow-[12px_12px_0px_#bae6fd] mb-10 max-w-2xl transform hover:scale-[1.01] transition-transform">
                <p className="font-vt323 text-[3vmin] text-sky-900 leading-none">
                    {typedText}
                </p>
                <div className="mt-3 font-press-start text-[0.65vmin] text-sky-400 text-right uppercase italic">Neural Sync Established...</div>
            </div>

            <ArcadeButton 
              onClick={onStart} 
              className="px-16 py-8 text-[3vmin] group relative overflow-hidden !bg-sky-600 !border-sky-900 shadow-[9px_9px_0px_#075985] hover:shadow-[5px_5px_0px_#075985] active:shadow-none"
            >
                <span className="relative z-10 font-semibold" style={{ color: 'white' }}>PRESS START</span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            </ArcadeButton>

            <div className="mt-12 flex gap-8">
                <div className={`flex flex-col items-center border-2 ${isDarkMode ? 'border-slate-400/20 bg-slate-800' : 'border-sky-400/20 bg-white'} shadow-md p-3`}>
                    <span className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} mb-1.5 uppercase tracking-widest`}>LATEST_PASSION</span>
                    <span className={`font-vt323 text-2xl ${isDarkMode ? 'text-slate-200' : 'text-sky-800'}`}>{selectedHobby}</span>
                </div>
                <div className={`flex flex-col items-center border-2 ${isDarkMode ? 'border-slate-400/20 bg-slate-800' : 'border-sky-400/20 bg-white'} shadow-md p-3`}>
                    <span className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} mb-1.5 uppercase tracking-widest`}>ELITE_PLAYER</span>
                    <span className={`font-vt323 text-2xl ${isDarkMode ? 'text-slate-200' : 'text-sky-800'}`}>{selectedUsername}</span>
                </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 animate-bounce flex flex-col items-center opacity-40">
             <span className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-800'} mb-1.5`}>SCROLL_DOWN</span>
             <span className={`text-xl ${isDarkMode ? 'text-slate-400' : 'text-sky-600'} mt-0.5`}>▼</span>
          </div>
      </section>

      {/* GAMES SUMMARY SECTION */}
      <section className={`py-24 px-6 ${isDarkMode ? 'bg-slate-900' : 'bg-sky-100'} border-y-[6px] ${isDarkMode ? 'border-slate-600' : 'border-sky-200'} relative overflow-hidden`}>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(100,116,139,0.1),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]'}`}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col items-center mb-16">
                  <h2 className={`font-press-start text-[4vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-3 tracking-tighter uppercase chromatic`}>THREE GAME CHALLENGE</h2>
                  <div className={`h-2 w-48 ${isDarkMode ? 'bg-slate-400' : 'bg-sky-400'} shadow-[0_0_15px_${isDarkMode ? 'rgba(100,116,139,0.5)' : 'rgba(14,165,233,0.5)'}]`}></div>
                  <p className={`font-vt323 text-[2.5vmin] ${isDarkMode ? 'text-slate-300' : 'text-sky-800'} mt-6 max-w-3xl text-center`}>
                      Ready, Player One? Beat the clock in three precision challenges to reveal your hidden hobby stats and personality class.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Game 1: Would You Rather */}
                  <div className={`group relative border-4 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-sky-300 bg-white'} p-8 hover:border-sky-500 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_0px_${isDarkMode ? '#475569' : '#bae6fd'}] hover:shadow-[12px_12px_0px_#0ea5e9]`}>
                      <div className={`absolute top-4 right-5 font-press-start text-4xl opacity-10 italic ${isDarkMode ? 'text-slate-200' : 'text-sky-900'}`}>01</div>
                      <div className="mb-6">
                          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🎮</div>
                          <h3 className={`font-press-start text-[2.2vmin] ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} uppercase tracking-tight mb-2`}>WOULD YOU RATHER</h3>
                          <div className={`font-vt323 text-xl ${isDarkMode ? 'text-slate-400' : 'text-sky-400/60'} uppercase tracking-wide`}>CHOICE REACTOR</div>
                      </div>
                      <p className={`font-vt323 text-[2.3vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-4 leading-tight`}>
                          Five rapid-fire questions test your instant reactions. Choose between contrasting scenarios to reveal your core preferences.
                      </p>
                      <div className={`border-t-2 ${isDarkMode ? 'border-slate-600' : 'border-sky-200'} pt-4 mt-6`}>
                          <div className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} uppercase tracking-widest mb-2`}>STATS</div>
                          <div className="flex justify-between items-center">
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-300' : 'text-sky-800'}`}>5 Questions</span>
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-300' : 'text-sky-800'}`}>~1-2 min</span>
                          </div>
                      </div>
                  </div>

                  {/* Game 2: Precision Toss (Ring Toss) */}
                  <div className={`group relative border-4 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-sky-300 bg-white'} p-8 hover:border-sky-500 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_0px_${isDarkMode ? '#475569' : '#bae6fd'}] hover:shadow-[12px_12px_0px_#0ea5e9]`}>
                      <div className={`absolute top-4 right-5 font-press-start text-4xl opacity-10 italic ${isDarkMode ? 'text-slate-200' : 'text-sky-900'}`}>02</div>
                      <div className="mb-6">
                          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⭕</div>
                          <h3 className={`font-press-start text-[2.2vmin] ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} uppercase tracking-tight mb-2`}>PRECISION TOSS</h3>
                          <div className={`font-vt323 text-xl ${isDarkMode ? 'text-slate-400' : 'text-sky-400/60'} uppercase tracking-wide`}>TARGET SELECTOR</div>
                      </div>
                      <p className={`font-vt323 text-[2.3vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-4 leading-tight`}>
                          Aim and throw rings at targets representing different life satisfactions. Five rounds test your priorities and values.
                      </p>
                      <div className={`border-t-2 ${isDarkMode ? 'border-slate-600' : 'border-sky-200'} pt-4 mt-6`}>
                          <div className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} uppercase tracking-widest mb-2`}>STATS</div>
                          <div className="flex justify-between items-center">
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-300' : 'text-sky-800'}`}>5 Rounds</span>
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-300' : 'text-sky-800'}`}>~2-3 min</span>
                          </div>
                      </div>
                  </div>

                  {/* Game 3: Shooting Gallery */}
                  <div className={`group relative border-4 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-sky-300 bg-white'} p-8 hover:border-sky-500 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_0px_${isDarkMode ? '#475569' : '#bae6fd'}] hover:shadow-[12px_12px_0px_#0ea5e9]`}>
                      <div className={`absolute top-4 right-5 font-press-start text-4xl opacity-10 italic ${isDarkMode ? 'text-slate-200' : 'text-sky-900'}`}>03</div>
                      <div className="mb-6">
                          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🔫</div>
                          <h3 className={`font-press-start text-[2.2vmin] ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} uppercase tracking-tight mb-2`}>SHOOTING GALLERY</h3>
                          <div className={`font-vt323 text-xl ${isDarkMode ? 'text-slate-400' : 'text-sky-400/60'} uppercase tracking-wide`}>RAPID FIRE MODE</div>
                      </div>
                      <p className={`font-vt323 text-[2.3vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-4 leading-tight`}>
                          Shoot moving targets labeled with hobby scenarios. Five fast-paced rounds measure your quick decision-making under pressure.
                      </p>
                      <div className={`border-t-2 ${isDarkMode ? 'border-slate-600' : 'border-sky-200'} pt-4 mt-6`}>
                          <div className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} uppercase tracking-widest mb-2`}>STATS</div>
                          <div className="flex justify-between items-center">
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-300' : 'text-sky-800'}`}>5 Rounds</span>
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-300' : 'text-sky-800'}`}>~2-3 min</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* HERO CLASSES SECTION */}
      <section className={`py-32 px-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-y-[8px] ${isDarkMode ? 'border-slate-700' : 'border-sky-50'} relative overflow-hidden`}>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(100,116,139,0.05),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]'}`}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col items-center mb-20">
                  <h2 className={`font-press-start text-[4vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-3 tracking-tighter uppercase chromatic`}>ARCHETYPE PREVIEW</h2>
                  <div className={`h-2 w-64 ${isDarkMode ? 'bg-slate-400' : 'bg-sky-400'} shadow-[0_0_15px_${isDarkMode ? 'rgba(100,116,139,0.5)' : 'rgba(14,165,233,0.5)'}]`}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {TRAITS.map((trait, i) => (
                      <div key={i} className={`group relative border-3 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-sky-100 bg-white'} p-8 hover:border-sky-500 transition-all duration-300 hover:-translate-y-3 shadow-[8px_8px_0px_${isDarkMode ? '#475569' : '#f1f5f9'}] hover:shadow-[16px_16px_0px_#bae6fd]`}>
                          <div className={`absolute top-3 right-5 font-press-start text-lg opacity-5 italic ${isDarkMode ? 'text-slate-200' : 'text-sky-900'}`}>0{i+1}</div>
                          <div className="flex items-center gap-5 mb-6">
                              <div className="text-6xl group-hover:scale-125 transition-transform duration-500 drop-shadow-md">{trait.icon}</div>
                              <div>
                                  <h3 className={`font-press-start text-[2vmin] ${trait.color} uppercase tracking-tighter`}>{trait.name}</h3>
                                  <div className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-400/60' : 'text-sky-400/60'}`}>CLASS: {trait.stat}</div>
                              </div>
                          </div>
                          <p className={`font-vt323 text-[2.3vmin] ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} mb-6 leading-none min-h-[2.5em]`}>{trait.desc}</p>
                          <div className={`border-t-2 ${isDarkMode ? 'border-slate-600' : 'border-sky-50'} pt-5 flex justify-between items-center`}>
                              <span className={`font-press-start text-[0.65vmin] ${isDarkMode ? 'text-slate-400' : 'text-sky-400'} uppercase tracking-widest`}>SIG_GEAR</span>
                              <span className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-200' : 'text-sky-900'} italic`}>{trait.gear}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-20 border-t-6 ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-sky-100 bg-sky-50/50'} text-center relative overflow-hidden`}>
          <div className={`font-press-start text-[0.8vmin] ${isDarkMode ? 'text-slate-500/40' : 'text-sky-900/40'} mb-3 uppercase tracking-[0.4vmin]`}>
              © HOBBY ARCADE • EST. 2025 • A FYP PROJECT
          </div>
          <div className={`font-vt323 text-lg ${isDarkMode ? 'text-slate-500/10' : 'text-sky-900/10'} animate-pulse`}>
              [SYSTEM_READY] [ENCRYPTION_ACTIVE] [PING: 14MS]
          </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;