import React from "react";
import { render, RenderResult, screen } from "@testing-library/react";
import Echo from "@/components/Terminal/components/Commands/Echo";
import { termContext, Term } from "@/components/Terminal/Terminal";

const renderWithContext = (args: string[]): RenderResult => {
  const mockTerm: Term = {
    arg: args,
    history: [],
    rerender: false,
    index: 0,
  };

  return render(
    <termContext.Provider value={mockTerm}>
      <Echo />
    </termContext.Provider>
  );
};

describe("Echo command component", () => {
  it("renders a single argument correctly", (): void => {
    renderWithContext(["hello"]);
    const message: HTMLElement = screen.getByText("hello");
    expect(message).toBeInTheDocument();
  });

  it("renders multiple arguments joined with space", (): void => {
    renderWithContext(["hello", "world"]);
    const message: HTMLElement = screen.getByText("hello world");
    expect(message).toBeInTheDocument();
  });

  it("trims single quotes on one argument", (): void => {
    renderWithContext(["'hello'"]);
    const message: HTMLElement = screen.getByText("hello");
    expect(message).toBeInTheDocument();
  });

  it("trims double quotes on one argument", (): void => {
    renderWithContext(['"hello"']);
    const message: HTMLElement = screen.getByText("hello");
    expect(message).toBeInTheDocument();
  });

  it("trims backticks on one argument", (): void => {
    renderWithContext(["`hello`"]);
    const message: HTMLElement = screen.getByText("hello");
    expect(message).toBeInTheDocument();
  });

  it("renders multiple arguments with quotes removed (current behavior)", (): void => {
    const args: string[] = ["`hello`", "'world'", '"again"'];
    const renderResult: RenderResult = renderWithContext(args);

    const container: HTMLElement = renderResult.container;
    const textContent: string | null = container.textContent;

    // correspond au comportement réel d'Echo : quotes retirées uniquement au début/fin global
    expect(textContent).toContain("hello` 'world' \"again");
  });
});