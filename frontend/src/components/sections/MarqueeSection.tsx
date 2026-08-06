import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
  "/d1.png",
  "/d2.png",
  "/d3.png",
  "/d4.png",
  "/d5.png"
];

// Create a distinctly different order for the second row so they don't match up
const row1 = [...images];
const row2 = [
  "/d3.png",
  "/d5.png",
  "/d2.png",
  "/d4.png",
  "/d1.png"
];

// Multiply the arrays to ensure seamless scrolling across ultra-wide monitors
// Using 10x multiplication so they never run out
const renderRow1 = Array(10).fill(row1).flat();
const renderRow2 = Array(10).fill(row2).flat();

export const MarqueeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // By starting at -3000px, the row has thousands of pixels of images off-screen to the left.
  // As the user scrolls down, x1 increases (moving right), revealing the off-screen left images.
  // x2 decreases (moving left), revealing the off-screen right images.
  const x1 = useTransform(scrollYProgress, [0, 1], [-3000, -1500]); // Moves RIGHT
  const x2 = useTransform(scrollYProgress, [0, 1], [-1500, -3000]); // Moves LEFT

  return (
    <section ref={containerRef} className="bg-[#050505] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-4 relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#00D0FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Row 1 */}
      <motion.div 
        className="flex gap-4 w-max"
        style={{ x: x1, willChange: 'transform' }}
      >
        {renderRow1.map((src, i) => (
          <div key={`r1-${i}`} className="relative group shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-[#111]">
            <img 
              src={src} 
              alt="Mission preview" 
              className="w-[300px] h-[200px] sm:w-[380px] sm:h-[240px] md:w-[460px] md:h-[280px] object-cover shrink-0 brightness-110 group-hover:brightness-125 group-hover:scale-105 transition-all duration-500" 
              loading="lazy" 
            />
            {/* Subtle Overlay to match dark theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </motion.div>
      
      {/* Row 2 */}
      <motion.div 
        className="flex gap-4 w-max"
        style={{ x: x2, willChange: 'transform' }}
      >
        {renderRow2.map((src, i) => (
          <div key={`r2-${i}`} className="relative group shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-[#111]">
            <img 
              src={src} 
              alt="Mission preview" 
              className="w-[300px] h-[200px] sm:w-[380px] sm:h-[240px] md:w-[460px] md:h-[280px] object-cover shrink-0 brightness-110 group-hover:brightness-125 group-hover:scale-105 transition-all duration-500" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
