import React from "react";
import { render, screen } from "@testing-library/react";
import Output from "../../../src/components/Terminal/Output";
import { termContext } from "../../../src/components/Terminal/Terminal";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/Terminal/components/Commands/Welcome", () => ({
  __esModule: true as const,
  default: () => <div data-testid="welcome">Welcome</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Help", () => ({
  __esModule: true as const,
  default: () => <div data-testid="help">Help</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Clear", () => ({
  __esModule: true as const,
  default: () => <div data-testid="clear">Clear</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Socials", () => ({
  __esModule: true as const,
  default: () => <div data-testid="socials">Socials</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Echo", () => ({
  __esModule: true as const,
  default: () => <div data-testid="echo">Echo</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Whoami", () => ({
  __esModule: true as const,
  default: () => <div data-testid="whoami">Whoami</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Themes", () => ({
  __esModule: true as const,
  default: () => <div data-testid="themes">Themes</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/About", () => ({
  __esModule: true as const,
  default: () => <div data-testid="about">About</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/Lang", () => ({
  __esModule: true as const,
  default: () => <div data-testid="lang">Lang</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/CV", () => ({
  __esModule: true as const,
  default: () => <div data-testid="cv">CV</div>,
}));

jest.mock("../../../src/components/Terminal/components/Commands/ProjectsCommand", () => ({
  __esModule: true as const,
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
    renderWithContext("help" as string);
    expect(screen.getByTestId("help" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByTestId("latest-output" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Welcome component for 'welcome'", () => {
    renderWithContext("welcome" as string);
    expect(screen.getByTestId("welcome" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Message usage for non-special cmd with args", () => {
    renderWithContext("about", ["someArg"] as string[]);
    const usage: HTMLElement = screen.getByTestId("usage-output" as string);
    expect(usage as HTMLElement).toHaveTextContent("Usage: about" as string);
  });

  it("renders Socials for 'socials'", () => {
    renderWithContext("socials" as string);
    expect(screen.getByTestId("socials" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Echo for 'echo'", () => {
    renderWithContext("echo" as string);
    expect(screen.getByTestId("echo" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Whoami for 'whoami'", () => {
    renderWithContext("whoami" as string);
    expect(screen.getByTestId("whoami" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Themes for 'themes'", () => {
    renderWithContext("themes" as string);
    expect(screen.getByTestId("themes" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Lang for 'lang'", () => {
    renderWithContext("lang" as string);
    expect(screen.getByTestId("lang" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders CV for 'cv'", () => {
    renderWithContext("cv" as string);
    expect(screen.getByTestId("cv" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders Projects for 'projects'", () => {
    renderWithContext("projects" as string);
    expect(screen.getByTestId("projects" as string) as HTMLElement).toBeInTheDocument();
  });

  it("does not crash for unknown command", () => {
    renderWithContext("foobar" as string);
    expect(screen.queryByTestId("latest-output" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.queryByTestId("usage-output" as string) as HTMLElement).not.toBeInTheDocument();
  });
});