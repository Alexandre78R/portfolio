import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";

interface ChoiceVieContextType {
  selectedView: string;
  setSelectedView: (view: string) => void;
}

interface ChoiceViewProviderProps {
  children: ReactNode;
}

const ChoiceViewContext = createContext<ChoiceVieContextType | undefined>(
  undefined
);

export const ChoiceViewProvider: React.FC<ChoiceViewProviderProps> = ({
  children,
}): React.ReactElement => {
  const [selectedView, setSelectedView]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("text");
  const [checkSelectedView, setCheckSelectedView]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  useEffect(() => {
    const checkChoiceViewLocalStorage: string | null =
      localStorage.getItem("voiceView");
    if (typeof checkChoiceViewLocalStorage === "string" && !checkSelectedView) {
      if (
        checkChoiceViewLocalStorage == "terminal" ||
        checkChoiceViewLocalStorage == "text"
      ) {
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
  }, [selectedView]);

  const value: ChoiceVieContextType = useMemo(
    () => ({
      selectedView,
      setSelectedView,
    }),
    [selectedView]
  );

  return (
    <ChoiceViewContext.Provider value={value}>
      {children}
    </ChoiceViewContext.Provider>
  );
};

export const useChoiceView = (): ChoiceVieContextType => {
  const context = useContext(ChoiceViewContext);
  if (!context) {
    throw new Error("useChoiceView must be used within a ChoiceViewProvider");
  }
  return context;
};
