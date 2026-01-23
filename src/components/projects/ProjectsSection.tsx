'use client';

import { useEffect } from 'react';
import projects from '@/data/projects.json';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/context/UIContext';

export default function ProjectsSection() {
  const { selectedProjectSlug } = useUI();

  useEffect(() => {
    if (selectedProjectSlug) {
      const element = document.getElementById(selectedProjectSlug);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedProjectSlug]);

  return (
    <section id="projects" className="py-24 px-6 lg:px-12 border-t border-[#2A2A2A]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tighter"
            >
              SELECTED <br />
              <span className="text-[#FFFD00]">CASE STUDIES</span>
            </motion.h2>
            <p className="mt-4 text-gray-400 font-mono text-sm uppercase tracking-widest">
              Proven results using the STAR methodology
            </p>
          </div>
          
          <div className="hidden md:block text-right">
            <span className="text-8xl font-black text-[#2A2A2A] leading-none select-none">
              02
            </span>
          </div>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {projects.map((project, index) => {
            const slug = project.title.toLowerCase().replace(/\s+/g, '-');
            const isActive = selectedProjectSlug === slug;

            return (
              <motion.div
                key={project.id}
                id={slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'
                } relative`}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute -inset-1 border-2 border-[#00FF41] z-10 pointer-events-none blur-[2px]"
                      style={{ boxShadow: '0 0 15px #00FF41' }}
                    />
                  )}
                </AnimatePresence>
                <ProjectCard project={project} />
              </motion.div>
            );
          })}
          
          {/* Bento "Empty" Info Card */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-12 brutal-card bg-[#121212] border-dashed border-2 border-[#2A2A2A] p-12 flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <div className="text-3xl font-black text-gray-600 group-hover:text-[#FFFD00] transition-colors">
              VIEW ALL CONTRIBUTIONS ON GITHUB
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
