import React from "react";
import { render, screen } from "@testing-library/react";
import Output from "../../../src/components/Terminal/Output";
import { termContext } from "../../../src/components/Terminal/Terminal";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/Terminal/components/Commands/Welcome", () => ({
  __esModule: true,
  default: () => <div data-testid="welcome">Welcome</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Help", () => ({
  __esModule: true,
  default: () => <div data-testid="help">Help</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Clear", () => ({
  __esModule: true,
  default: () => <div data-testid="clear">Clear</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Socials", () => ({
  __esModule: true,
  default: () => <div data-testid="socials">Socials</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Echo", () => ({
  __esModule: true,
  default: () => <div data-testid="echo">Echo</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Whoami", () => ({
  __esModule: true,
  default: () => <div data-testid="whoami">Whoami</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Themes", () => ({
  __esModule: true,
  default: () => <div data-testid="themes">Themes</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/About", () => ({
  __esModule: true,
  default: () => <div data-testid="about">About</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Lang", () => ({
  __esModule: true,
  default: () => <div data-testid="lang">Lang</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/CV", () => ({
  __esModule: true,
  default: () => <div data-testid="cv">CV</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/ProjectsCommand", () => ({
  __esModule: true,
  default: () => <div data-testid="projects">Projects</div>,
}));

jest.mock("../../../src/components/Terminal/components/Message", () => ({
  Message: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe("Output component", () => {
  const renderWithContext = (cmd: string, arg: string[] = [], index = 0) => {
    return render(
      <termContext.Provider value={{ arg, history: [], rerender: true, index }}>
        <Output index={index} cmd={cmd} />
      </termContext.Provider>
    );
  };

  it("renders Help component for 'help' command", () => {
    renderWithContext("help");
    expect(screen.getByTestId("help")).toBeInTheDocument();
    expect(screen.getByTestId("latest-output")).toBeInTheDocument();
  });

  it("renders Welcome component for 'welcome'", () => {
    renderWithContext("welcome");
    expect(screen.getByTestId("welcome")).toBeInTheDocument();
  });

  it("renders Message usage for non-special cmd with args", () => {
    renderWithContext("about", ["someArg"]);
    const usage: HTMLElement = screen.getByTestId("usage-output");
    expect(usage).toHaveTextContent("Usage: about");
  });

  it("renders Socials for 'socials'", () => {
    renderWithContext("socials");
    expect(screen.getByTestId("socials")).toBeInTheDocument();
  });

  it("renders Echo for 'echo'", () => {
    renderWithContext("echo");
    expect(screen.getByTestId("echo")).toBeInTheDocument();
  });

  it("renders Whoami for 'whoami'", () => {
    renderWithContext("whoami");
    expect(screen.getByTestId("whoami")).toBeInTheDocument();
  });

  it("renders Themes for 'themes'", () => {
    renderWithContext("themes");
    expect(screen.getByTestId("themes")).toBeInTheDocument();
  });

  it("renders Lang for 'lang'", () => {
    renderWithContext("lang");
    expect(screen.getByTestId("lang")).toBeInTheDocument();
  });

  it("renders CV for 'cv'", () => {
    renderWithContext("cv");
    expect(screen.getByTestId("cv")).toBeInTheDocument();
  });

  it("renders Projects for 'projects'", () => {
    renderWithContext("projects");
    expect(screen.getByTestId("projects")).toBeInTheDocument();
  });

  it("does not crash for unknown command", () => {
    renderWithContext("foobar");
    expect(screen.queryByTestId("latest-output")).toBeInTheDocument();
    expect(screen.queryByTestId("usage-output")).not.toBeInTheDocument();
  });
});