import React, { createContext, useState, useContext, useMemo, useEffect, ReactNode } from 'react';

interface ChoiceVieContextType {
  selectedView: string,
  setSelectedView: (view: string) => void,
}

interface ChoiceViewProviderProps {
  children: ReactNode;
}

const ChoiceViewContext = createContext<ChoiceVieContextType | undefined>(undefined);

export const ChoiceViewProvider: React.FC<ChoiceViewProviderProps> = ({ children }) => {
  const [selectedView, setSelectedView] = useState<string>("text");
  const [checkSelectedView, setCheckSelectedView] = useState<boolean>(false);
  
  useEffect(() => {
    const checkChoiceViewLocalStorage: string | null = localStorage.getItem("voiceView");
    if (typeof checkChoiceViewLocalStorage === "string" && !checkSelectedView) {
      if (checkChoiceViewLocalStorage == "terminal" || checkChoiceViewLocalStorage == "text") {
        setSelectedView(checkChoiceViewLocalStorage);
        localStorage.setItem("voiceView", checkChoiceViewLocalStorage);
      } else {
        setSelectedView(checkChoiceViewLocalStorage);
        localStorage.setItem("voiceView", selectedView);
      }
      setCheckSelectedView(true);
    } else {
      localStorage.setItem("voiceView", selectedView);
    }
  }, [selectedView])

  const value = useMemo(() => ({
    selectedView,
    setSelectedView,
  }), [selectedView]);

  return (
    <ChoiceViewContext.Provider value={value}>
      {children}
    </ChoiceViewContext.Provider>
  );
};

export const useChoiceView = () => {
  const context = useContext(ChoiceViewContext);
  if (!context) {
    throw new Error('useChoiceView must be used within a ChoiceViewProvider');
  }
  return context;
};