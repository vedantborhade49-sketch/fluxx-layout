import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LiveProjectButton } from '../LiveProjectButton';
import { FadeIn } from '../FadeIn';

const projects = [
  {
    num: "01",
    client: "Client",
    name: "Nextlevel Studio",
    images: {
      col1top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      col1bot: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
    }
  },
  {
    num: "02",
    client: "Personal",
    name: "Aura Brand Identity",
    images: {
      col1top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      col1bot: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
    }
  },
  {
    num: "03",
    client: "Client",
    name: "Solaris Digital",
    images: {
      col1top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      col1bot: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
    }
  }
];

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Calculate target scale for sticking cards behind each other
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  
  return (
    <div 
      className="sticky top-24 md:top-32 h-[85vh] w-full flex items-center justify-center"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.div 
        ref={cardRef}
        className="w-full max-w-7xl mx-auto rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 md:gap-8 origin-top"
        style={{
          scale: targetScale
        }}
      >
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="font-black text-[clamp(2.5rem,8vw,100px)] leading-none text-[#D7E2EA]">
              {project.num}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm md:text-base opacity-70 uppercase tracking-widest">{project.client}</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium uppercase">{project.name}</h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom Row Images */}
        <div className="flex gap-4 sm:gap-6 md:gap-8 h-full">
          {/* Left Column (40%) */}
          <div className="w-[40%] flex flex-col gap-4 sm:gap-6 md:gap-8">
            <img 
              src={project.images.col1top} 
              alt={`${project.name} detail 1`}
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
              loading="lazy"
            />
            <img 
              src={project.images.col1bot} 
              alt={`${project.name} detail 2`}
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] h-full"
              style={{ minHeight: 'clamp(160px, 22vw, 340px)' }}
              loading="lazy"
            />
          </div>
          {/* Right Column (60%) */}
          <div className="w-[60%]">
            <img 
              src={project.images.col2} 
              alt={`${project.name} main`}
              className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const ProjectsSection: React.FC = () => {
  return (
    <section 
      id="projects" 
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-30 relative px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn delay={0}>
        <h2 className="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20 md:mb-24">
          Project
        </h2>
      </FadeIn>

      <div className="relative pb-[20vh]">
        {projects.map((project, i) => (
          <ProjectCard 
            key={project.num} 
            project={project} 
            index={i} 
            totalCards={projects.length} 
          />
        ))}
      </div>
    </section>
  );
};
