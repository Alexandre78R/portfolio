import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { useGetThemesListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import defaultThemes, {
  ThemeColorsText,
  ThemeColors,
  Theme,
} from "./themes";

/* =======================
   Types
======================= */

export type ThemeKey = string;

export interface ThemeContextType {
  theme: ThemeKey;
  toggleTheme: (newTheme: ThemeKey) => void;
  themes: Record<string, Theme>;
  loading: boolean;
  error: boolean;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* =======================
   Fallback (STATIC)
   ⚠️ utilisé UNIQUEMENT
   si erreur réseau
======================= */

const getDefaultThemes = (): Record<string, Theme> => {
  const themesObject: Record<string, Theme> = {};

  Object.entries(defaultThemes).forEach(([key, themeData]) => {
    themesObject[key] = {
      id: themeData.id,
      name: themeData.name,
      nameEN: themeData.nameEN,
      nameFR: themeData.nameFR,
      visible: true,
      colors: {
        ...themeData.colors,
        text: themeData.colors.text,
      },
    };
  });

  return themesObject;
};

/* =======================
   Provider
======================= */

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [themes, setThemes] = useState<Record<string, Theme>>({});
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  const { data, loading, error } = useGetThemesListQuery({
    fetchPolicy: "cache-and-network",
  });
  console.log("data", data);

  /* =======================
     Sync themes from backend
  ======================= */

  useEffect(() => {
    // ❌ Erreur réseau → fallback
    if (error || !data?.themeList?.themes) {
      console.warn("[ThemeContext] Using fallback themes");
      setThemes(getDefaultThemes());
      setIsUsingFallback(true);
      return;
    }

    const themesData = data.themeList.themes;

    const visibleThemes = themesData.filter(
      (t): t is NonNullable<typeof t> => !!t && t.visible === true
    );

    // ✅ 0 thème en BDD = 0 thème en frontend
    if (visibleThemes.length === 0) {
      setThemes({});
      setIsUsingFallback(false);
      return;
    }

    const themesObject: Record<string, Theme> = {};

    visibleThemes.forEach((themeData) => {
      themesObject[themeData.name] = {
        id: themeData.id,
        name: themeData.name,
        nameEN: themeData.nameEN ?? themeData.name,
        nameFR: themeData.nameFR ?? themeData.name,
        visible: themeData.visible,
        colors: {
          primary: themeData.primary,
          secondary: themeData.secondary,
          scrollHandle: themeData.scrollHandle,
          scrollHandleHover: themeData.scrollHandleHover,
          body: themeData.body,
          grey: themeData.grey,
          placeholder: themeData.placeholder,
          success: themeData.success,
          error: themeData.error,
          warn: themeData.warn,
          info: themeData.info,
          admin: themeData.admin,
          footer: themeData.footer,
          text: {
            default: themeData.textDefault,
            100: themeData.text100,
            200: themeData.text200,
            300: themeData.text300,
            button: themeData.textButton,
          },
        },
      };
    });

    setThemes(themesObject);
    setIsUsingFallback(false);
  }, [data, error]);

  /* =======================
     Apply CSS variables
  ======================= */

  const setColorVarCSS = (newTheme: ThemeKey): void => {
    const themeData = themes[newTheme];
    if (!themeData) return;

    const colors: ThemeColors = themeData.colors;
    const colorText: ThemeColorsText = themeData.colors.text;

    Object.entries(colors).forEach(([name, value]) => {
      if (name !== "text") {
        document.documentElement.style.setProperty(
          `--${name}-color`,
          value
        );
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

  /* =======================
     Toggle theme
  ======================= */

  const toggleTheme = (newTheme: ThemeKey): void => {
    if (!themes[newTheme]) {
      console.warn(`[ThemeContext] Theme "${newTheme}" not found`);
      return;
    }

    setColorVarCSS(newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  /* =======================
     Init theme on load
  ======================= */

  useEffect(() => {
    if (Object.keys(themes).length === 0) return;

    const storedTheme = localStorage.getItem("theme");

    if (storedTheme && themes[storedTheme]) {
      toggleTheme(storedTheme);
    } else {
      const firstTheme = Object.keys(themes)[0];
      toggleTheme(firstTheme);
    }
  }, [themes]);

  /* =======================
     Memo
  ======================= */

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      themes,
      loading,
      error: !!error && !isUsingFallback,
    }),
    [theme, themes, loading, error, isUsingFallback]
  );

  if (loading && Object.keys(themes).length === 0) {
    return <LoadingCustom />;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/* =======================
   Hook
======================= */

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

/* =======================
   Helpers
======================= */

export const getVisibleThemes = (themes: Record<string, Theme>): Theme[] =>
  Object.values(themes).filter((theme) => theme.visible);

export const getThemeNames = (themes: Record<string, Theme>): string[] =>
  Object.keys(themes);