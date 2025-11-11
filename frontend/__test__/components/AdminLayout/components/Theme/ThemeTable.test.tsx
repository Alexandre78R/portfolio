import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Lang from "@/lang/typeLang";
import { ActionItem } from "@/components/AdminLayout/components/Button/ActionButton";
import ThemeTable, { ThemeRow} from "@/components/AdminLayout/components/Theme/ThemeTable";

jest.mock("@/components/AdminLayout/components/Button/ActionButton", () => ({
  __esModule: true,
  default: ({
    row,
    actions,
  }: {
    row: ThemeRow;
    actions: ActionItem<ThemeRow>[];
  }): React.ReactElement => (
    <div>
      {actions.map((action: ActionItem<ThemeRow>, index: number) => (
        <button
          key={index}
          onClick={(): void => action.onClick(row)}
          data-testid={`${action.label}-${row.id}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

// --- Mock translations ---
const translations: Lang = {
  messageAdminThemeColumnName: "Name",
  messageAdminThemeColumnNameEN: "Name EN",
  messageAdminThemeColumnNameFR: "Name FR",
  messageAdminThemeColumnAction: "Actions",
} as Lang;

// --- Mock theme data ---
const themes: ThemeRow[] = [
  { id: "1", name: "Theme1", nameEN: "ThemeEN1", nameFR: "ThemeFR1", visible: true },
  { id: "2", name: "Theme2", nameEN: "ThemeEN2", nameFR: "ThemeFR2", visible: false },
];

describe("ThemeTable Component", (): void => {
  let mockOnEdit: jest.Mock<void, [ThemeRow]>;
  let mockOnDelete: jest.Mock<void, [string]>;

  beforeEach((): void => {
    mockOnEdit = jest.fn<void, [ThemeRow]>();
    mockOnDelete = jest.fn<void, [string]>();
  });

  it("renders table headers correctly", (): void => {
    render(<ThemeTable themes={themes} translations={translations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(translations.messageAdminThemeColumnName)).toBeInTheDocument();
    expect(screen.getByText(translations.messageAdminThemeColumnNameEN)).toBeInTheDocument();
    expect(screen.getByText(translations.messageAdminThemeColumnNameFR)).toBeInTheDocument();
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.getByText(translations.messageAdminThemeColumnAction)).toBeInTheDocument();
  });

  it("renders theme data correctly including visibility", (): void => {
    render(<ThemeTable themes={themes} translations={translations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText("Theme1")).toBeInTheDocument();
    expect(screen.getByText("ThemeEN1")).toBeInTheDocument();
    expect(screen.getByText("ThemeFR1")).toBeInTheDocument();
    expect(screen.getByText("Theme2")).toBeInTheDocument();
    expect(screen.getByText("ThemeEN2")).toBeInTheDocument();
    expect(screen.getByText("ThemeFR2")).toBeInTheDocument();

    expect(screen.getByText("✅")).toBeInTheDocument();
    expect(screen.getByText("❌")).toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", (): void => {
    render(<ThemeTable themes={themes} translations={translations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton: HTMLElement = screen.getByTestId("Edit-1");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(themes[0]);
  });

  it("calls onDelete when Delete button is clicked", (): void => {
    render(<ThemeTable themes={themes} translations={translations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton: HTMLElement = screen.getByTestId("Delete-2");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith("2");
  });

  it("renders empty state correctly when no themes are provided", (): void => {
    render(<ThemeTable themes={[]} translations={translations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.queryByText("Theme1")).toBeNull();
    expect(screen.queryByText("Edit-1")).toBeNull();
  });
});
