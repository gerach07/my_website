'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  tagline: string;
  situation: string;
  task: string;
  action: string[];
  result: {
    metric: string;
    label: string;
    suffix: string;
  };
  github: string;
  demo: string;
}

const STAR_STEPS = ['SITUATION', 'TASK', 'ACTION', 'RESULT'];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [step, setStep] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="brutal-card bg-[#1A1A1A]/50 backdrop-blur-md p-8 min-h-[500px] flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-black text-[#FFFD00]">{project.title}</h3>
          <p className="text-gray-400 text-sm font-mono uppercase tracking-widest">{project.tagline}</p>
        </div>
        <div className="flex gap-4">
          <a href={project.github} target="_blank" className="text-xs font-bold underline hover:text-[#FFFD00]">GITHUB</a>
          <a href={project.demo} target="_blank" className="text-xs font-bold underline hover:text-[#FFFD00]">LIVE DEMO</a>
        </div>
      </div>

      {/* Scrubbar / Progress Bar */}
      <div className="flex gap-2 mb-8">
        {STAR_STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className="flex-1 group"
          >
            <div className={`h-1 mb-2 transition-colors duration-300 ${i <= step ? 'bg-[#FFFD00]' : 'bg-[#2A2A2A]'}`} />
            <span className={`text-[10px] font-black transition-colors ${i === step ? 'text-white' : 'text-gray-500'}`}>
              {s}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="space-y-6"
          >
            {step === 0 && (
              <div className="space-y-4">
                <span className="text-xs font-mono text-gray-500">01 // THE CHALLENGE</span>
                <p className="text-xl leading-relaxed">{project.situation}</p>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <span className="text-xs font-mono text-gray-500">02 // THE MISSION</span>
                <p className="text-xl leading-relaxed">{project.task}</p>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <span className="text-xs font-mono text-gray-500">03 // EXECUTION</span>
                <ul className="space-y-3">
                  {project.action.map((act, i) => (
                    <li key={i} className="flex gap-3 text-lg">
                      <span className="text-[#FFFD00]">▸</span>
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                <span className="text-xs font-mono text-gray-500">04 // OUTCOME</span>
                <div className="text-7xl font-black text-[#FFFD00]">
                  <Counter value={parseInt(project.result.metric)} suffix={project.result.suffix} />
                  {project.result.suffix}
                </div>
                <p className="text-2xl font-bold uppercase tracking-tighter">{project.result.label}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex justify-between items-center">
        <button 
          onClick={() => setStep((s) => (s + 1) % 4)}
          className="text-xs font-black bg-[#2A2A2A] px-4 py-2 hover:bg-[#FFFD00] hover:text-black transition-colors"
        >
          NEXT STEP →
        </button>
      </div>
    </div>
  );
}
