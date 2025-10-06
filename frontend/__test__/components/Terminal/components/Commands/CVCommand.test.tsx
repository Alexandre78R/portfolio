import React from "react";
import { render } from "@testing-library/react";
import CV from "@/components/Terminal/components/Commands/CV";
import { termContext } from "@/components/Terminal/Terminal";

jest.mock("@/components/Terminal/util", () => ({
  getCurrentCmdArry: jest.fn() as jest.Mock,
  checkRedirect: jest.fn() as jest.Mock,
}));

import { getCurrentCmdArry } from "@/components/Terminal/util";

describe("CV component", () => {
  let openSpy: jest.SpyInstance;

  beforeAll(() => {
    openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterAll(() => {
    openSpy.mockRestore();
  });

  beforeEach(() => {
    (getCurrentCmdArry as jest.Mock).mockReset();
  });

  test("opens CV PDF when rerender is true and command is 'cv'", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["cv"]);

    render(
      <termContext.Provider value={{ history: [], rerender: true, arg: [], index: 0 }}>
        <CV />
      </termContext.Provider>
    );

    expect(openSpy).toHaveBeenCalledWith("/Alexandre-Renard-CV.pdf", "_blank");
  });

  test("does not open PDF if rerender is false", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["cv"]);

    render(
      <termContext.Provider value={{ history: [], rerender: false, arg: [], index: 0 }}>
        <CV />
      </termContext.Provider>
    );

    expect(openSpy).not.toHaveBeenCalled();
  });

  test("does not open PDF if command is not 'cv'", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["ls"]);

    render(
      <termContext.Provider value={{ history: [], rerender: true, arg: [], index: 0 }}>
        <CV />
      </termContext.Provider>
    );

    expect(openSpy).not.toHaveBeenCalled();
  });

  test("renders without crashing", () => {
    (getCurrentCmdArry as jest.Mock).mockReturnValue(["cv"]);

    const { container }: { container: HTMLElement } = render(
      <termContext.Provider value={{ history: [], rerender: true, arg: [], index: 0 }}>
        <CV />
      </termContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});