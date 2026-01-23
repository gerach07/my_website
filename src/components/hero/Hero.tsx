'use client';

import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load the 3D scene to ensure LCP is not negatively impacted
const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  
  const line1 = "ENGINEERING".split(" ");
  const line2 = "DIGITAL".split(" ");
  const line3 = "EXPERIENCES".split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  } as const;

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 overflow-hidden">
      {/* 3D Scene - Absolute Positioned Background Layer */}
      <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 pointer-events-none">
        <Suspense fallback={null}>
          <HeroScene isHovered={isHoveringCTA} />
        </Suspense>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="z-10 pointer-events-none"
      >
        <motion.h1 
          className="text-7xl md:text-9xl font-black leading-tight tracking-tighter pointer-events-auto"
        >
          <div className="flex flex-wrap">
            {line1.map((w, i) => <span key={i} className="inline-block mr-4 kinetic-text">{w}</span>)}
          </div>
          <div className="flex flex-wrap text-[#FFFD00]">
            {line2.map((w, i) => <span key={i} className="inline-block mr-4 kinetic-text">{w}</span>)}
          </div>
          <div className="flex flex-wrap">
            {line3.map((w, i) => <span key={i} className="inline-block mr-4 kinetic-text">{w}</span>)}
          </div>
        </motion.h1>

        <motion.p 
          variants={item}
          className="mt-8 max-w-xl text-xl md:text-2xl text-gray-400 font-light leading-relaxed pointer-events-auto"
        >
          Specializing in <span className="text-white font-medium italic underline decoration-[#FFFD00] decoration-2">Agentic Architectures</span> and high-performance Web Systems. Built for the 2026 web.
        </motion.p>

        <motion.div variants={item} className="mt-12 flex gap-6 pointer-events-auto">
          <button 
            onMouseEnter={() => setIsHoveringCTA(true)}
            onMouseLeave={() => setIsHoveringCTA(false)}
            className="px-8 py-4 bg-[#FFFD00] text-black font-bold brutal-border hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform active:translate-x-[0px] active:translate-y-[0px]"
          >
            VIEW CASE STUDIES
          </button>
          <button className="px-8 py-4 border-2 border-[#2A2A2A] font-bold hover:bg-[#2A2A2A] transition-colors">
            TALK TO AGENT
          </button>
        </motion.div>
      </motion.div>

      {/* Micro-interaction indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-12 flex items-center gap-4 text-sm text-gray-500 uppercase tracking-widest"
      >
        <div className="w-12 h-[1px] bg-gray-500" />
        <span>Scroll to Explore</span>
      </motion.div>
    </section>
  );
}
