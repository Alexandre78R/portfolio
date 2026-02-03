import { createRef } from "react";
import { render, screen, RenderResult } from '@test-utils';
import { Input } from "../../../../src/components/Terminal/components/Input";
import HomeTerminal from "../../../../src/components/Terminal/HomeTerminal";
import "@testing-library/jest-dom";

jest.mock("../../../../src/components/Terminal/HomeTerminal", () => ({
  __esModule: true,
  default: () => <div data-testid="home-terminal">HomeTerminal</div>,
}));

describe("Input component", () => {
  it("renders HomeTerminal and input", (): void => {
    render(<Input placeholder="Type here" />);

    const homeTerminal: HTMLElement = screen.getByTestId("home-terminal");
    expect(homeTerminal).toBeInTheDocument();

    const input: HTMLInputElement = screen.getByPlaceholderText("Type here") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex-grow", "inputTerminal");
  });

  it("supports ref forwarding", (): void => {
    const ref: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes additional props to input", (): void => {
    render(<Input type="text" placeholder="Test input" />);

    const input: HTMLInputElement = screen.getByPlaceholderText("Test input") as HTMLInputElement;
    expect(input).toHaveAttribute("type", "text");
  });
});
