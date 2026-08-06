import React from 'react';
import { FadeIn } from '../FadeIn';
import { Magnet } from '../Magnet';
import { ContactButton } from '../ContactButton';

export const HeroSection: React.FC = () => {
  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full shrink-0">
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {["Overview", "Technology", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Central Content */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full relative z-10">
        <FadeIn delay={0.15} y={40} className="w-full flex justify-center">
          <h1 className="metallic-text font-black uppercase tracking-tight leading-none whitespace-nowrap text-[16vw] sm:text-[17vw] md:text-[18vw] lg:text-[19vw] text-center drop-shadow-2xl">
            FLUXX
          </h1>
        </FadeIn>
        <FadeIn delay={0.25} y={40} className="z-20 -mt-2 sm:-mt-4 md:-mt-6">
          <h2 className="text-[#D7E2EA] font-medium uppercase tracking-widest text-[0.6rem] sm:text-xs md:text-lg lg:text-xl text-center opacity-90 drop-shadow-lg">
            Autonomous Environmental Intelligence Platform
          </h2>
        </FadeIn>

        {/* Hero Portrait */}
        <FadeIn delay={0.6} y={30} className="mt-2 sm:mt-4 md:mt-6 z-10 w-full flex justify-center">
          <Magnet padding={100} strength={3}>
            <img
              src="/vtol.svg"
              alt="Fluxx VTOL Aircraft"
              className="w-[450px] sm:w-[650px] md:w-[900px] lg:w-[1200px] xl:w-[1500px] object-contain pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            />
          </Magnet>
        </FadeIn>

        <FadeIn delay={0.5} y={20} className="mt-2 sm:mt-4 z-20">
          <ContactButton />
        </FadeIn>
      </div>

      {/* Bottom Scrolling Marquee */}
      <div className="w-full border-y-2 border-[#FF0000]/40 py-4 sm:py-5 overflow-hidden relative z-20 bg-[#1A0000] backdrop-blur-md shrink-0">
        <FadeIn delay={0.35} y={20}>
          <div className="animate-marquee-scroll whitespace-nowrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <p className="text-[#FF0000] font-bold uppercase tracking-widest text-sm sm:text-base md:text-lg lg:text-xl px-6 drop-shadow-md">
                  Transforming city-wide environmental monitoring through autonomous VTOL missions, intelligent sensor data collection, and AI-powered environmental insights.
                </p>
                <span className="mx-10 text-[#FF0000]/50 text-xl">•</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
