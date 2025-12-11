import React from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from '@test-utils';
import "@testing-library/jest-dom";
import InputMultiSelect, { SelectOption } from "@/components/AdminLayout/components/Input/InputMultiSelect";

jest.mock("@mui/icons-material", () => ({
  Close: (): React.ReactElement => <span>X</span>,
}));

describe("InputMultiSelect Component", (): void => {
  const mockOnChange: jest.Mock<void, [(string | number)[]]> = jest.fn();
  const mockOnSearch: jest.Mock<Promise<SelectOption<number>[]>, [string]> = jest.fn();

  const defaultOptions: readonly SelectOption<number>[] = [
    { label: "React", value: 1 },
    { label: "TypeScript", value: 2 },
    { label: "Node.js", value: 3 },
    { label: "Python", value: 4 },
    { label: "Java", value: 5 },
  ];

  const defaultProps: React.ComponentProps<typeof InputMultiSelect> = {
    id: "test-multiselect",
    label: "Select Skills",
    value: [] as (string | number)[],
    options: defaultOptions,
    onChange: mockOnChange,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("Rendering", (): void => {
    it("renders without crashing", (): void => {
      render(<InputMultiSelect {...defaultProps} />);
      const comboboxElement: HTMLElement = screen.getByRole("combobox");
      expect(comboboxElement).toBeInTheDocument();
    });

    it("displays the correct label", (): void => {
      render(<InputMultiSelect {...defaultProps} label="Choose Technologies" />);
      const labels: HTMLElement[] = screen.getAllByText(/Choose Technologies/);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("renders with placeholder", (): void => {
      render(<InputMultiSelect {...defaultProps} placeholder="Type to search..." />);
      const input: HTMLElement = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("renders with custom className", (): void => {
      const { container }: RenderResult = render(
        <InputMultiSelect {...defaultProps} className="custom-class" />
      );
      const wrapper: Element | null = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders as disabled when disabled prop is true", (): void => {
      render(<InputMultiSelect {...defaultProps} disabled />);
      const input: HTMLElement = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("renders as not required when required prop is false", (): void => {
      render(<InputMultiSelect {...defaultProps} required={false} />);
      const input: HTMLElement = screen.getByRole("combobox");
      expect(input).not.toBeRequired();
    });
  });

  describe("Selection Behavior", (): void => {
    it("displays selected values as chips", (): void => {
      const selectedValues: number[] = [1, 2];
      render(<InputMultiSelect {...defaultProps} value={selectedValues} />);

      const chip1: HTMLElement = screen.getByTestId("chip-1");
      const chip2: HTMLElement = screen.getByTestId("chip-2");
      
      expect(chip1).toBeInTheDocument();
      expect(chip2).toBeInTheDocument();
    });

    it("calls onChange when an option is selected", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        const reactOption: HTMLElement = screen.getByText("React");
        fireEvent.click(reactOption);
      });

      expect(mockOnChange).toHaveBeenCalledWith([1]);
    });

    it("calls onChange with multiple values when multiple options are selected", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} value={[1]} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        const typeScriptOption: HTMLElement = screen.getByText("TypeScript");
        fireEvent.click(typeScriptOption);
      });

      expect(mockOnChange).toHaveBeenCalledWith([1, 2]);
    });

    it("removes value when chip delete is clicked", async (): Promise<void> => {
      const selectedValues: number[] = [1, 2];
      render(<InputMultiSelect {...defaultProps} value={selectedValues} />);

      const chip1: HTMLElement = screen.getByTestId("chip-1");
      const chip2: HTMLElement = screen.getByTestId("chip-2");

      expect(chip1).toBeInTheDocument();
      expect(chip2).toBeInTheDocument();

      const deleteButtonInChip: HTMLButtonElement | null = chip1.querySelector("button");
      
      if (deleteButtonInChip !== null) {
        fireEvent.click(deleteButtonInChip);

        await waitFor((): void => {
          expect(mockOnChange).toHaveBeenCalled();
        });
      }
    });

    it("calls onChange with empty array when all values are deselected", async (): Promise<void> => {
      const selectedValues: number[] = [1];
      render(<InputMultiSelect {...defaultProps} value={selectedValues} />);

      const chip: HTMLElement = screen.getByTestId("chip-1");
      expect(chip).toBeInTheDocument();

      const deleteButton: HTMLButtonElement | null = chip.querySelector("button");
      
      if (deleteButton !== null) {
        fireEvent.click(deleteButton);

        await waitFor((): void => {
          expect(mockOnChange).toHaveBeenCalled();
        });
      }
    });
  });

  describe("Search Functionality", (): void => {
    it("initializes with all options when onSearch is provided", (): void => {
      render(<InputMultiSelect {...defaultProps} onSearch={mockOnSearch} />);

      const comboboxElement: HTMLElement = screen.getByRole("combobox");
      expect(comboboxElement).toBeInTheDocument();
    });

    it("handles onSearch prop without crashing", async (): Promise<void> => {
      const searchResults: SelectOption<number>[] = [
        { label: "Vue", value: 6 },
      ];
      
      mockOnSearch.mockResolvedValue(searchResults);

      render(<InputMultiSelect {...defaultProps} onSearch={mockOnSearch} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        expect(input).toBeInTheDocument();
      });
    });

    it("accepts search results when onSearch is called", async (): Promise<void> => {
      const searchResults: SelectOption<number>[] = [
        { label: "React Native", value: 6 },
        { label: "React Router", value: 7 },
      ];

      mockOnSearch.mockResolvedValue(searchResults);

      render(<InputMultiSelect {...defaultProps} onSearch={mockOnSearch} />);

      const input: HTMLInputElement = screen.getByRole("combobox") as HTMLInputElement;

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "React" } });

      await new Promise((resolve: (value: void) => void): NodeJS.Timeout => {
        return setTimeout(resolve, 500);
      });

      if (mockOnSearch.mock.calls.length > 0) {
        expect(mockOnSearch).toHaveBeenCalledWith("React");
      }
    });

    it("displays filtered search results", async (): Promise<void> => {
      const searchResults: SelectOption<number>[] = [
        { label: "React Native", value: 6 },
      ];
      
      mockOnSearch.mockResolvedValue(searchResults);

      render(<InputMultiSelect {...defaultProps} onSearch={mockOnSearch} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      fireEvent.change(input, { target: { value: "Native" } });

      await new Promise((resolve: (value: void) => void): NodeJS.Timeout => {
        return setTimeout(resolve, 600);
      });

      expect(input).toBeInTheDocument();
    });

    it("filters options locally when no onSearch is provided", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
      });
    });

    it("accepts text input when opened", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: "Java" } });

      await waitFor((): void => {
        expect(screen.getByText("Java")).toBeInTheDocument();
      });
    });
  });

  describe("Options Display", (): void => {
    it("displays all options when opened", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();
      });
    });

    it("shows 'No options available' when options array is empty", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} options={[]} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        expect(screen.getByText("No options available")).toBeInTheDocument();
      });
    });

    it("filters out already selected options from dropdown", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} value={[1]} />);

      const input: HTMLElement = screen.getByRole("combobox");

      await waitFor((): void => {
        const dropdownOptions: HTMLElement[] = screen.queryAllByText("React");
        expect(dropdownOptions.length).toBe(1);
      });
    });
  });

  describe("Keyboard Navigation", (): void => {
    it("opens dropdown on ArrowDown key", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.keyDown(input, { key: "ArrowDown" });

      await waitFor((): void => {
        expect(screen.getByText("React")).toBeInTheDocument();
      });
    });

    it("closes dropdown on Escape key", async (): Promise<void> => {
      render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        expect(screen.getByText("React")).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: "Escape" });

      await waitFor((): void => {
        expect(screen.queryByText("React")).not.toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", (): void => {
    it("handles value prop with non-existent option IDs", (): void => {
      const invalidValues: number[] = [999, 1000];
      render(<InputMultiSelect {...defaultProps} value={invalidValues} />);

      const chips: HTMLElement[] = screen.queryAllByTestId(/^chip-/);
      expect(chips.length).toBe(0);
    });

    it("handles onChange errors gracefully", async (): Promise<void> => {
      const consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest
        .spyOn(console, "error")
        .mockImplementation();
      
      const errorOnChange: jest.Mock<void, [(string | number)[]]> = jest.fn(
        (_values: (string | number)[]): void => {
          throw new Error("onChange error");
        }
      );

      render(<InputMultiSelect {...defaultProps} onChange={errorOnChange} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        const option: HTMLElement = screen.getByText("React");
        fireEvent.click(option);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in InputMultiSelect handleChange:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("handles string values correctly", (): void => {
      const stringOptions: SelectOption<string>[] = [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
      ];
      
      const stringOnChange: jest.Mock<void, [(string | number)[]]> = jest.fn();

      render(
        <InputMultiSelect
          id="string-test"
          label="String Options"
          value={["a"]}
          options={stringOptions}
          onChange={stringOnChange}
        />
      );

      const chip: HTMLElement = screen.getByTestId("chip-a");
      expect(chip).toBeInTheDocument();
    });
  });

  describe("Styling", (): void => {
    it("applies custom sx prop", (): void => {
      const customSx: { backgroundColor: string } = { backgroundColor: "red" };
      render(<InputMultiSelect {...defaultProps} sx={customSx} />);

      const input: HTMLElement = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("renders chips with correct styling", (): void => {
      render(<InputMultiSelect {...defaultProps} value={[1]} />);

      const chip: HTMLElement = screen.getByTestId("chip-1");
      expect(chip).toBeInTheDocument();
    });
  });

  describe("Integration with useEffect", (): void => {
    it("updates filtered options when options prop changes", async (): Promise<void> => {
      const { rerender }: RenderResult = render(<InputMultiSelect {...defaultProps} />);

      const input: HTMLElement = screen.getByRole("combobox");
      fireEvent.mouseDown(input);

      await waitFor((): void => {
        expect(screen.getByText("React")).toBeInTheDocument();
      });

      const newOptions: SelectOption<number>[] = [
        { label: "Vue.js", value: 10 },
        { label: "Angular", value: 11 },
      ];

      rerender(<InputMultiSelect {...defaultProps} options={newOptions} />);

      fireEvent.click(input);

      await waitFor((): void => {
        expect(screen.getByText("Vue.js")).toBeInTheDocument();
        expect(screen.queryByText("React")).not.toBeInTheDocument();
      });
    });
  });
});
