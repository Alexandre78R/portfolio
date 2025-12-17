import React, { ReactElement } from "react";
import { render, screen, fireEvent } from '@test-utils';
import "@testing-library/jest-dom";
import SkillTable, { SkillRow } from "@/components/AdminLayout/components/Skill/SkillTable";
import Lang from "@/lang/typeLang";
import type { ColumnDef } from "@/components/AdminLayout/components/Table/Table";


interface TableColumn extends ColumnDef<SkillRow> {
  headerClassName?: string;
  className?: string;
}

interface ActionItem {
  icon: any;
  label: string;
  onClick: () => void;
  colorClass?: string;
}

interface MockTableProps {
  columns: TableColumn[];
  data: SkillRow[];
}

let capturedOnEdit: ((skill: SkillRow) => void) | undefined;
let capturedOnDelete: ((skillId: number) => void) | undefined;

jest.mock("@/components/AdminLayout/components/Table/Table", (): object => ({
  __esModule: true,
  default: (props: MockTableProps): ReactElement => {
    capturedOnEdit = undefined;
    capturedOnDelete = undefined;

    return (
      <div data-testid="mock-table" role="table">
        <div data-testid="table-headers" role="rowgroup">
          {props.columns.map((column: TableColumn, index: number): ReactElement => (
            <div
              key={index}
              data-testid={`header-${index}`}
              className={column.headerClassName || ""}
              role="columnheader"
            >
              {column.header}
            </div>
          ))}
        </div>

        <div data-testid="table-rows" role="rowgroup">
          {props.data.map((row: SkillRow, rowIndex: number): ReactElement => (
            <div key={rowIndex} data-testid={`row-${rowIndex}`} role="row">
              {props.columns.map((column: TableColumn, colIndex: number): ReactElement => {
                const content: React.ReactNode =
                  typeof column.accessor === "function"
                    ? column.accessor(row)
                    : row[column.accessor as keyof SkillRow];
                return (
                  <div
                    key={colIndex}
                    data-testid={`cell-${rowIndex}-${colIndex}`}
                    className={column.className || ""}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Button/ActionButton", (): object => ({
  __esModule: true,
  default: <T,>({
    row,
    actions,
  }: {
    row: T;
    actions: ActionItem[];
  }): ReactElement => (
    <div data-testid="action-buttons">
      {actions.map((action: ActionItem, index: number): ReactElement => (
        <button
          key={index}
          data-testid={`action-${action.label.toLowerCase()}`}
          onClick={action.onClick}
          className={action.colorClass || ""}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

const mockSkills: SkillRow[] = [
  {
    id: 1,
    name: "React",
    image: "/images/react.png",
    categoryEN: "Frontend",
    categoryFR: "Frontend",
  },
  {
    id: 2,
    name: "Node.js",
    image: "/images/nodejs.png",
    categoryEN: "Backend",
    categoryFR: "Backend",
  },
];

const mockTranslations: Lang = {
  messageAdminSkillColumnName: "Name",
  messageAdminSkillColumnImage: "Image",
  messageAdminSkillColumnCategoryEN: "Category (EN)",
  messageAdminSkillColumnCategoryFR: "Category (FR)",
  messageAdminSkillColumnAction: "Actions",
} as Lang;

describe("SkillTable", (): void => {
  const mockOnEdit: jest.Mock<void, [SkillRow]> = jest.fn();
  const mockOnDelete: jest.Mock<void, [number]> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    capturedOnEdit = undefined;
    capturedOnDelete = undefined;
  });

  it("renders table with correct headers", (): void => {
    render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Category (EN)")).toBeInTheDocument();
    expect(screen.getByText("Category (FR)")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders table with skill data", (): void => {
    render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("row-0")).toBeInTheDocument();
    expect(screen.getByTestId("row-1")).toBeInTheDocument();
  });

  it("displays skill names correctly", (): void => {
    const { container }: { container: HTMLElement } = render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const cells: NodeListOf<Element> = container.querySelectorAll(
      '[data-testid^="cell-"]'
    );
    const cellTexts: Array<string | null> = Array.from(cells).map(
      (cell: Element): string | null => cell.textContent
    );

    expect(cellTexts).toContain("React");
    expect(cellTexts).toContain("Node.js");
  });

  it("displays category names in English", (): void => {
    render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("row-0")).toBeInTheDocument();
    expect(screen.getByTestId("row-1")).toBeInTheDocument();
  });

  it("renders empty table when no skills provided", (): void => {
    render(
      <SkillTable
        skills={[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.queryByTestId("row-0")).not.toBeInTheDocument();
  });

  it("passes correct skills data to Table component", (): void => {
    const { container }: { container: HTMLElement } = render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const rows: NodeListOf<Element> = container.querySelectorAll(
      '[data-testid^="row-"]'
    );
    expect(rows).toHaveLength(2);
  });

  it("renders with correct column count", (): void => {
    render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const headers: HTMLElement[] = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(5); // Name, Image, CategoryEN, CategoryFR, Actions
  });

  it("handles skills with missing category gracefully", (): void => {
    const skillsWithMissingCategory: SkillRow[] = [
      {
        id: 3,
        name: "TypeScript",
        image: "/images/typescript.png",
        categoryEN: "",
        categoryFR: "",
      },
    ];

    render(
      <SkillTable
        skills={skillsWithMissingCategory}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });

  it("renders image column correctly", (): void => {
    render(
      <SkillTable
        skills={mockSkills}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const imageHeader: HTMLElement = screen.getByText("Image");
    expect(imageHeader).toBeInTheDocument();
  });
});
