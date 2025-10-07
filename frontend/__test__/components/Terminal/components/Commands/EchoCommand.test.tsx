import React from "react";
import { render, screen } from "@testing-library/react";
import Echo from "@/components/Terminal/components/Commands/Echo";
import { termContext } from "@/components/Terminal/Terminal";

const renderWithContext : (args: string[]) => ReturnType<typeof render> = (args: string[]) => {
  const mockTerm: React.ContextType<typeof termContext> = {
    arg: args as string[],
    history: [] as string[],
    rerender: () => {},
    index: 0 as number,
  } as unknown as React.ContextType<typeof termContext>;

  return render(
    <termContext.Provider value={mockTerm}>
      <Echo />
    </termContext.Provider>
  );
};

describe("Echo command component", () => {
  test("renders a single argument correctly", () => {
    renderWithContext(["hello"] as string[]);
    const message: HTMLElement = screen.getByText("hello" as string);
    expect(message as HTMLElement).toBeInTheDocument();
  });

  test("renders multiple arguments joined with space", () => {
    renderWithContext(["hello", "world"] as string[]);
    const message: HTMLElement = screen.getByText("hello world" as string);
    expect(message as HTMLElement).toBeInTheDocument();
  });

  test("trims single quotes on one argument", () => {
    renderWithContext(["'hello'"] as string[]);
    const message: HTMLElement = screen.getByText("hello" as string);
    expect(message as HTMLElement).toBeInTheDocument();
  });

  test("trims double quotes on one argument", () => {
    renderWithContext(['"hello"'] as string[]);
    const message: HTMLElement = screen.getByText("hello" as string);
    expect(message as HTMLElement).toBeInTheDocument();
  });

  test("trims backticks on one argument", () => {
    renderWithContext(["`hello`"] as string[]);
    const message: HTMLElement = screen.getByText("hello" as string);
    expect(message as HTMLElement).toBeInTheDocument();
  });

  test("renders multiple arguments with quotes preserved (current behavior)", () => {
    renderWithContext(["`hello`", "'world'", '"again"'] as string[]);

    const { container }: { container: HTMLElement } = renderWithContext(["`hello`", "'world'", '"again"'] as string[]);
    const text: string | null = container.textContent;

    expect(text as string).toContain("hello` 'world' \"again" as string);
  });

  test("renders empty string if no arguments", () => {
    renderWithContext([]as string[]);
    const { container }: { container: HTMLElement } = renderWithContext([]);
    expect(container.textContent as string).toBe("" as string);
  });
});