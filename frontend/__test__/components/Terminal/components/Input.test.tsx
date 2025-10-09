import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "../../../../src/components/Terminal/components/Input";
import HomeTerminal from "../../../../src/components/Terminal/HomeTerminal";
import "@testing-library/jest-dom";

// On mock HomeTerminal pour isoler
jest.mock("../../../../src/components/Terminal/HomeTerminal", () => ({
  __esModule: true,
  default: () => <div data-testid="home-terminal">HomeTerminal</div>,
}));

describe("Input component", () => {
  it("renders HomeTerminal and input", () => {
    render(<Input placeholder="Type here" />);

    expect(screen.getByTestId("home-terminal" as string) as HTMLElement).toBeInTheDocument();

    const input: HTMLInputElement = screen.getByPlaceholderText("Type here") as HTMLInputElement;
    expect(input as HTMLElement).toBeInTheDocument();

    expect(input as HTMLInputElement).toHaveClass("flex-grow", "inputTerminal");
  });

  it("supports ref forwarding", () => {
    const ref: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
    render(<Input ref={ref} /> as React.ReactElement);

    expect(ref.current as unknown).toBeInstanceOf(HTMLInputElement as unknown);
  });

  it("passes additional props to input", () => {
    render(<Input type="text" placeholder="Test input" /> as React.ReactElement);

    const input: HTMLInputElement = screen.getByPlaceholderText("Test input") as HTMLInputElement;

    expect(input as HTMLInputElement).toHaveAttribute("type", "text");
  });
});