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
    render(<Terminal />);
    expect(screen.getByTestId("wrapper")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    // Commande initiale "welcome" est dans l'historique
    expect(screen.getByTestId("input-command")).toHaveTextContent("welcome");
  });

  it("updates input value on change", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "help" } });
    expect(input.value).toBe("help");
  });

  it("submits command and clears input", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByTestId("output-0")).toHaveTextContent("Output: help");
  });

  it("shows CmdNotFound for invalid command", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "foobar" } });
    fireEvent.submit(input.closest("form")!);
    // expect(screen.getByTestId("not-found-1")).toHaveTextContent("foobar");
    expect(screen.getByTestId("not-found-foobar")).toHaveTextContent("foobar");
  });

  it("handles arrow up and down for history navigation", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "help" as const } as HTMLInputElement } as any);
    fireEvent.submit(input.closest("form")!);

    // ArrowUp should show last command
    fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" } as any);
    expect(input.value).toBe("help");

    // ArrowDown should clear input when at newest
    fireEvent.keyDown(input, { key: "ArrowDown" as const, code: "ArrowDown" as const });
    expect(input.value).toBe("");
  });

  it("clears history on Ctrl+L", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "help" } as HTMLInputElement } as any);
    fireEvent.submit(input.closest("form")!);

    // Ctrl+L
    fireEvent.keyDown(input, { key: "l", ctrlKey: true } as any);
    expect(screen.getByTestId("input-command")).toHaveTextContent("welcome");
  });

  it("autocompletes command on Tab", () => {
    render(<Terminal />);
    const input: HTMLInputElement = screen.getByTitle("terminal-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "he" } as HTMLInputElement } as any);
    fireEvent.keyDown(input, { key: "Tab" } as any);

    expect(input.value).toBe("help");
  });
});