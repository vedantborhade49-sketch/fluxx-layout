import React from 'react';
import { FadeIn } from '../FadeIn';
import { Magnet } from '../Magnet';
import { ContactButton } from '../ContactButton';

export const HeroSection: React.FC = () => {
  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full">
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

      {/* Hero Heading */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5 text-center">
            FLUXX
          </h1>
        </FadeIn>
        <FadeIn delay={0.25} y={40}>
          <h2 className="text-[#D7E2EA] font-light uppercase tracking-widest text-xs sm:text-sm md:text-xl lg:text-2xl text-center mt-2 md:mt-4 opacity-80">
            Autonomous Environmental Intelligence Platform
          </h2>
        </FadeIn>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[clamp(0.6rem,1.2vw,1.2rem)] max-w-[200px] sm:max-w-[280px] md:max-w-[340px]">
            Transforming city-wide environmental monitoring through autonomous VTOL missions, intelligent sensor data collection, and AI-powered environmental insights.
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Hero Portrait */}
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <Magnet padding={150} strength={3}>
          <img
            src="/vtol.svg"
            alt="Fluxx VTOL Aircraft"
            className="w-[360px] sm:w-[460px] md:w-[540px] lg:w-[640px] object-contain pointer-events-none drop-shadow-2xl"
          />
        </Magnet>
      </FadeIn>
    </section>
  );
};
