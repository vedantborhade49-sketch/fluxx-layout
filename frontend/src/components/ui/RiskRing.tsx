import React from 'react';

interface RiskRingProps {
  score: number;
}

export const RiskRing: React.FC<RiskRingProps> = ({ score }) => {
  const getColor = (s: number) => {
    if (s > 75) return '#EF4444';
    if (s > 50) return '#F59E0B';
    return '#0EA89A';
  };

  const color = getColor(score);
  const strokeDasharray = `${score} ${100 - score}`;

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
        <circle 
          cx="18" 
          cy="18" 
          r="15.915" 
          fill="transparent" 
          stroke={color} 
          strokeWidth="4" 
          strokeDasharray={strokeDasharray} 
          strokeDashoffset="0" 
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-fluxx-text leading-none tracking-tighter" style={{ color }}>{score}</span>
        <span className="text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mt-1">ERI Risk</span>
      </div>
    </div>
  );
};
