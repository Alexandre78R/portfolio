import React, { FC, useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomSelect, { CustomSelectProps } from "@/components/CustomSelect/CustomSelect";
import { SelectChangeEvent } from "@mui/material";

const createMockOnChange = (): jest.Mock<void, [SelectChangeEvent<string>]> =>
  jest.fn();

describe("CustomSelect Component", () => {
  let mockOnChange: jest.Mock<void, [SelectChangeEvent<string>]>;
  const options: { value: string; label: string }[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const defaultProps: CustomSelectProps = {
    id: "test-select",
    label: "Test Label",
    name: "testName",
    value: "option1",
    onChange: (() => {}) as (event: SelectChangeEvent<string>) => void,
    options,
  };

  beforeEach(() => {
    mockOnChange = createMockOnChange();
  });

  const TestWrapper: FC<Partial<CustomSelectProps>> = (props) => {
    const [value, setValue] = useState<string>(props.value ?? "option1");
    const handleChange = (event: SelectChangeEvent<string>): void => {
      setValue(event.target.value);
      mockOnChange(event);
    };
    return <CustomSelect {...defaultProps} {...props} value={value} onChange={handleChange} />;
  };

  it("renders without crashing and shows initial value", (): void => {
    render(<TestWrapper />);
    const selectElement: HTMLElement = screen.getByRole("combobox", { name: defaultProps.label });
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveTextContent("Option 1");
  });

  it("displays all options when clicked", (): void => {
    render(<TestWrapper />);
    const selectElement: HTMLElement = screen.getByRole("combobox", { name: defaultProps.label });

    fireEvent.mouseDown(selectElement);

    const optionElements: HTMLElement[] = screen.getAllByRole("option");
    expect(optionElements.length).toBe(options.length);

    options.forEach((opt: { value: string; label: string }): void => {
      const match: HTMLElement | undefined = optionElements.find(
        (el: HTMLElement) => el.textContent === opt.label
      );
      expect(match).toBeTruthy();
    });
  });

  it("calls onChange when a different option is selected", (): void => {
    render(<TestWrapper />);

    const selectElement: HTMLElement = screen.getByRole("combobox", { name: defaultProps.label });
    fireEvent.mouseDown(selectElement);

    const optionElement: HTMLElement = screen.getByText("Option 2");
    fireEvent.click(optionElement);

    expect(mockOnChange).toHaveBeenCalledTimes(1);

    const updatedSelect: HTMLElement = screen.getByRole("combobox", { name: defaultProps.label });
    expect(updatedSelect).toHaveTextContent("Option 2");
  });

  it("renders the label correctly", (): void => {
    render(<TestWrapper />);
    const labelElement: HTMLElement = screen.getByText(defaultProps.label);
    expect(labelElement).toBeInTheDocument();
  });

  it("shows the correct displayed value for each option", (): void => {
    render(<TestWrapper />);
    const selectElement: HTMLElement = screen.getByRole("combobox", { name: defaultProps.label });
    expect(selectElement).toHaveTextContent("Option 1");
  });
});