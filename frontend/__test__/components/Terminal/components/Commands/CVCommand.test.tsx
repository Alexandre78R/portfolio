import React from "react";
import { render } from "@testing-library/react";
import CV from "@/components/Terminal/components/Commands/CV";
import { termContext } from "@/components/Terminal/Terminal";
import { getCurrentCmdArry } from "@/components/Terminal/util";

jest.mock("@/components/Terminal/util", () => ({
  getCurrentCmdArry: jest.fn() as jest.Mock,
  checkRedirect: jest.fn() as jest.Mock,
}));

describe("CV command component", () => {
  let openSpy: jest.SpyInstance;

  beforeAll(() => {
    openSpy = jest.spyOn(window, "open" as const).mockImplementation(() => null as null);
  });

  afterAll(() => {
    openSpy.mockRestore();
  });

  beforeEach(() => {
    (getCurrentCmdArry as jest.Mock).mockReset();
  });

  test("opens CV PDF when rerender is true and command is 'cv'", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["cv"] as string[]);

    render(
      <termContext.Provider value={{ history: [], rerender: true, arg: [], index: 0 } as { history: string[]; rerender: boolean; arg: string[]; index: number }}>
        <CV />
      </termContext.Provider>
    );

    expect(openSpy as jest.SpyInstance).toHaveBeenCalledWith("/Alexandre-Renard-CV.pdf" as string, "_blank" as string);
  });

  test("does not open PDF if rerender is false", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["cv"] as string[]);

    render(
      <termContext.Provider value={{ history: [], rerender: false, arg: [], index: 0 } as { history: string[]; rerender: boolean; arg: string[]; index: number }}>
        <CV />
      </termContext.Provider>
    );

    expect(openSpy as jest.SpyInstance).not.toHaveBeenCalled();
  });

  test("does not open PDF if command is not 'cv'", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["ls"] as string[]);

    render(
      <termContext.Provider value={{ history: [], rerender: true, arg: [], index: 0 } as { history: string[]; rerender: boolean; arg: string[]; index: number }}>
        <CV />
      </termContext.Provider>
    );

    expect(openSpy as jest.SpyInstance).not.toHaveBeenCalled();
  });

  test("renders without crashing", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["cv"] as string[]);

    const { container }: { container: HTMLElement } = render(
      <termContext.Provider value={{ history: [], rerender: true, arg: [], index: 0 } as { history: string[]; rerender: boolean; arg: string[]; index: number }}>
        <CV />
      </termContext.Provider>
    );

    expect(container.firstChild as HTMLElement).toBeNull();
  });
});