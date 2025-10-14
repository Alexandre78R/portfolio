import React, {
  createContext,
  useContext,
  useRef,
  RefObject,
  useMemo,
  ReactNode,
} from "react";

export interface SectionRefsContextProps {
  aboutMeRef: RefObject<HTMLDivElement>;
  projectRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  skillRef: RefObject<HTMLDivElement>;
  terminalRef: RefObject<HTMLDivElement>;
  educationRef: RefObject<HTMLDivElement>;
  contactRef: RefObject<HTMLDivElement>;
}

const SectionRefsContext: React.Context<SectionRefsContextProps | undefined> =
  createContext<SectionRefsContextProps | undefined>(undefined);

export interface SectionRefsProviderProps {
  children: ReactNode;
}

export const SectionRefsProvider: React.FC<SectionRefsProviderProps> = ({
  children,
}): React.ReactElement => {
  const aboutMeRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const projectRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const headerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const skillRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const terminalRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const educationRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const contactRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const value: SectionRefsContextProps = useMemo<SectionRefsContextProps>(
    (): SectionRefsContextProps => ({
      aboutMeRef,
      projectRef,
      headerRef,
      skillRef,
      terminalRef,
      educationRef,
      contactRef,
    }),
    [aboutMeRef, projectRef, headerRef, skillRef, terminalRef, educationRef, contactRef]
  );

  return (
    <SectionRefsContext.Provider value={value}>
      {children}
    </SectionRefsContext.Provider>
  );
};

export const useSectionRefs = (): SectionRefsContextProps => {
  const context: SectionRefsContextProps | undefined =
    useContext<SectionRefsContextProps | undefined>(SectionRefsContext);

  if (context === undefined) {
    throw new Error(
      "useSectionRefs must be used within a SectionRefsProvider"
    );
  }

  return context;
};