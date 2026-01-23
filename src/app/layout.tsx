import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import Script from 'next/script';
import projects from '@/data/projects.json';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Prefer an explicit deployment/base URL. Use NEXT_PUBLIC_BASE_URL if provided,
// otherwise fall back to Vercel's `VERCEL_URL` (adds https://) or the existing domain.
const _baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://adrians.website');

export const metadata: Metadata = {
  metadataBase: new URL(_baseUrl),
  title: 'Adrian S. | Senior Full-Stack Web Architect (Next.js 15 & AI Expert)',
  description: 'Specializing in agentic architectures, performance-driven systems, and 2026 design trends. Full-Stack Developer for hire with expertise in React, Rust, and Gemini AI integration.',
  keywords: [
    'Full-Stack Developer for hire', 
    'Next.js 15 Expert', 
    'AI Integration Specialist', 
    'Agentic UI Architect', 
    'Senior Web Engineer 2026',
    'Performance Optimized Web Apps'
  ],
  authors: [{ name: 'Adrian S.' }],
  openGraph: {
    title: 'Adrian S. | Senior Full-Stack Web Architect',
    description: 'Expert in Next.js 15, Rust, and AI-driven web systems.',
    url: 'https://adrians.website',
    siteName: 'Adrian S. Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adrian S. | Senior Full-Stack Web Architect',
    description: 'Agentic, Performance-driven Programmer Portfolio',
    creator: '@adrian_dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adrian S.',
    jobTitle: 'Senior Full-Stack Web Architect',
    url: 'https://adrians.website',
    sameAs: [
      'https://github.com/adrian-dev',
      'https://linkedin.com/in/adrian-dev'
    ],
    knowsAbout: ['Next.js', 'React', 'Rust', 'AI Integration', 'Agentic UI', 'Performance Optimization'],
  };

  const projectJsonLd = projects.map(project => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.tagline,
    codeRepository: project.github,
    programmingLanguage: ['TypeScript', 'Next.js', 'Rust'],
    author: {
      '@type': 'Person',
      name: 'Adrian S.'
    }
  }));

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Script
          id="projects-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
        />
      </head>
      <body className="bg-[#121212] text-[#E0E0E0] antialiased selection:bg-[#FFFD00] selection:text-black">
        <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <main className="min-h-screen border-x border-[#2A2A2A] mx-auto max-w-[1600px] relative">
          {children}
        </main>
      </body>
    </html>
  );
}
