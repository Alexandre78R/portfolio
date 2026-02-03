import React from "react";
import { render, screen, fireEvent } from '@test-utils';
import "@testing-library/jest-dom";
import ActionButton, { ActionItem } from "@/components/AdminLayout/components/Button/ActionButton";

const MockIcon: React.FC<React.SVGProps<SVGSVGElement>> = jest.fn(
  (props) => <svg {...props} data-testid="mock-icon" />
);

interface MockRow {
  id: number;
  name: string;
  isActive?: boolean;
}

const mockRowDefault: MockRow = { id: 1, name: "Default Row", isActive: true };
const mockRowUndefined: MockRow = { id: 2, name: "Undefined Row", isActive: undefined };

const mockOnClickEdit: jest.Mock<void, [MockRow]> = jest.fn();
const mockOnClickDelete: jest.Mock<void, [MockRow]> = jest.fn();
const mockOnClickCustom: jest.Mock<void, [MockRow]> = jest.fn();

const createMockActions = (): ActionItem<MockRow>[] => [
  {
    icon: MockIcon,
    label: "Edit",
    onClick: mockOnClickEdit,
    colorClass: "bg-red-500",
  },
  {
    icon: MockIcon,
    label: "Delete",
    onClick: mockOnClickDelete,
  },
  {
    icon: MockIcon,
    label: "Custom",
    onClick: mockOnClickCustom,
    colorClass: "bg-blue-600",
  },
];

describe("ActionButton Component", () => {
  let renderedButtons: HTMLElement[] = [] as [];
  let renderedIcons: HTMLElement[] = [] as [];
  let containerDiv: HTMLElement | null = null as null;

  beforeEach(() => {
    jest.clearAllMocks();
    renderedButtons = [];
    renderedIcons = [];
    containerDiv = null;
  });

  test("renders all action buttons with proper titles and icons", () => {
    render(<ActionButton row={mockRowDefault} actions={createMockActions()} />);

    renderedButtons = screen.getAllByRole("button");
    renderedIcons = screen.getAllByTestId("mock-icon");
    containerDiv = renderedButtons[0].parentElement;

    expect(renderedButtons).toHaveLength(3);
    expect(renderedButtons[0]).toHaveAttribute("title", "Edit");
    expect(renderedButtons[1]).toHaveAttribute("title", "Delete");
    expect(renderedButtons[2]).toHaveAttribute("title", "Custom");

    expect(renderedIcons).toHaveLength(3);
  });

  test("calls onClick handler with correct row when buttons are clicked", () => {
    render(<ActionButton row={mockRowDefault} actions={createMockActions()} />);

    renderedButtons = screen.getAllByRole("button");

    const buttonEdit: HTMLElement = renderedButtons[0] as HTMLElement;
    const buttonDelete: HTMLElement = renderedButtons[1] as HTMLElement;
    const buttonCustom: HTMLElement = renderedButtons[2] as HTMLElement;

    fireEvent.click(buttonEdit);
    fireEvent.click(buttonDelete);
    fireEvent.click(buttonCustom);

    expect(mockOnClickEdit).toHaveBeenCalledTimes(1);
    expect(mockOnClickEdit).toHaveBeenCalledWith(mockRowDefault);

    expect(mockOnClickDelete).toHaveBeenCalledTimes(1);
    expect(mockOnClickDelete).toHaveBeenCalledWith(mockRowDefault);

    expect(mockOnClickCustom).toHaveBeenCalledTimes(1);
    expect(mockOnClickCustom).toHaveBeenCalledWith(mockRowDefault);
  });

  test("applies correct color classes for buttons", () => {
    render(<ActionButton row={mockRowDefault} actions={createMockActions()} />);
    renderedButtons = screen.getAllByRole("button");

    const buttonEdit: HTMLElement = renderedButtons[0] as HTMLElement;
    const buttonDelete: HTMLElement = renderedButtons[1] as HTMLElement;
    const buttonCustom: HTMLElement = renderedButtons[2] as HTMLElement;

    expect(buttonEdit).toHaveClass("bg-red-500");
    expect(buttonDelete).toHaveClass("bg-primary/90");
    expect(buttonCustom).toHaveClass("bg-blue-600");
  });

  test("renders custom gap between buttons", () => {
    const mockGap: string = "gap-8";
    render(<ActionButton row={mockRowDefault} actions={createMockActions()} gap={mockGap} />);

    renderedButtons = screen.getAllByRole("button");
    containerDiv = renderedButtons[0].parentElement;

    expect(containerDiv).toHaveClass(mockGap);
  });

  test("handles empty actions array gracefully", () => {
    const emptyActions: ActionItem<MockRow>[] = [];
    render(<ActionButton row={mockRowDefault} actions={emptyActions} />);

    renderedButtons = screen.queryAllByRole("button");
    expect(renderedButtons).toHaveLength(0);
  });

  test("handles row with undefined values without crashing", () => {
    render(<ActionButton row={mockRowUndefined} actions={createMockActions()} />);
    renderedButtons = screen.getAllByRole("button");

    const buttonEdit: HTMLElement = renderedButtons[0] as HTMLElement;
    fireEvent.click(buttonEdit);
    expect(mockOnClickEdit).toHaveBeenCalledWith(mockRowUndefined);
  });

  test("each button renders an icon with correct size", () => {
    render(<ActionButton row={mockRowDefault} actions={createMockActions()} />);
    renderedIcons = screen.getAllByTestId("mock-icon");

    renderedIcons.forEach((icon: HTMLElement) => {
      expect(icon).toHaveClass("h-4 w-4");
    });
  });
});
