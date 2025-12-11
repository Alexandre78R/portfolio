import React, { ChangeEvent } from "react";
import { render, screen, fireEvent } from '@test-utils';
import "@testing-library/jest-dom";
import InputBoolean, { InputBooleanProps} from "@/components/AdminLayout/components/Input/InputBoolean";


jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ type, children, className }: { type: any; children: React.ReactNode; className?: string }) => (
    <div data-testid="text-admin" className={className}>
      {children}
    </div>
  ),
}));

describe("InputBoolean Component", () => {
  let mockOnChange: jest.Mock<(e: ChangeEvent<HTMLInputElement>) => void, [ChangeEvent<HTMLInputElement>]>;
  let defaultProps: InputBooleanProps;

  beforeEach(() => {
    mockOnChange = jest.fn();
    defaultProps = {
      id: "test-input-boolean",
      label: "Visible",
      labelType: "h3",
      value: true,
      onChange: mockOnChange,
      name: "visible",
      required: true,
      className: "custom-class",
      optionClassName: "option-class",
      selectedClassName: "selected-class",
    };
  });

  it("should render without crashing", () => {
    render(<InputBoolean {...defaultProps} />);
    const container: HTMLElement | null = screen.getByText("Visible")?.parentElement;
    expect(container).toBeInTheDocument();
  });

  it("should render the label using TextAdmin", () => {
    render(<InputBoolean {...defaultProps} />);
    const label: HTMLElement = screen.getByTestId("text-admin");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Visible");
    expect(label).toHaveClass("mb-2 text-primary font-bold");
  });

  it("should render Yes and No buttons", () => {
    render(<InputBoolean {...defaultProps} />);
    const yesButton: HTMLElement = screen.getByText("Yes");
    const noButton: HTMLElement = screen.getByText("No");
    expect(yesButton).toBeInTheDocument();
    expect(noButton).toBeInTheDocument();
  });

  it("should apply selectedClassName to the button with true value", () => {
    render(<InputBoolean {...defaultProps} />);
    const yesButton: HTMLElement = screen.getByText("Yes");
    const noButton: HTMLElement = screen.getByText("No");
    expect(yesButton).toHaveClass("selected-class");
    expect(noButton).not.toHaveClass("selected-class");
  });

  it("should apply selectedClassName to the button with false value", () => {
    render(<InputBoolean {...defaultProps} value={false} />);
    const yesButton: HTMLElement = screen.getByText("Yes");
    const noButton: HTMLElement = screen.getByText("No");
    expect(yesButton).not.toHaveClass("selected-class");
    expect(noButton).toHaveClass("selected-class");
  });

  it("should call onChange with true when Yes button is clicked", () => {
    render(<InputBoolean {...defaultProps} value={false} />);
    const yesButton: HTMLElement = screen.getByText("Yes");
    fireEvent.click(yesButton);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const eventArg = mockOnChange.mock.calls[0][0];
    expect(eventArg.target.name).toBe("visible");
    expect(eventArg.target.value).toBe("true");
  });

  it("should call onChange with false when No button is clicked", () => {
    render(<InputBoolean {...defaultProps} value={true} />);
    const noButton: HTMLElement = screen.getByText("No");
    fireEvent.click(noButton);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const eventArg: React.ChangeEvent<HTMLInputElement> = mockOnChange.mock.calls[0][0];
    expect(eventArg.target.name).toBe("visible");
    expect(eventArg.target.value).toBe("false");
  });

  it("should render correctly when value is undefined", () => {
    render(<InputBoolean {...defaultProps} value={undefined} />);
    const yesButton: HTMLElement = screen.getByText("Yes");
    const noButton: HTMLElement = screen.getByText("No");
    expect(yesButton).not.toHaveClass("selected-class");
    expect(noButton).not.toHaveClass("selected-class");
  });

  it("should apply custom className to wrapper", () => {
    render(<InputBoolean {...defaultProps} />);
    const wrapper: HTMLElement | null = screen.getByText("Visible")?.parentElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should apply optionClassName to both buttons", () => {
    render(<InputBoolean {...defaultProps} />);
    const yesButton: HTMLElement = screen.getByText("Yes");
    const noButton: HTMLElement = screen.getByText("No");
    expect(yesButton).toHaveClass("option-class");
    expect(noButton).toHaveClass("option-class");
  });
});
