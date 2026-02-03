import React, { ReactElement } from "react";
import { 
  render, 
  screen, 
  fireEvent 
} from '@test-utils';
import "@testing-library/jest-dom";

import ProjectTable, { 
  ProjectRow 
} from "@/components/AdminLayout/components/Project/ProjectTable";
import Lang from "@/lang/typeLang";
import type { ColumnDef } from "@/components/AdminLayout/components/Table/Table";

// Type Definitions
interface MockTableProps {
  columns: ColumnDef<ProjectRow>[];
  data: ProjectRow[];
}

let capturedOnEdit: ((project: ProjectRow) => void) | undefined;
let capturedOnDelete: ((projectId: number) => void) | undefined;

const mockTableColumns: readonly ColumnDef<ProjectRow>[] = [];
const mockTableData: readonly ProjectRow[] = [];

jest.mock("@/components/AdminLayout/components/Table/Table", (): object => ({
  __esModule: true,
  default: (props: MockTableProps): ReactElement => {
    const onEdit: ((project: ProjectRow) => void) | undefined = capturedOnEdit;
    const onDelete: ((id: number) => void) | undefined = capturedOnDelete;

    return (
      <div data-testid="mock-table" role="table">
        <div data-testid="table-headers" role="rowgroup">
          {props.columns.map((column: ColumnDef<ProjectRow>, index: number) => (
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
          {props.data.map((row: ProjectRow, rowIndex: number) => (
            <div key={rowIndex} data-testid={`row-${rowIndex}`} role="row">
              {props.columns.map((column: ColumnDef<ProjectRow>, colIndex: number) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const content: React.ReactNode = (typeof column.accessor === "function" 
                  ? column.accessor(row) 
                  : row[column.accessor as keyof ProjectRow]) as any;
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
    readonly row: T;
    readonly actions: Array<{
      readonly icon: unknown;
      readonly label: string;
      readonly onClick: () => void;
    }>;
  }): ReactElement => (
    <div data-testid="mock-action-button">
      {actions.map((action: { readonly icon: unknown; readonly label: string; readonly onClick: () => void }, index: number) => (
        <button
          key={index}
          data-testid={`action-${action.label}`}
          onClick={(): void => action.onClick()}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

describe("ProjectTable", (): void => {
  const mockTranslations: Lang = {
    messageAdminProjectColumnTitle: "Title",
    messageAdminProjectColumnTypeDisplay: "Type Display",
    messageAdminProjectColumnContentDisplay: "Content Display",
    messageAdminProjectColumnSkills: "Skills",
    messageAdminProjectColumnAction: "Actions",
  } as unknown as Lang;

  const mockProjects: readonly ProjectRow[] = [
    {
      id: 1,
      title: "Project 1",
      descriptionFR: "Description FR 1",
      descriptionEN: "Description EN 1",
      typeDisplay: "image",
      contentDisplay: "full",
      github: "https://github.com/test1",
      skills: [{ id: "1", name: "React", image: "react.png" }],
    },
    {
      id: 2,
      title: "Project 2",
      descriptionFR: "Description FR 2",
      descriptionEN: "Description EN 2",
      typeDisplay: "video",
      contentDisplay: "half",
      github: null,
      skills: [
        { id: "2", name: "Node.js", image: "nodejs.png" },
        { id: "3", name: "TypeScript", image: "ts.png" },
      ],
    },
  ];

  beforeEach((): void => {
    jest.clearAllMocks();
    capturedOnEdit = undefined;
    capturedOnDelete = undefined;
  });

  it("renders table with projects", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });

  it("displays all column headers", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Type Display")).toBeInTheDocument();
    expect(screen.getByText("Content Display")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("displays project titles", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
  });

  it("displays type display values", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("image")).toBeInTheDocument();
    expect(screen.getByText("video")).toBeInTheDocument();
  });

  it("displays content display values", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("full")).toBeInTheDocument();
    expect(screen.getByText("half")).toBeInTheDocument();
  });

  it("displays skills count", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("1 skills")).toBeInTheDocument();
    expect(screen.getByText("2 skills")).toBeInTheDocument();
  });

  it("calls onEdit when edit button clicked", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton: HTMLElement = screen.getAllByTestId("action-Edit")[0];
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProjects[0]);
  });

  it("calls onDelete when delete button clicked", (): void => {
    const mockOnEdit: jest.Mock<void, [ProjectRow]> = jest.fn();
    const mockOnDelete: jest.Mock<void, [number]> = jest.fn();
    capturedOnEdit = mockOnEdit;
    capturedOnDelete = mockOnDelete;

    render(
      <ProjectTable
        projects={mockProjects as ProjectRow[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton: HTMLElement = screen.getAllByTestId("action-Delete")[0];
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockProjects[0].id);
  });
});
