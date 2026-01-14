
import React from 'react';

interface ArcadeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const ArcadeButton: React.FC<ArcadeButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`font-press-start text-xs md:text-sm text-sky-900 bg-white px-6 py-4 rounded-none border-4 border-sky-800 shadow-[4px_4px_0px_0px_#0ea5e9] hover:shadow-[2px_2px_0px_0px_#0ea5e9] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 focus:outline-none hover:bg-sky-50 hover:text-sky-700 uppercase tracking-widest ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ArcadeButton;
