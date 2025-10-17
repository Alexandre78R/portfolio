import React, { ChangeEvent, useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "@/components/InputField/InputField";

const mockOnChange: jest.Mock<void, [ChangeEvent<HTMLInputElement | HTMLTextAreaElement>]> = jest.fn();

describe("InputField Component", () => {
  const defaultProps: {
    id: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    multiline?: boolean;
    rows?: number;
    name?: string;
  } = {
    id: "test-input",
    label: "Test Label",
    value: "",
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const getTextbox = (): HTMLInputElement | HTMLTextAreaElement => {
    const element: HTMLElement = screen.getByRole("textbox");
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element;
    }
    throw new Error("Expected element to be input or textarea");
  };

  it("renders without crashing", () => {
    render(<InputField {...defaultProps} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.id).toBe(defaultProps.id);
  });

  it("displays the correct value", () => {
    const testValue: string = "Hello World";
    render(<InputField {...defaultProps} value={testValue} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(inputElement.value).toBe(testValue);
  });

  it("calls onChange and updates value when typing", () => {
    const TestWrapper: React.FC = () => {
      const [value, setValue] = useState<string>("");
      const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value);
      };
      return (
        <InputField
          id="test-input"
          label="Test Label"
          value={value}
          onChange={handleChange}
        />
      );
    };

    render(<TestWrapper />);
    const inputElement = screen.getByRole("textbox") as HTMLInputElement | HTMLTextAreaElement;

    fireEvent.change(inputElement, { target: { value: "New Value" } });

    expect(inputElement.value).toBe("New Value");
  });

  it("supports multiline textarea", () => {
    const rows: number = 4;
    render(<InputField {...defaultProps} multiline rows={rows} />);
    const textareaElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();

    expect(textareaElement.tagName).toBe("TEXTAREA");
    if (textareaElement instanceof HTMLTextAreaElement) {
      expect(textareaElement.rows).toBe(rows);
    }
  });

  it("applies the type correctly", () => {
    const type: string = "email";
    render(<InputField {...defaultProps} type={type} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    if (inputElement instanceof HTMLInputElement) {
      expect(inputElement.type).toBe(type);
    }
  });

  it("supports the name prop", () => {
    const name: string = "username";
    render(<InputField {...defaultProps} name={name} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(inputElement.name).toBe(name);
  });

  it("renders the label correctly", () => {
    render(<InputField {...defaultProps} />);
    const labelElement: HTMLElement = screen.getByText(defaultProps.label);
    expect(labelElement).toBeInTheDocument();
  });
});