import { Suspense } from 'react';
import Hero from '@/components/hero/Hero';
import ChatAgent from '@/components/agent/ChatAgent';
import ProjectsSection from '@/components/projects/ProjectsSection';
import TechStack from '@/components/tech/TechStack';
import { UIProvider } from '@/context/UIContext';

export default function Home() {
  return (
    <UIProvider>
      <div className="flex flex-col w-full">
        {/* Hero Section - Kinetic Typography & High Impact */}
        <Hero />
        
        {/* Agentic About Me - Gemini Powered Interface */}
        <Suspense fallback={
          <section className="py-24 px-6 lg:px-12 bg-[#121212] border-t border-[#2A2A2A]">
            <div className="max-w-4xl mx-auto h-[500px] brutal-card animate-pulse bg-[#1A1A1A]" />
          </section>
        }>
          <ChatAgent />
        </Suspense>

        {/* Dynamic Tech Stack - Neural Map Visualization */}
        <TechStack />

        {/* STAR Case Studies - Interactive Project Gallery */}
        <ProjectsSection />
        
        {/* Footer / Contact Placeholder */}
        <footer className="py-24 px-6 lg:px-12 border-t border-[#2A2A2A] text-center">
          <p className="text-[#2A2A2A] text-9xl font-black opacity-20 select-none">
            END OF TRANSMISSION
          </p>
        </footer>
      </div>
    </UIProvider>
  );
}
