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

const ThemeContext: React.Context<ThemeContextType | undefined> = createContext<ThemeContextType | undefined>(undefined);

const getDefaultThemes: () => Record<string, Theme> = (): Record<string, Theme> => {
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [themes, setThemes] = useState<Record<string, Theme>>({});
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  const { data, loading, error } = useGetThemesListQuery({
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    // ❌ Erreur réseau → fallback
    if (error) {
      console.warn("[ThemeContext] Using fallback themes due to error");
      setThemes(getDefaultThemes());
      setIsUsingFallback(true);
      return;
    }

    // ❌ Pas de données → fallback
    if (!data?.listThemes?.themes) {
      console.warn("[ThemeContext] Using fallback themes - no data");
      setThemes(getDefaultThemes());
      setIsUsingFallback(true);
      return;
    }

    const themesData: NonNullable<typeof data.listThemes.themes> = data.listThemes.themes;

    const visibleThemes: NonNullable<typeof themesData> = themesData.filter(
      (t): t is NonNullable<typeof t> => !!t && t.visible === true
    );

    // ❌ 0 thème visible en BDD → fallback vers thèmes frontend
    if (visibleThemes.length === 0) {
      console.warn("[ThemeContext] Using fallback themes - no visible themes in database");
      setThemes(getDefaultThemes());
      setIsUsingFallback(true);
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

  const setColorVarCSS: (newTheme: ThemeKey) => void = (newTheme: ThemeKey): void => {
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

  const toggleTheme: (newTheme: ThemeKey) => void = (newTheme: ThemeKey): void => {
    if (!themes[newTheme]) {
      console.warn(`[ThemeContext] Theme "${newTheme}" not found`);
      return;
    }

    setColorVarCSS(newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (Object.keys(themes).length === 0) return;

    const storedTheme: ThemeKey | null = localStorage.getItem("theme");

    if (storedTheme && themes[storedTheme]) {
      toggleTheme(storedTheme);
    } else {
      const firstTheme: ThemeKey = Object.keys(themes)[0];
      toggleTheme(firstTheme);
    }
  }, [themes]);

  const value: ThemeContextType = useMemo(
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


export const useTheme: () => ThemeContextType = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const getVisibleThemes: (themes: Record<string, Theme>) => Theme[] = (themes: Record<string, Theme>): Theme[] =>
  Object.values(themes).filter((theme) => theme.visible);

export const getThemeNames: (themes: Record<string, Theme>) => string[] = (themes: Record<string, Theme>): string[] =>
  Object.keys(themes);
