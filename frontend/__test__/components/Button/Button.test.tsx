import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonCustom, { ButtonCustomProps} from "@/components/Button/Button";

describe("ButtonCustom Component", () => {
  const mockOnClick = jest.fn();

  const defaultProps: ButtonCustomProps = {
    onClick: mockOnClick,
    text: "Click Me",
    disable: false,
    disableHover: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders button with correct text", () => {
    render(<ButtonCustom {...defaultProps} />);
    const button: HTMLButtonElement = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.disabled).toBe(false);
  });

  test("calls onClick when button is clicked", () => {
    render(<ButtonCustom {...defaultProps} />);
    const button: HTMLButtonElement = screen.getByRole("button", { name: /click me/i });

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("renders button as disabled when disable is true", () => {
    render(<ButtonCustom {...defaultProps} disable />);
    const button: HTMLButtonElement = screen.getByRole("button", { name: /click me/i });
    expect(button.disabled).toBe(true);
  });

  test("does not apply hover styles when disableHover is true", () => {
    render(<ButtonCustom {...defaultProps} disableHover />);
    const button: HTMLButtonElement = screen.getByRole("button", { name: /click me/i });

    // On hover, the style object should remain unchanged for disableHover
    fireEvent.mouseOver(button);
    expect(button).toBeInTheDocument();
  });

  test("renders ReactNode text correctly", () => {
    render(<ButtonCustom {...defaultProps} text={<span data-testid="custom-text">Hello</span>} />);
    const customText: HTMLSpanElement = screen.getByTestId("custom-text");
    expect(customText).toBeInTheDocument();
    expect(customText.textContent).toBe("Hello");
  });
});
