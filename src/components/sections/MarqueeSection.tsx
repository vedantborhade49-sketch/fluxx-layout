import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];

const row1 = images.slice(0, 11);
const row2 = images.slice(11);

// Triple the arrays for seamless scrolling
const renderRow1 = [...row1, ...row1, ...row1];
const renderRow2 = [...row2, ...row2, ...row2];

export const MarqueeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Calculate scroll offset as specified: (scrollY - sectionTop + windowHeight) * 0.3
  // Since useScroll gives 0 to 1 based on intersection, we map it to px values.
  // Instead of manual offset calculation, we can just map the progress 0-1 to a wide pixel range.
  // For a smooth effect, mapping 0 to 1 -> -500 to 500 (adjust as needed).
  const x1 = useTransform(scrollYProgress, [0, 1], [-200, 800]); // Moves RIGHT
  const x2 = useTransform(scrollYProgress, [0, 1], [200, -800]); // Moves LEFT

  return (
    <section ref={containerRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3">
      {/* Row 1 */}
      <motion.div 
        className="flex gap-3 w-max"
        style={{ x: x1, willChange: 'transform' }}
      >
        {renderRow1.map((src, i) => (
          <img 
            key={`r1-${i}`} 
            src={src} 
            alt="Work preview" 
            className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0" 
            loading="lazy" 
          />
        ))}
      </motion.div>
      
      {/* Row 2 */}
      <motion.div 
        className="flex gap-3 w-max"
        style={{ x: x2, willChange: 'transform' }}
      >
        {renderRow2.map((src, i) => (
          <img 
            key={`r2-${i}`} 
            src={src} 
            alt="Work preview" 
            className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0" 
            loading="lazy" 
          />
        ))}
      </motion.div>
    </section>
  );
};
