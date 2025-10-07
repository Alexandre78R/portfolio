import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Terminal from "../../../src/components/Terminal/Terminal";
import "@testing-library/jest-dom";

// Mock des composants internes
jest.mock("@/components/Terminal/components/Wrapper", () => ({
  Wrapper: ({ children }: any) => <div data-testid="wrapper">{children}</div>,
}));

jest.mock("@/components/Terminal/components/Form", () => ({
  Form: ({ children, onSubmit }: any) => (
    <form onSubmit={onSubmit}>{children}</form>
  ),
}));

jest.mock("@/components/Terminal/components/Input", () => {
  const MockInput: React.ForwardRefExoticComponent<any> = React.forwardRef((props: any, ref) => (
    <input {...props} ref={ref} />
  ));
  MockInput.displayName = "Input" as string;
  return { Input: MockInput } as any;
});

jest.mock("@/components/Terminal/Output", () => ({
  __esModule: true as const,
  default: ({ cmd, index }: any) => (
    <div data-testid={`output-${index}`}>Output: {cmd}</div>
  ),
}));

jest.mock("@/components/Terminal/TermInfo", () => ({
  __esModule: true as const,
  default: () => <div data-testid="term-info">TermInfo</div>,
}));

jest.mock("@/components/Terminal/components/CmdNotFound", () => ({
  CmdNotFound: ({ cmdH }: any) => (
    <div data-testid={`not-found-${cmdH}`}>CmdNotFound: {cmdH}</div>
  ),
}));

jest.mock("@/components/Terminal/components/Empty", () => ({
  Empty: () => <div data-testid="empty">Empty</div>,
}));

describe("Terminal component", () => {
  it("renders correctly with initial command", () => {
    render(<Terminal /> as React.ReactElement);
    expect(screen.getByTestId("wrapper" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByDisplayValue("" as string) as HTMLElement).toBeInTheDocument();
    // Commande initiale "welcome" est dans l'historique
    expect(screen.getByTestId("input-command" as string) as HTMLElement).toHaveTextContent("welcome");
  });

  it("updates input value on change", () => {
    render(<Terminal /> as React.ReactElement);
    const input: HTMLInputElement = screen.getByTitle("terminal-input" as string) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "help" } as HTMLInputElement } as { target: HTMLInputElement } );
    expect(input.value as string).toBe("help" as string);
  });

  it("submits command and clears input", () => {
    render(<Terminal /> as React.ReactElement);
    const input: HTMLInputElement = screen.getByTitle("terminal-input" as string) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "help" } as HTMLInputElement } as { target: HTMLInputElement } );
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByDisplayValue("" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByTestId("output-0" as string) as HTMLElement).toHaveTextContent("Output: help");
  });

  it("shows CmdNotFound for invalid command", () => {
    render(<Terminal /> as React.ReactElement);
    const input: HTMLInputElement = screen.getByTitle("terminal-input" as string) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "foobar" } } as { target: HTMLInputElement } );
    fireEvent.submit(input.closest("form" as string)!) ;
    // expect(screen.getByTestId("not-found-1")).toHaveTextContent("foobar");
    expect(screen.getByTestId("not-found-foobar" as string) as HTMLElement).toHaveTextContent("foobar");
  });

  it("handles arrow up and down for history navigation", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input" as string) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "help" as const } as HTMLInputElement } as { target: HTMLInputElement });
    fireEvent.submit(input.closest("form" as string)!);

    // ArrowUp should show last command
    fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" } as { key: string, code: string });
    expect(input.value).toBe("help" as string);

    // ArrowDown should clear input when at newest
    fireEvent.keyDown(input, { key: "ArrowDown" as const, code: "ArrowDown" as const });
    expect(input.value).toBe("" as string);
  });

  it("clears history on Ctrl+L", () => {
    render(<Terminal /> as React.ReactElement);
    const input: HTMLInputElement = screen.getByTitle("terminal-input" as string) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "help" } as HTMLInputElement } as { target: HTMLInputElement });
    fireEvent.submit(input.closest("form" as string)!);

    // Ctrl+L
    fireEvent.keyDown(input, { key: "l", ctrlKey: true } as { key: string, ctrlKey: boolean });
    expect(screen.getByTestId("input-command" as string)).toHaveTextContent("welcome");
  });

  it("autocompletes command on Tab", () => {
    render(<Terminal /> as React.ReactElement);
    const input: HTMLInputElement = screen.getByTitle("terminal-input" as string) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "he" } as HTMLInputElement } as { target: HTMLInputElement });
    fireEvent.keyDown(input, { key: "Tab" } as { key: string });

    expect(input.value).toBe("help" as string);
  });
});