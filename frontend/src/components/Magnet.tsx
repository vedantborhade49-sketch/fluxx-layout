import React, { useRef } from 'react';

interface MagnetProps {
  children: React.ReactElement;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    if (Math.abs(distanceX) < width / 2 + padding && Math.abs(distanceY) < height / 2 + padding) {
      ref.current.style.transform = `translate3d(${distanceX / strength}px, ${distanceY / strength}px, 0)`;
      ref.current.style.transition = activeTransition;
    } else {
      ref.current.style.transform = `translate3d(0px, 0px, 0)`;
      ref.current.style.transition = inactiveTransition;
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = `translate3d(0px, 0px, 0)`;
      ref.current.style.transition = inactiveTransition;
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};
