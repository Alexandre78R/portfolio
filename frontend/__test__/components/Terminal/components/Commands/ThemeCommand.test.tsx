import React from "react";
import { render, screen } from "@testing-library/react";
import Themes from "@/components/Terminal/components/Commands/Themes";
import { termContext } from "@/components/Terminal/Terminal";
import { useTheme } from "@/context/Theme/ThemeContext";
import * as util from "@/components/Terminal/util";

// Mocks
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

describe("Themes commandes Component", () => {
  const toggleThemeMock: jest.Mock = jest.fn();

  const renderWithContext = (contextValue: any) => {
    return render(
      <termContext.Provider value={contextValue}>
        <Themes />
      </termContext.Provider> as React.ReactElement
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ toggleTheme: toggleThemeMock } as { toggleTheme: (themeName: string) => void });
  });

  it("renders usage if arg is invalid", () => {
    (util.isArgInvalid as jest.Mock).mockReturnValue(true);
    const contextValue: { arg : string[], history : [], render : number } = { arg: ["themes", "set", "InvalidTheme"], history: [], render: 0 };
    renderWithContext(contextValue as { arg : string[], history : [], render : number });

    expect(screen.getByText("Usage Component" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders list of themes if arg length <= 2", () => {
    (util.isArgInvalid as jest.Mock).mockReturnValue(false as boolean);
    const contextValue: { arg : string[], history : [], render : number } = { arg: ["themes"], history: [], render: 0 };
    renderWithContext(contextValue as { arg : string[], history : [], render : number });

    expect(screen.getByText("Dark" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Light" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Usage Component" as string) as HTMLEmbedElement).toBeInTheDocument();
  });

  it("calls toggleTheme if currentCommand is different from currentTheme", () => {
    (util.checkThemeSwitch as jest.Mock).mockReturnValue(true as boolean);
    (util.getCurrentCmdArry as jest.Mock).mockReturnValue(["themes", "set", "Dark"] as string[]);
    (util.isArgInvalid as jest.Mock).mockReturnValue(false as boolean);

    const contextValue : { arg : string[], history : [], rerender : number } = { arg: ["themes", "set", "Dark"], history: [], rerender: 1 };
    renderWithContext(contextValue as { arg : string[], history : [], rerender : number });

    expect(toggleThemeMock as jest.Mock).toHaveBeenCalledWith("Dark" as string);
  });

  it("does not call toggleTheme if currentCommand is the same as currentTheme", () => {
    (util.checkThemeSwitch as jest.Mock).mockReturnValue(true as boolean);
    (util.getCurrentCmdArry as jest.Mock).mockReturnValue(["themes", "set", "Dark"] as string[]);
    (util.isArgInvalid as jest.Mock).mockReturnValue(false as boolean);

    const contextValue = { arg: ["themes", "set", "Dark"], history: [], rerender: 1 };
    renderWithContext(contextValue as { arg : string[], history : [], rerender : number });

    expect(toggleThemeMock as jest.Mock).toHaveBeenCalledWith("Dark" as string);
  });
});