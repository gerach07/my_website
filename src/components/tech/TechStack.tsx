'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { techStack, TechItem } from '@/data/tech-stack';

const CATEGORIES = [
  { id: 'frontend', label: 'FRONTEND', color: '#FFFD00' },
  { id: 'backend', label: 'BACKEND', color: '#00FF41' },
  { id: 'ai', label: 'AI/ML', color: '#00F0FF' },
  { id: 'tools', label: 'DEVOPS', color: '#FF00F5' }
];

export default function TechStack() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-calculate positions only on the client to avoid hydration mismatch
  const nodePositions = useMemo(() => {
    if (!mounted) return [];
    
    return techStack.map((tech) => {
      const catIndex = CATEGORIES.findIndex(c => c.id === tech.category);
      const angle = (catIndex / CATEGORIES.length) * Math.PI * 2;
      const radius = 200 + (Math.random() * 100);
      return {
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: Math.sin(angle) * radius + (Math.random() - 0.5) * 100
      };
    });
  }, [mounted]);

  if (!mounted) {
    return (
      <section className="py-24 px-6 lg:px-12 border-t border-[#2A2A2A] bg-[#121212] min-h-[800px]">
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 opacity-20">
            TECH NEURAL MAP
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 lg:px-12 border-t border-[#2A2A2A] relative overflow-hidden bg-[#121212]">
      <div className="max-w-6xl mx-auto mb-16 relative z-10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          TECH <span className="text-[#00FF41]">NEURAL</span> MAP
        </h2>
        
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
              className="px-6 py-2 border-2 border-[#2A2A2A] font-mono text-xs font-bold hover:bg-[#2A2A2A] transition-all"
              style={{ borderColor: activeCategory === cat.id ? cat.color : '#2A2A2A' }}
            >
              [{cat.label}]
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-[600px] w-full flex items-center justify-center cursor-crosshair"
      >
        {/* Neural Connections SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <AnimatePresence>
            {activeCategory && techStack
              .filter(t => t.category === activeCategory)
              .map((t, i) => {
                const originalIndex = techStack.indexOf(t);
                const pos = nodePositions[originalIndex];
                if (!pos) return null;

                return (
                  <motion.line
                    key={`${activeCategory}-${t.name}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${pos.x}px)`}
                    y2={`calc(50% + ${pos.y}px)`}
                    stroke={CATEGORIES.find(c => c.id === activeCategory)?.color}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}
          </AnimatePresence>
        </svg>

        {/* Central Core */}
        <div className="absolute w-12 h-12 bg-white rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="absolute font-mono text-[10px] text-gray-500 tracking-widest">CORE_STACK</div>

        {/* Tech Nodes */}
        {techStack.map((tech, i) => {
          const pos = nodePositions[i];
          if (!pos) return null;
          
          const isActive = activeCategory === tech.category;
          
          return (
            <motion.div
              key={tech.name}
              initial={pos}
              animate={{
                x: isActive ? pos.x * 0.8 : pos.x,
                y: isActive ? pos.y * 0.8 : pos.y,
                scale: isActive ? 1.2 : 1,
                filter: isActive ? 'brightness(1.5)' : 'brightness(1)',
              }}
              whileHover={{ scale: 1.3, zIndex: 50 }}
              onClick={() => setSelectedTech(tech)}
              className="absolute p-3 brutal-card bg-[#1A1A1A] cursor-pointer group"
              style={{ 
                borderColor: isActive ? CATEGORIES.find(c => c.id === tech.category)?.color : '#2A2A2A',
                boxShadow: isActive ? `4px 4px 0px ${CATEGORIES.find(c => c.id === tech.category)?.color}` : '4px 4px 0px #2A2A2A'
              }}
            >
              <div className="font-mono text-[10px] font-bold">
                {tech.name}
                <div className="h-1 bg-[#2A2A2A] mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-current" 
                    initial={{ width: 0 }}
                    animate={{ width: `${tech.weight * 10}%` }}
                    style={{ backgroundColor: CATEGORIES.find(c => c.id === tech.category)?.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Mini-Modal Overlay */}
        <AnimatePresence>
          {selectedTech && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-[100] inset-0 flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="brutal-card bg-[#1A1A1A] p-8 max-w-md pointer-events-auto relative shadow-[20px_20px_0px_rgba(0,0,0,0.5)]">
                <button 
                  onClick={() => setSelectedTech(null)}
                  className="absolute top-4 right-4 font-mono text-xs hover:text-[#FFFD00]"
                >
                  [X] CLOSE
                </button>
                <div className="text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-tighter">
                  Deep Dive // {selectedTech.category}
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase">{selectedTech.name}</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
                  {selectedTech.description}
                </p>
                <div className="border-t border-[#2A2A2A] pt-4 flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#00FF41]">EXPERTISE_LEVEL: {selectedTech.weight}/10</span>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-1 h-3 ${i < selectedTech.weight ? 'bg-[#00FF41]' : 'bg-[#2A2A2A]'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Micro-interaction */}
      <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none font-mono text-[200px] font-black leading-none select-none">
        STACK
      </div>
    </section>
  );
}
