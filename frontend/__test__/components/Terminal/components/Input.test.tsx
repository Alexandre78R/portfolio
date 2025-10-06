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

    expect(screen.getByTestId("home-terminal")).toBeInTheDocument();

    const input: HTMLInputElement = screen.getByPlaceholderText("Type here") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    expect(input).toHaveClass("flex-grow", "inputTerminal");
  });

  it("supports ref forwarding", () => {
    const ref: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes additional props to input", () => {
    render(<Input type="text" placeholder="Test input" />);

    const input: HTMLInputElement = screen.getByPlaceholderText("Test input") as HTMLInputElement;

    // Vérifie le type texte
    expect(input).toHaveAttribute("type", "text");
  });
});