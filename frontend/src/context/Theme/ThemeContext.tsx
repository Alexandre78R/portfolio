import React, { createContext, useState, useContext, useMemo, useEffect, ReactNode } from 'react';
import themes from './themes';

interface ThemeContextType {
  theme: string;
  toggleTheme: (newtheme  : string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}



export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('dark');

  
  
  const setColorVarCSS = (newtheme : any) => {
    document.documentElement.style.setProperty('--primary-color', themes[newtheme].colors.primary);
    document.documentElement.style.setProperty('--secondary-color', themes[newtheme].colors.secondary);
    document.documentElement.style.setProperty('--scrollHandle-color', themes[newtheme].colors.scrollHandle);
    document.documentElement.style.setProperty('--scrollHandleHover-color', themes[newtheme].colors.scrollHandleHover);
    document.documentElement.style.setProperty('--body-color', themes[newtheme].colors.body);
    document.documentElement.style.setProperty('--grey-color', themes[newtheme].colors.grey);
    document.documentElement.style.setProperty('--placeholder-color', themes[newtheme].colors.placeholder);
    document.documentElement.style.setProperty('--text-color', themes[newtheme].colors.text.default);
    document.documentElement.style.setProperty('--text100-color', themes[newtheme].colors.text[100]);
    document.documentElement.style.setProperty('--text200-color', themes[newtheme].colors.text[200]);
    document.documentElement.style.setProperty('--text300-color', themes[newtheme].colors.text[300]);
    document.documentElement.style.setProperty('--success-color', themes[newtheme].colors.success);
    document.documentElement.style.setProperty('--error-color', themes[newtheme].colors.error);
    document.documentElement.style.setProperty('--warn-color', themes[newtheme].colors.warn);
    document.documentElement.style.setProperty('--info-color', themes[newtheme].colors.info);
  }
  const toggleTheme = (newtheme  : string) => {
    console.log("newTheme", newtheme)
    setColorVarCSS(newtheme);
    setTheme(newtheme);
    localStorage.setItem("theme", newtheme);
  };

  const verifyThemeExist = (newTheme : string) => {
    let themeExist = false;
    for (const key in themes) {
      if(themes[key].name === newTheme) {
        themeExist = true;
      }
    }
    return themeExist;
  }

  useEffect(() => {
    const checkThemeLocalStorage = localStorage.getItem("theme");
    if (checkThemeLocalStorage) {
      const verifyTheme = verifyThemeExist(checkThemeLocalStorage)
      if (verifyTheme) {
        toggleTheme(checkThemeLocalStorage) 
      } else {
        localStorage.setItem("theme", theme);
      }
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [])
  
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};