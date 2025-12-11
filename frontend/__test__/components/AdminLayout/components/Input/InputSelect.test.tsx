import React from "react";
import { render, screen, fireEvent, RenderResult } from '@test-utils';
import "@testing-library/jest-dom";
import InputSelect from "@/components/AdminLayout/components/Input/InputSelect";

interface SelectOption<T extends string | number> {
  readonly label: string;
  readonly value: T;
}

describe("InputSelect Component", (): void => {
  const mockOptions: readonly SelectOption<number>[] = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

    const mockOnChange: jest.Mock<void, [React.ChangeEvent<HTMLSelectElement>]> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("renders select field with label", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const labelElement: HTMLElement = screen.getByText("Test Label");
    expect(labelElement).toBeInTheDocument();
  });

  it("renders select field with correct id", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLElement = screen.getByRole("combobox");
    expect(selectElement).toHaveAttribute("id", "test-select");
  });

  it("renders all options", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
          value={2}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const option1: HTMLElement = screen.getByText("Option 1");
    const option2: HTMLElement = screen.getByText("Option 2");
    const option3: HTMLElement = screen.getByText("Option 3");

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
  });

  it("renders with default empty option", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    const options: NodeListOf<HTMLOptionElement> = selectElement.querySelectorAll("option");

    expect(options).toHaveLength(4);
  });

  it("displays selected value correctly", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={2}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("2");
  });

  it("calls onChange when selection changes", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "3" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders with required attribute when required prop is true", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
        required={true}
      />
    );

    const selectElement: HTMLElement = screen.getByRole("combobox");
    expect(selectElement).toBeRequired();
  });

  it("renders without required attribute when required prop is false", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
        required={false}
      />
    );

    const selectElement: HTMLElement = screen.getByRole("combobox");
    expect(selectElement).not.toBeRequired();
  });

  it("applies custom className when provided", (): void => {
    const { container }: RenderResult = render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const wrapper: Element | null = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("handles empty options array", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value=""
        options={[]}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    const options: NodeListOf<HTMLOptionElement> = selectElement.querySelectorAll("option");

    expect(options).toHaveLength(1);
  });

  it("handles string values", (): void => {
    const stringOptions: readonly SelectOption<string>[] = [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
    ];

    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value="banana"
        options={stringOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("banana");
  });

  it("handles selection change to empty value", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders label with correct for attribute", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const label: HTMLElement = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-select");
  });

  it("option values are correctly rendered as strings", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={1}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    const option1: HTMLOptionElement | null = selectElement.querySelector('option[value="1"]');
    const option2: HTMLOptionElement | null = selectElement.querySelector('option[value="2"]');
    const option3: HTMLOptionElement | null = selectElement.querySelector('option[value="3"]');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
  });

  it("handles numeric zero as value", (): void => {
    const optionsWithZero: readonly SelectOption<number>[] = [
      { label: "Zero", value: 0 },
      { label: "One", value: 1 },
    ];

    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={0}
        options={optionsWithZero}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("0");
  });

  it("renders correctly when value is not in options", (): void => {
    render(
      <InputSelect
        id="test-select"
        name="test-select"
        label="Test Label"
        value={999}
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const selectElement: HTMLSelectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement).toBeInTheDocument();
  });
});
