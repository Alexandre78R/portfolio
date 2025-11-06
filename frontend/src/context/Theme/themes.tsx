export interface ThemeColorsText {
  default: string;
  100: string;
  200: string;
  300: string;
  button: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  scrollHandle: string;
  scrollHandleHover: string;
  body: string;
  grey: string;
  placeholder: string;
  success: string;
  error: string;
  warn: string;
  info: string;
  admin: string;
  footer: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors & { text: ThemeColorsText };
  visible?: boolean;
}

const themes = {
  dark: {
    id: "1",
    name: "dark",
    colors: {
      body: "#01031B",
      scrollHandle: "#19252E",
      scrollHandleHover: "#162028",
      primary: "#B45852",
      secondary: "#DFBB5F",
      success: "#1C8036",
      error: "#AA2020",
      warn: "#EBCC2A",
      info: "#3B89FF",
      grey: "#7F7F7F",
      placeholder: "#A0AEC0",
      footer: "#050F1A",
      admin: "#080b2a",
      text: {
        default: "#F8F8FD",
        100: "#cbd5e1",
        200: "#B2BDCC",
        300: "#64748b",
        button: "white",
      },
    },
  },
  light: {
    id: "2",
    name: "light",
    colors: {
      body: "#E8E8E8",
      scrollHandle: "#C1C1C1",
      scrollHandleHover: "#AAAAAA",
      primary: "#008787",
      secondary: "#FF9D00",
      success: "#1C8036",
      error: "#AA2020",
      warn: "#EBCC2A",
      info: "#3B89FF",
      grey: "#7F7F7F",
      placeholder: "#A0AEC0",
      footer: "#34393E",
      admin: "#34393E",
      text: {
        default: "#7BA5A4",
        100: "#334155",
        200: "#475569",
        300: "#64748b",
        button: "white",
      },
    },
  },
  ubuntu: {
    id: "3",
    name: "ubuntu",
    colors: {
      body: "#2D0922",
      scrollHandle: "#F47845",
      scrollHandleHover: "#E65F31",
      primary: "#80D932",
      secondary: "#dd4813",
      success: "#1C8036",
      error: "#AA2020",
      warn: "#EBCC2A",
      info: "#3B89FF",
      grey: "#7F7F7F",
      placeholder: "#A0AEC0",
      footer: "#180512",
      admin: "#180512",
      text: {
        default: "#F8F8FD",
        100: "#FFFFFF",
        200: "#E1E9CC",
        300: "#CDCDCD",
        button: "white",
      },
    },
  },
} as const;

// 🔥 Types dérivés automatiquement
export type ThemeKey = keyof typeof themes;
export type ThemeType = typeof themes[ThemeKey];
export type ThemeName = ThemeType["name"];

// 🔥 Fonctions typées
export const tabThemes = (): ThemeType[] => {
  return (Object.keys(themes) as ThemeKey[]).map((key) => themes[key]);
};

export const tabThemesName = (): ThemeName[] => {
  return (Object.keys(themes) as ThemeKey[]).map((key) => themes[key].name);
};

export default themes;

