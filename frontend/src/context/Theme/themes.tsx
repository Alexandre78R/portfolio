export interface Theme {
    id: string;
    name: string;
    colors: {
      body: string;
      scrollHandle: string;
      scrollHandleHover: string;
      primary: string;
      secondary: string;
      success: string;
      error: string;
      warn: string;
      info: string;
      grey: string;
      placeholder: string;
      text: {
        default: string, 
        100: string;
        200: string;
        300: string;
      };
    };
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
}
  
export interface ThemeColorsText {
  default: string;
  100: string;
  200: string;
  300: string;
}

const themes: { [key: string]: Theme } = {
    dark: {
      id: "1",
      name: "dark",
      colors: {
        body: "#01031B",
        scrollHandle: "#19252E",
        scrollHandleHover: "#162028",
        primary: "#B45852",
        secondary: "#F2C85B",
        success: "#1C8036",
        error: "#AA2020",
        warn: "#EBCC2A",
        info: "#3B89FF",
        grey: "#7F7F7F",
        placeholder: "#A0AEC0",
        text: {
          default:"#F8F8FD", 
          100: "#cbd5e1",
          200: "#B2BDCC",
          300: "#64748b",
        },
      },
    },
    light: {
      id: "2",
      name: "light",
      colors: {
        body: "#EFF3F3",
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
        text: {
          default:"#7BA5A4", 
          100: "#334155",
          200: "#475569",
          300: "#64748b",
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
        text: {
          default:"#F8F8FD", 
          100: "#FFFFFF",
          200: "#E1E9CC",
          300: "#CDCDCD",
        },
      },
    },
  };
  
  export default themes;