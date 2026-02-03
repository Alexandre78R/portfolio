import React, { ReactElement } from "react";
import { render, screen } from '@test-utils';
import "@testing-library/jest-dom";
import SkillCategoryTable from "@/components/AdminLayout/components/SkillCategory/SkillCategoryTable";
import Lang from "@/lang/typeLang";

interface CategoryRow {
  id: number;
  categoryEN: string;
  categoryFR: string;
  skillCount: number;
}

interface TableColumn {
  accessor: string | ((row: CategoryRow) => React.ReactNode);
  header: string;
}

jest.mock("@/components/AdminLayout/components/Table/Table", (): object => ({
  __esModule: true,
  default: (props: {
    data: CategoryRow[];
    columns: TableColumn[];
  }): ReactElement => (
    <table data-testid="table">
      <thead>
        <tr>
          {props.columns.map((col: TableColumn, index: number): ReactElement => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((row: CategoryRow, idx: number): ReactElement => (
          <tr key={idx}>
            {props.columns.map((col: TableColumn, colIndex: number): ReactElement => {
              const content: React.ReactNode =
                typeof col.accessor === "function"
                  ? col.accessor(row)
                  : row[col.accessor as keyof CategoryRow];
              return <td key={colIndex}>{content}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock("@/components/AdminLayout/components/Button/ActionButton", (): object => ({
  __esModule: true,
  default: (props: { actions: Array<{ id: string }> }): ReactElement => (
    <div data-testid="action-button">{props.actions.length} actions</div>
  ),
}));

jest.mock("lucide-react", (): object => ({
  Edit: (): ReactElement => <span data-testid="edit-icon">✏️</span>,
  Trash2: (): ReactElement => <span data-testid="delete-icon">🗑️</span>,
}));

const mockCategories: CategoryRow[] = [
  { id: 1, categoryEN: "Frontend", categoryFR: "Frontal", skillCount: 5 },
  { id: 2, categoryEN: "Backend", categoryFR: "Arrière-plan", skillCount: 3 },
];

const mockTranslations: Lang = {
  messageAdminSkillCategoryColumnEN: "Category (EN)",
  messageAdminSkillCategoryColumnFR: "Category (FR)",
  messageAdminSkillCategoryColumnSkillCount: "Skills",
  messageAdminSkillCategoryColumnAction: "Actions",
} as Lang;

describe("SkillCategoryTable", (): void => {
  const mockOnEdit: jest.Mock<void, [CategoryRow]> = jest.fn();
  const mockOnDelete: jest.Mock<void, [number]> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should render table", (): void => {
    render(
      <SkillCategoryTable
        categories={mockCategories}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  it("should display category names", (): void => {
    render(
      <SkillCategoryTable
        categories={mockCategories}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("should display skill counts", (): void => {
    render(
      <SkillCategoryTable
        categories={mockCategories}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render empty state when no categories", (): void => {
    render(
      <SkillCategoryTable
        categories={[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  it("should render action buttons", (): void => {
    render(
      <SkillCategoryTable
        categories={mockCategories}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const actionButtons: HTMLElement[] = screen.getAllByTestId("action-button");
    expect(actionButtons).toHaveLength(2);
  });

  it("should display category French translations", (): void => {
    render(
      <SkillCategoryTable
        categories={mockCategories}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Frontal")).toBeInTheDocument();
    expect(screen.getByText("Arrière-plan")).toBeInTheDocument();
  });
});
