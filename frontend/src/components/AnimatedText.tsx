import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="mr-1 relative">
          {word.split('').map((char, j) => {


            // Need a proper relative calculation for text length
            const charProgress = (i * word.length + j) / text.length;
            
            return (
              <span key={j} className="relative inline-block">
                {/* Invisible placeholder for size */}
                <span className="opacity-0">{char}</span>
                {/* Visible animated character */}
                <motion.span
                  className="absolute left-0 top-0 text-[#D7E2EA]"
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [charProgress - 0.1, charProgress + 0.1],
                      [0.2, 1]
                    )
                  }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
};
