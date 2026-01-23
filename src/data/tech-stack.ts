export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'ai' | 'tools';
  weight: number; // 1-10
  description: string;
}

export const techStack: TechItem[] = [
  { name: 'Next.js 15', category: 'frontend', weight: 10, description: 'My primary vehicle for delivery. Expert in Server Components, Streaming, and high-performance routing.' },
  { name: 'React (R3F)', category: 'frontend', weight: 9, description: 'Specializing in bringing 3D interactivity to standard web layouts via React Three Fiber.' },
  { name: 'TypeScript', category: 'frontend', weight: 10, description: 'Total type safety across the full stack is non-negotiable in my workflow.' },
  { name: 'Tailwind CSS', category: 'frontend', weight: 8, description: 'Utilizing utility-first CSS to build accessible, neo-brutalist design systems rapidly.' },
  
  { name: 'Rust', category: 'backend', weight: 10, description: 'My superpower for systems-level performance. Used for high-compute edge functions and low-latency microservices.' },
  { name: 'PostgreSQL', category: 'backend', weight: 9, description: 'Deep expertise in relational modeling, performance tuning, and vector search extensions.' },
  { name: 'Node.js', category: 'backend', weight: 9, description: 'Building scalable, event-driven backends with a focus on type-safe API design.' },
  { name: 'Redis', category: 'backend', weight: 8, description: 'Implementing advanced caching patterns and message queuing for distributed systems.' },
  
  { name: 'Gemini AI', category: 'ai', weight: 10, description: 'Leading expert in integrating Gemini 1.5 into agentic workflows and automated reasoning systems.' },
  { name: 'LangGraph', category: 'ai', weight: 9, description: 'Building complex, multi-agent state machines for autonomous task execution.' },
  { name: 'Vector DBs', category: 'ai', weight: 8, description: 'Architecting retrieval-augmented generation (RAG) systems with precision grounding.' },
  
  { name: 'Vercel Edge', category: 'tools', weight: 9, description: 'Optimizing global latency by pushing compute to the edge, as close to the user as possible.' },
  { name: 'Docker', category: 'tools', weight: 8, description: 'Standardizing environments for consistent deployment across cloud providers.' },
  { name: 'CI/CD', category: 'tools', weight: 9, description: 'Automating the path from code to production with zero-downtime deployment pipelines.' }
];
