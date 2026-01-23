'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  selectedProjectSlug: string | null;
  openProject: (slug: string) => void;
  closeProject: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  const openProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    // 2026 UX: Scroll to projects if needed or trigger global animation state
    console.log(`UI Action: Highlighting project ${slug}`);
  };

  const closeProject = () => setSelectedProjectSlug(null);

  return (
    <UIContext.Provider value={{ selectedProjectSlug, openProject, closeProject }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
