import React, { createContext, useContext, useRef, RefObject, useMemo } from 'react';

type SectionRefsContextProps = {
  aboutMeRef: RefObject<HTMLDivElement>;
  projectRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  skillRef: RefObject<HTMLDivElement>;
  choiceViewRef: RefObject<HTMLDivElement>;
  terminalRef: RefObject<HTMLDivElement>;
  educationRef: RefObject<HTMLDivElement>;
}

const SectionRefsContext = createContext<SectionRefsContextProps | undefined>(undefined);

export const SectionRefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const choiceViewRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  const value: SectionRefsContextProps = useMemo(() => ({ aboutMeRef, projectRef, headerRef, skillRef, choiceViewRef, terminalRef, educationRef }), []);

  return (
    <SectionRefsContext.Provider value={value}>
      {children}
    </SectionRefsContext.Provider>
  );
};

export const useSectionRefs = (): SectionRefsContextProps => {
  const context = useContext(SectionRefsContext);
  if (context === undefined) {
    throw new Error('useSectionRefs must be used within a SectionRefsProvider');
  }
  return context;
};