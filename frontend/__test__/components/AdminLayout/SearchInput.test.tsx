import React, { ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from "@test-utils";
import "@testing-library/jest-dom";
import SearchInput from "@/components/AdminLayout/components/Input/SearchInput";

describe("SearchInput Component", (): void => {
  const mockOnChange: jest.Mock<void, [ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>]> = jest.fn();
  const mockOnSubmit: jest.Mock<void, [FormEvent<HTMLFormElement>]> = jest.fn();

  const defaultProps = {
    value: "",
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
    placeholder: "Search...",
    buttonLabel: "Search",
    id: "search-input",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("renders search input with placeholder", (): void => {
    render(<SearchInput {...defaultProps} />);
    const inputElement: HTMLElement = screen.getByPlaceholderText("Search...");
    expect(inputElement).toBeInTheDocument();
  });

  it("renders search button with correct label", (): void => {
    render(<SearchInput {...defaultProps} />);
    const buttonElement: HTMLElement = screen.getByRole("button", { name: "Search" });
    expect(buttonElement).toBeInTheDocument();
  });

  it("calls onChange when input value changes", (): void => {
    render(<SearchInput {...defaultProps} />);
    const inputElement: HTMLElement = screen.getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "test search" } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onSubmit when form is submitted", (): void => {
    render(<SearchInput {...defaultProps} />);
    const formElement: HTMLFormElement = screen.getByPlaceholderText("Search...").closest("form") as HTMLFormElement;
    fireEvent.submit(formElement);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("submits form when button is clicked", (): void => {
    render(<SearchInput {...defaultProps} />);
    const formElement: HTMLFormElement = screen.getByPlaceholderText("Search...").closest("form") as HTMLFormElement;
    fireEvent.submit(formElement);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("displays current input value", (): void => {
    const propsWithValue = {
      ...defaultProps,
      value: "existing search",
    };
    render(<SearchInput {...propsWithValue} />);
    const inputElement: HTMLInputElement = screen.getByDisplayValue("existing search") as HTMLInputElement;
    expect(inputElement.value).toBe("existing search");
  });

  it("accepts custom placeholder", (): void => {
    const customProps = {
      ...defaultProps,
      placeholder: "Custom placeholder",
    };
    render(<SearchInput {...customProps} />);
    const inputElement: HTMLElement = screen.getByPlaceholderText("Custom placeholder");
    expect(inputElement).toBeInTheDocument();
  });

  it("accepts custom button label", (): void => {
    const customProps = {
      ...defaultProps,
      buttonLabel: "Custom Button",
    };
    render(<SearchInput {...customProps} />);
    const buttonElement: HTMLElement = screen.getByRole("button", { name: "Custom Button" });
    expect(buttonElement).toBeInTheDocument();
  });

  it("exposes the input id", (): void => {
    render(<SearchInput {...defaultProps} />);
    const inputElement: HTMLElement = screen.getByPlaceholderText("Search...");
    expect(inputElement).toHaveAttribute("id", "search-input");
  });

  it("form has flex layout classes for responsiveness", (): void => {
    render(<SearchInput {...defaultProps} />);
    const formElement: HTMLFormElement = screen.getByPlaceholderText("Search...").closest("form") as HTMLFormElement;
    expect(formElement).toHaveClass("flex", "flex-col", "sm:flex-row", "gap-3");
  });

  it("prevents default form submission behavior", (): void => {
    const preventDefaultSpy: jest.Mock = jest.fn();
    const mockEvent: Partial<FormEvent<HTMLFormElement>> = {
      preventDefault: preventDefaultSpy,
    };
    
    render(<SearchInput {...defaultProps} />);
    const formElement: HTMLFormElement = screen.getByPlaceholderText("Search...").closest("form") as HTMLFormElement;
    fireEvent.submit(formElement, mockEvent);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
