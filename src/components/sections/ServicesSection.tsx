import React from 'react';
import { FadeIn } from '../FadeIn';

const services = [
  {
    num: "01",
    title: "3D Modeling",
    desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations."
  },
  {
    num: "02",
    title: "Rendering",
    desc: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life."
  },
  {
    num: "03",
    title: "Motion Design",
    desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."
  },
  {
    num: "04",
    title: "Branding",
    desc: "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence."
  },
  {
    num: "05",
    title: "Web Design",
    desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
      <FadeIn delay={0}>
        <h2 className="font-black uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20 md:mb-28">
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto flex flex-col">
        {services.map((service, i) => (
          <FadeIn key={service.num} delay={i * 0.1}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-8 sm:py-10 md:py-12 border-b-[1px] border-[rgba(12,12,12,0.15)] last:border-b-0 gap-6 sm:gap-10">
              <span className="font-black text-[clamp(3rem,10vw,140px)] leading-none shrink-0 w-24 sm:w-32 md:w-48 text-[#0C0C0C]">
                {service.num}
              </span>
              <div className="flex flex-col gap-3 sm:gap-4 flex-1 sm:pt-2 md:pt-4">
                <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)]">
                  {service.title}
                </h3>
                <p className="font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60">
                  {service.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
