
import React, { useState, useEffect, useRef } from 'react';
import { CrosshairIcon } from './icons/LevelIcons';
import * as HobbyIcons from './icons/HobbyIcons';

interface ShootingGameProps {
  onComplete: (selections: string[]) => void;
}

const HOBBY_LIST = Object.keys(HobbyIcons);

const MAX_SELECTIONS = 3;

interface Target {
  id: number;
  name: string;
  icon: React.FC;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const createInitialTargets = (count: number, width: number, height: number): Target[] => {
  const targets: Target[] = [];
  const selectedHobbies = [...HOBBY_LIST].sort(() => 0.5 - Math.random()).slice(0, count);

  for (let i = 0; i < count; i++) {
    const name = selectedHobbies[i];
    const iconKey = name as keyof typeof HobbyIcons;
    targets.push({
      id: i,
      name: name.replace(/([A-Z])/g, ' $1').trim(), // Add spaces to camelCase names
      icon: HobbyIcons[iconKey],
      x: Math.random() * (width - 80),
      y: Math.random() * (height - 80),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });
  }
  return targets;
};

const ShootingGame: React.FC<ShootingGameProps> = ({ onComplete }) => {
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      setTargets(createInitialTargets(16, width, height));
    }
  }, []);

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const animationFrame = requestAnimationFrame(gameLoop);

    function gameLoop() {
      const { width, height } = gameArea.getBoundingClientRect();
      setTargets(prevTargets =>
        prevTargets.map(t => {
          let newX = t.x + t.vx;
          let newY = t.y + t.vy;
          let newVx = t.vx;
          let newVy = t.vy;

          if (newX <= 0 || newX >= width - 80) newVx *= -1;
          if (newY <= 0 || newY >= height - 80) newVy *= -1;

          return { ...t, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
      requestAnimationFrame(gameLoop);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [targets.length]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleTargetClick = (targetName: string) => {
    setSelectedTargets(prev => {
      if (prev.includes(targetName)) {
        return prev.filter(t => t !== targetName);
      }
      if (prev.length < MAX_SELECTIONS) {
        return [...prev, targetName];
      }
      return prev;
    });
  };

  const isSelected = (target: string) => selectedTargets.includes(target);
  const canProceed = selectedTargets.length === MAX_SELECTIONS;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="inline-block bg-[#84D2F6] text-black font-bold px-4 py-1 rounded-full border-2 border-black mb-2">LEVEL 2</div>
        <h2 className="font-fredoka text-4xl sm:text-5xl">Hit Your Targets!</h2>
      </div>

      <div className="bg-white/60 p-3 rounded-2xl border-2 border-dashed border-gray-400 mb-6 w-full max-w-xl">
        <p className="text-center text-lg">
          <span className="font-bold">Question:</span> What do you love to dive into when you're free?
        </p>
      </div>

      <div
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorPos({ x: -100, y: -100 })}
        className="relative bg-pink-100 p-2 sm:p-4 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] w-full max-w-3xl h-96 mb-8 overflow-hidden cursor-none"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #FFC0CB, #FFC0CB 10px, transparent 10px, transparent 20px)" }}
      >
        <div className="relative bg-[#FEF6E4] w-full h-full rounded-2xl border-2 border-black overflow-hidden">
          {targets.map(target => (
            <button
              key={target.id}
              onClick={() => handleTargetClick(target.name)}
              className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-center p-2 text-xs sm:text-sm font-bold border-2 border-black transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                isSelected(target.name)
                  ? 'bg-yellow-300 ring-4 ring-orange-500 ring-offset-2'
                  : 'bg-white'
              }`}
              style={{
                left: `${target.x}px`,
                top: `${target.y}px`,
              }}
            >
              <target.icon />
            </button>
          ))}
          <div
            className="absolute pointer-events-none w-12 h-12 text-red-500"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CrosshairIcon />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-xl">
        <div className="flex items-center space-x-2 mb-4">
          <span className="font-bold text-sm">TARGETS HIT:</span>
          {[...Array(MAX_SELECTIONS)].map((_, i) => (
            <div key={i} className={`w-6 h-6 rounded-full border-2 border-black ${i < selectedTargets.length ? 'bg-yellow-400' : 'bg-white'}`}></div>
          ))}
        </div>
        <button
          onClick={() => onComplete(selectedTargets)}
          disabled={!canProceed}
          className="font-fredoka w-full max-w-sm bg-[#FF8FAB] text-black text-xl py-3 rounded-xl border-2 border-black hover:bg-[#e67a97] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
        >
          NEXT LEVEL →
        </button>
      </div>
    </div>
  );
};

export default ShootingGame;
