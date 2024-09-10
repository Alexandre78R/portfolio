import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import themes, { ThemeColors, ThemeColorsText } from "./themes";

type ThemeContextType = {
  theme: keyof typeof themes;
  toggleTheme: (newTheme: string) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}): React.ReactElement => {
  const [theme, setTheme]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("dark");

  const setColorVarCSS = (newTheme: keyof typeof themes): void => {
    const colors: ThemeColors = themes[newTheme].colors;
    const colorText: ThemeColorsText = themes[newTheme].colors.text;
    for (const [name, value] of Object.entries(colors)) {
      if (name !== "text") {
        document.documentElement.style.setProperty(`--${name}-color`, value);
      }
    }
    for (const [name, value] of Object.entries(colorText)) {
      if (name === "button") {
        document.documentElement.style.setProperty(`--textButton-color`, value);
      } else if (name !== "default") {
        document.documentElement.style.setProperty(
          `--text${name}-color`,
          value
        );
      } else {
        document.documentElement.style.setProperty(`--text-color`, value);
      }
    }
  };

  const toggleTheme = (newTheme: string): void => {
    setColorVarCSS(newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const verifyThemeExist = (newTheme: string): boolean => {
    return newTheme in themes;
  };

  useEffect(() => {
    const checkThemeLocalStorage: string | null = localStorage.getItem("theme");
    if (checkThemeLocalStorage) {
      const verifyTheme = verifyThemeExist(checkThemeLocalStorage);
      if (verifyTheme) {
        toggleTheme(checkThemeLocalStorage);
      } else {
        localStorage.setItem("theme", theme);
      }
    } else {
      localStorage.setItem("theme", theme);
    }
  }, []);

  const value: ThemeContextType = useMemo(
    () => ({ theme, toggleTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
