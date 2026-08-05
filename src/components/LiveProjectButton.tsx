import React from 'react';

interface LiveProjectButtonProps {
  className?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({ className = '' }) => {
  return (
    <button
      className={`rounded-full border-2 border-[#D7E2EA] px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base text-[#D7E2EA] font-medium uppercase tracking-widest transition-colors hover:bg-[#D7E2EA]/10 ${className}`}
    >
      Live Project
    </button>
  );
};
