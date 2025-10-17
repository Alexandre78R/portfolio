import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import themes, { ThemeColors, ThemeColorsText } from "./themes";

export type ThemeKey = keyof typeof themes;

export type ThemeContextObject = { theme: string };

export interface ThemeContextType {
  theme: ThemeKey;
  toggleTheme: (newTheme: ThemeKey) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeKey>("dark");

  const setColorVarCSS = (newTheme: ThemeKey) => {
    const colors: ThemeColors = themes[newTheme].colors;
    const colorText: ThemeColorsText = themes[newTheme].colors.text;

    Object.entries(colors).forEach(([name, value]) => {
      if (name !== "text") {
        document.documentElement.style.setProperty(`--${name}-color`, value);
      }
    });

    Object.entries(colorText).forEach(([name, value]) => {
      const cssVar =
        name === "button"
          ? "--textButton-color"
          : name !== "default"
          ? `--text${name}-color`
          : "--text-color";
      document.documentElement.style.setProperty(cssVar, value);
    });
  };

  const toggleTheme = (newTheme: ThemeKey) => {
    setColorVarCSS(newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); 
  };

  const verifyThemeExist = (newTheme: string): newTheme is ThemeKey => {
    return newTheme in themes;
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme && verifyThemeExist(localTheme)) {
      toggleTheme(localTheme);
    } else {
      localStorage.setItem("theme", theme);
    }
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook pour utiliser le context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};