
import React from 'react';

export const WouldYouRatherIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

export const TargetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 10a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" />
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

export const HoopsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 10a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
  </svg>
);

interface RingIconProps {
  part: 'front' | 'back';
}

export const RingIcon: React.FC<RingIconProps> = ({ part }) => {
  const pathData = part === 'back' 
    ? "M 5,25 A 45,15 0 0 1 95,25" // Top arc
    : "M 5,25 A 45,15 0 0 0 95,25"; // Bottom arc

  return (
    <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path d={pathData} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
};

export const CrosshairIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="8">
    <circle cx="50" cy="50" r="45" />
    <circle cx="50" cy="50" r="25" />
    <circle cx="50" cy="50" r="5" fill="red" stroke="none" />
    <line x1="50" y1="5" x2="50" y2="35" />
    <line x1="50" y1="65" x2="50" y2="95" />
    <line x1="5" y1="50" x2="35" y2="50" />
    <line x1="65" y1="50" x2="95" y2="50" />
  </svg>
);
