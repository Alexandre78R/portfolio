import React from "react";
import { render, screen, RenderResult } from "@testing-library/react";
import Themes from "@/components/Terminal/components/Commands/Themes";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { useTheme } from "@/context/Theme/ThemeContext";
import * as util from "@/components/Terminal/util";

// ---------- Mocks ----------
jest.mock("@/context/Theme/ThemeContext");
jest.mock("@/components/Terminal/components/Usage", () => jest.fn(() => <div>Usage Component</div>));
jest.mock("@/components/Terminal/util");
jest.mock("@/context/Theme/themes", () => ({
  tabThemes: jest.fn(() => [
    { id: "1", name: "Dark" } as { id: string; name: string },
    { id: "2", name: "Light" } as { id: string; name: string },
  ]),
  tabThemesName: jest.fn(() => ["Dark", "Light"] as string[]),
}));

describe("Themes command component", () => {
  const toggleThemeMock: jest.Mock = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ toggleTheme: toggleThemeMock } as { toggleTheme: (themeName: string) => void });
  });

  const renderWithContext = (contextValue: Term): RenderResult =>
    render(
      <termContext.Provider value={contextValue}>
        <Themes />
      </termContext.Provider>
    );

  it("renders Usage if arg is invalid", (): void => {
    (util.isArgInvalid as jest.Mock).mockReturnValue(true);

    const contextValue: Term = { arg: ["themes", "set", "InvalidTheme"], history: [], rerender: false, index: 0 };
    renderWithContext(contextValue);

    const usageElement: HTMLElement = screen.getByText("Usage Component");
    expect(usageElement).toBeInTheDocument();
  });

  it("renders list of themes if arg length <= 2", (): void => {
    (util.isArgInvalid as jest.Mock).mockReturnValue(false);

    const contextValue: Term = { arg: ["themes"], history: [], rerender: false, index: 0 };
    renderWithContext(contextValue);

    const darkElement: HTMLElement = screen.getByText("Dark");
    const lightElement: HTMLElement = screen.getByText("Light");
    const usageElement: HTMLElement = screen.getByText("Usage Component");

    expect(darkElement).toBeInTheDocument();
    expect(lightElement).toBeInTheDocument();
    expect(usageElement).toBeInTheDocument();
  });

  it("calls toggleTheme if currentCommand is different from currentTheme", (): void => {
    (util.checkThemeSwitch as jest.Mock).mockReturnValue(true);
    (util.getCurrentCmdArry as jest.Mock).mockReturnValue(["themes", "set", "Dark"]);
    (util.isArgInvalid as jest.Mock).mockReturnValue(false);

    const contextValue: Term = { arg: ["themes", "set", "Dark"], history: [], rerender: false, index: 0 };
    renderWithContext(contextValue);

    expect(toggleThemeMock).toHaveBeenCalledWith("Dark");
  });

  it("does not call toggleTheme if currentCommand is the same as currentTheme", (): void => {
    (util.checkThemeSwitch as jest.Mock).mockReturnValue(false);
    (util.getCurrentCmdArry as jest.Mock).mockReturnValue(["themes", "set", "Dark"]);
    (util.isArgInvalid as jest.Mock).mockReturnValue(false);

    const contextValue: Term = { arg: ["themes", "set", "Dark"], history: [], rerender: false, index: 0 };
    renderWithContext(contextValue);

    expect(toggleThemeMock).not.toHaveBeenCalled();
  });
});