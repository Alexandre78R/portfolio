import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import Themes from "@/components/Terminal/components/Commands/Themes";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { useTheme } from "@/context/Theme/ThemeContext";
import * as util from "@/components/Terminal/util";

// ---------- Mocks ----------
jest.mock("@/components/Terminal/util", () => ({
  isArgInvalid: jest.fn(),
  checkThemeSwitch: jest.fn(),
  getCurrentCmdArry: jest.fn(),
}));

jest.mock("@/components/Terminal/components/Usage", () => ({
  __esModule: true,
  default: () => <div>Usage Component</div>,
}));

jest.mock("@/context/Theme/themes", () => ({
  tabThemes: jest.fn(() => [
    { id: "1", name: "dark" },
    { id: "2", name: "light" },
  ]),
  tabThemesName: jest.fn(() => ["dark", "light"]),
}));

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("Themes command component", () => {
  let toggleThemeMock: jest.Mock;

  const mockThemes = {
    dark: {
      id: "1",
      name: "dark",
      nameEN: "Dark",
      nameFR: "Sombre",
      visible: true,
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
      nameEN: "Light",
      nameFR: "Claire",
      visible: true,
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    toggleThemeMock = jest.fn();

    (useTheme as jest.Mock).mockReturnValue({
      toggleTheme: toggleThemeMock,
      themes: mockThemes,
      theme: "dark",
      loading: false,
      error: false,
    });
  });

  const renderWithContext = (contextValue: Term): RenderResult =>
    render(
      <termContext.Provider value={contextValue}>
        <Themes />
      </termContext.Provider>
    );

  it("renders Usage if arg is invalid", () => {
    (util.isArgInvalid as jest.Mock).mockReturnValue(true);

    renderWithContext({
      arg: ["themes", "set", "invalidtheme"],
      history: [],
      rerender: false,
      index: 0,
    });

    const usageElement: HTMLElement = screen.getByText("Usage Component");
    expect(usageElement).toBeInTheDocument();
  });

  it("renders list of themes if arg length <= 2", () => {
    (util.isArgInvalid as jest.Mock).mockReturnValue(false);

    renderWithContext({
      arg: ["themes"],
      history: [],
      rerender: false,
      index: 0,
    });

    const darkElement: HTMLElement = screen.getByText("dark");
    const lightElement: HTMLElement = screen.getByText("light");
    const usageElement: HTMLElement = screen.getByText("Usage Component");

    expect(darkElement).toBeInTheDocument();
    expect(lightElement).toBeInTheDocument();
    expect(usageElement).toBeInTheDocument();
  });

  it("calls toggleTheme if currentCommand is valid and different from currentTheme", () => {
    (util.checkThemeSwitch as jest.Mock).mockReturnValue(true);
    (util.getCurrentCmdArry as jest.Mock).mockReturnValue([
      "themes",
      "set",
      "dark",
    ]);
    (util.isArgInvalid as jest.Mock).mockReturnValue(false);

    renderWithContext({
      arg: ["themes", "set", "dark"],
      history: [],
      rerender: false,
      index: 0,
    });

    expect(toggleThemeMock).toHaveBeenCalledWith("dark");
  });

  it("does not call toggleTheme if checkThemeSwitch returns false", () => {
    (util.checkThemeSwitch as jest.Mock).mockReturnValue(false);
    (util.getCurrentCmdArry as jest.Mock).mockReturnValue([
      "themes",
      "set",
      "dark",
    ]);
    (util.isArgInvalid as jest.Mock).mockReturnValue(false);

    renderWithContext({
      arg: ["themes", "set", "dark"],
      history: [],
      rerender: false,
      index: 0,
    });

    expect(toggleThemeMock).not.toHaveBeenCalled();
  });
});
