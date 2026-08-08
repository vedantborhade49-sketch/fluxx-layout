import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  heavy?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', heavy = false }) => {
  const baseClass = heavy ? 'fluxx-glass-heavy' : 'fluxx-glass';
  return (
    <div className={`${baseClass} rounded-2xl ${className}`}>
      {children}
    </div>
  );
};
