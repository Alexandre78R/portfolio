import React, { ChangeEvent } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import dayjs, { Dayjs } from "dayjs";
import InputField, { InputFieldProps } from "@/components/InputField/InputField";

const consoleLogMock: jest.Mock = jest.fn();
global.console.log = consoleLogMock;

const mockOnChangeText: jest.Mock<void, [ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>]> = jest.fn();

const mockOnChangeDate: jest.Mock<void, [string]> = jest.fn();
interface MockDatePickerProps {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  slotProps?: {
    textField?: {
      label?: string;
    };
  };
}

jest.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: jest.fn(({ value, onChange, slotProps }: MockDatePickerProps) => (
    <div data-testid="mock-datepicker">
      <input
        data-testid="mock-datepicker-input"
        value={value ? value.format("MMMM YYYY") : ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const dayjsLib = require("dayjs");
          onChange(dayjsLib(e.target.value, "MMMM YYYY"));
        }}
      />
      <label>{slotProps?.textField?.label}</label>
    </div>
  )),
}));

describe("InputField Component", () => {
  const defaultTextProps: InputFieldProps = {
    id: "test-input",
    label: "Test Label",
    value: "",
    onChange: mockOnChangeText,
    type: "text",
  };

  const defaultDateProps: InputFieldProps = {
    id: "test-date",
    label: "Test Date",
    value: "January 2026",
    picker: "date",
    locale: "en",
    onChange: mockOnChangeDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getTextbox = (): HTMLInputElement | HTMLTextAreaElement => {
    const element: HTMLElement = screen.getByRole("textbox");
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element;
    }
    throw new Error("Expected element to be input or textarea");
  };

  it("renders text input without crashing", () => {
    render(<InputField {...defaultTextProps} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.id).toBe(defaultTextProps.id);
    expect(inputElement.value).toBe("");
  });

  it("displays correct initial value for text input", () => {
    const value: string = "Hello World";
    render(<InputField {...defaultTextProps} value={value} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(inputElement.value).toBe(value);
  });

  it("calls onChange and updates value when typing in text input", async () => {
    const TestWrapper: React.FC = () => {
      const [value, setValue] = React.useState<string>("");
      return (
        <InputField
          {...defaultTextProps}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setValue(e.target.value);
            mockOnChangeText(e);
          }}
        />
      );
    };

    render(<TestWrapper />);
    const inputElement: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "New Value" } });

    await waitFor(() => {
      expect(inputElement.value).toBe("New Value");
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
      const lastCall = mockOnChangeText.mock.calls[0][0];
      expect(lastCall.target.value).toBe("New Value");
    });
  });

  it("supports multiline textarea", () => {
    const rows: number = 5;
    render(<InputField {...defaultTextProps} multiline rows={rows} />);
    const textareaElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(textareaElement.tagName).toBe("TEXTAREA");
    if (textareaElement instanceof HTMLTextAreaElement) {
      expect(textareaElement.rows).toBe(rows);
    }
  });

  it("applies type correctly", () => {
    render(<InputField {...defaultTextProps} type="email" />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    if (inputElement instanceof HTMLInputElement) {
      expect(inputElement.type).toBe("email");
    }
  });

  it("supports name prop", () => {
    const name: string = "username";
    render(<InputField {...defaultTextProps} name={name} />);
    const inputElement: HTMLInputElement | HTMLTextAreaElement = getTextbox();
    expect(inputElement.name).toBe(name);
  });

  it("renders the label correctly", () => {
    render(<InputField {...defaultTextProps} />);
    const labelElement: HTMLElement = screen.getByText(defaultTextProps.label as string);
    expect(labelElement).toBeInTheDocument();
  });

  it("renders date picker without crashing", () => {
    render(<InputField {...defaultDateProps} />);
    const datePicker: HTMLElement = screen.getByTestId("mock-datepicker");
    expect(datePicker).toBeInTheDocument();
    
    const input: HTMLInputElement = screen.getByTestId("mock-datepicker-input") as HTMLInputElement;
    expect(input.value).toBe("January 2026");
  });

  it("formats date correctly and calls onChange for date picker", async () => {
    render(<InputField {...defaultDateProps} />);
    const input: HTMLElement = screen.getByTestId("mock-datepicker-input");

    fireEvent.change(input, { target: { value: "February 2026" } });

    await waitFor(() => {
      expect(mockOnChangeDate).toHaveBeenCalled();
      const callArg: string = mockOnChangeDate.mock.calls[0][0];
      expect(callArg).toBe("February 2026");
    });
  });

  it("handles invalid date gracefully", async () => {
    render(<InputField {...defaultDateProps} />);
    const input: HTMLElement = screen.getByTestId("mock-datepicker-input");

    fireEvent.change(input, { target: { value: "Invalid Date" } });

    await waitFor(() => {
      expect(consoleLogMock).toHaveBeenCalledWith("Date invalide ou nulle");
    });
  });
});
