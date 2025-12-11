import React, { ChangeEvent, ReactElement } from "react";
import { render, screen, fireEvent } from '@test-utils';
import "@testing-library/jest-dom";
import InputColor, {
  InputColorProps,
} from "@/components/AdminLayout/components/Input/InputColor";

interface TextAdminMockProps {
  type: string;
  children: React.ReactNode;
  className?: string;
}

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({
    children,
    className,
  }: TextAdminMockProps): ReactElement => (
    <div data-testid="text-admin" className={className}>
      {children}
    </div>
  ),
}));

describe("InputColor component", () => {
  let mockOnChange: jest.MockedFunction<
    (event: ChangeEvent<HTMLInputElement>) => void
  >;

  let defaultProps: InputColorProps;

  beforeEach((): void => {
    mockOnChange = jest.fn();

    defaultProps = {
      id: "test-color-input",
      label: "Primary Color",
      labelType: "h3",
      value: "#ff0000",
      onChange: mockOnChange,
      name: "primary",
      required: true,
      className: "custom-class",
    };
  });

  it("should render without crashing", (): void => {
    render(<InputColor {...defaultProps} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.type).toBe("color");
  });

  it("should render the correct initial value", (): void => {
    render(<InputColor {...defaultProps} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    expect(inputElement.value).toBe("#ff0000");
  });

  it("should call onChange when the color value changes", (): void => {
    render(<InputColor {...defaultProps} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    fireEvent.change(inputElement, {
      target: { value: "#00ff00" },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);

    const eventArg: ChangeEvent<HTMLInputElement> =
      mockOnChange.mock.calls[0][0];

    expect(eventArg).toBeDefined();
    expect(eventArg.target).toBeDefined();
  });

  it("should render the label using TextAdmin", (): void => {
    render(<InputColor {...defaultProps} />);

    const labelElement: HTMLElement = screen.getByTestId("text-admin");

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent("Primary Color");
    expect(labelElement).toHaveClass("mb-2", "text-primary");
  });

  it("should apply the custom className to the wrapper", (): void => {
    render(<InputColor {...defaultProps} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    const wrapperElement: HTMLElement =
      inputElement.parentElement as HTMLElement;

    expect(wrapperElement).toHaveClass(
      "flex",
      "flex-col",
      "w-full",
      "custom-class"
    );
  });

  it("should be required when required prop is true", (): void => {
    render(<InputColor {...defaultProps} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    expect(inputElement.required).toBe(true);
  });

  it("should not be required when required prop is false", (): void => {
    render(<InputColor {...defaultProps} required={false} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    expect(inputElement.required).toBe(false);
  });

  it("should have the correct name attribute", (): void => {
    render(<InputColor {...defaultProps} />);

    const inputElement: HTMLInputElement = screen.getByTestId(
      "color-input"
    ) as HTMLInputElement;

    expect(inputElement.name).toBe("primary");
  });
});
