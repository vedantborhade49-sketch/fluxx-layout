import React from 'react';
import { FadeIn } from '../FadeIn';
import { AnimatedText } from '../AnimatedText';
import { ContactButton } from '../ContactButton';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="min-h-screen relative flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden bg-[#0C0C0C]">
      
      {/* Decorative 3D Images */}
      {/* Top Left */}
      <FadeIn delay={0.1} duration={0.9} x={-80} y={0} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] object-contain"
        />
      </FadeIn>

      {/* Bottom Left */}
      <FadeIn delay={0.25} duration={0.9} x={-80} y={0} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="3D object"
          className="w-[100px] sm:w-[140px] md:w-[180px] object-contain"
        />
      </FadeIn>

      {/* Top Right */}
      <FadeIn delay={0.15} duration={0.9} x={80} y={0} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] object-contain"
        />
      </FadeIn>

      {/* Bottom Right */}
      <FadeIn delay={0.3} duration={0.9} x={80} y={0} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D group"
          className="w-[130px] sm:w-[170px] md:w-[220px] object-contain"
        />
      </FadeIn>

      {/* Content */}
      <div className="flex flex-col items-center text-center relative z-20">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] mb-10 sm:mb-14 md:mb-16">
            About me
          </h2>
        </FadeIn>

        <div className="max-w-[560px] mb-16 sm:mb-20 md:mb-24 text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed">
          <AnimatedText text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" />
        </div>

        <FadeIn delay={0.4} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};
