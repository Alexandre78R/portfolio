import React from "react";
import { render, RenderResult } from "@testing-library/react";
import CV from "@/components/Terminal/components/Commands/CV";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { getCurrentCmdArry } from "@/components/Terminal/util";

jest.mock("@/components/Terminal/util", () => ({
  getCurrentCmdArry: jest.fn(),
  checkRedirect: jest.fn(),
}));

describe("CV command component", () => {
  let openSpy: jest.SpyInstance;

  const renderWithContext = (contextValue: Term): RenderResult =>
    render(
      <termContext.Provider value={contextValue}>
        <CV />
      </termContext.Provider>
    );

  beforeAll((): void => {
    openSpy = jest.spyOn(window, "open").mockImplementation((): null => null);
  });

  afterAll((): void => {
    openSpy.mockRestore();
  });

  beforeEach((): void => {
    (getCurrentCmdArry as jest.Mock).mockReset();
  });

  it("opens CV PDF when rerender is true and command is 'cv'", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(openSpy).toHaveBeenCalledWith("/Alexandre-Renard-CV.pdf", "_blank");
  });

  it("does not open PDF if rerender is false", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: false, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it("does not open PDF if command is not 'cv'", (): void => {
    const mockCmdArray: string[] = ["ls"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it("renders without crashing", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    const renderResult: RenderResult = renderWithContext(contextValue);

    const container: HTMLElement = renderResult.container as HTMLElement;
    expect(container.firstChild).toBeNull();
  });
});