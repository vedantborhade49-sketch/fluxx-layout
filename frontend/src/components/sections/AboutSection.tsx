import React from 'react';
import { FadeIn } from '../FadeIn';
import { AnimatedText } from '../AnimatedText';

interface AboutSectionProps {
  onLaunchPlatform?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLaunchPlatform }) => {
  return (
    <section id="technology" className="min-h-screen relative flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden bg-[#050505]">
      
      {/* Content */}
      <div className="flex flex-col items-center text-center relative z-20">
        <FadeIn delay={0} y={40}>
          <h2 className="metallic-text font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,120px)] mb-6 sm:mb-10">
            Intelligent Scale
          </h2>
        </FadeIn>

        <div className="max-w-[700px] mb-12 sm:mb-16 md:mb-20 text-[clamp(0.9rem,1.5vw,1.25rem)] font-light leading-relaxed text-[#D7E2EA] drop-shadow-md">
          <AnimatedText text="FLUXX networks deploy seamlessly across urban environments, continuously gathering real-time telemetry to build a comprehensive digital twin of your city's atmosphere. We do not just collect data; we engineer environmental foresight." />
        </div>

        <FadeIn delay={0.4} y={20}>
          <button 
            onClick={onLaunchPlatform}
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-[#00F0FF] hover:text-black hover:border-[#00F0FF] transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            Launch Intelligence Platform →
          </button>
        </FadeIn>
      </div>
    </section>
  );
};
