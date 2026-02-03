import React, { ReactElement } from "react";
import { 
  render, 
  screen, 
  fireEvent 
} from '@test-utils';
import "@testing-library/jest-dom";

import EducationTable, { 
  EducationRow 
} from "@/components/AdminLayout/components/Education/EducationTable";
import Lang from "@/lang/typeLang";
import type { ColumnDef } from "@/components/AdminLayout/components/Table/Table";

let capturedOnEdit: ((education: EducationRow) => void) | undefined;
let capturedOnDelete: ((educationId: number) => void) | undefined;

const mockTableColumns: ColumnDef<EducationRow>[] = [];
const mockTableData: EducationRow[] = [];

interface MockTableProps {
  columns: ColumnDef<EducationRow>[];
  data: EducationRow[];
}

jest.mock("@/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: (props: MockTableProps): ReactElement => {
    const onEdit: ((education: EducationRow) => void) | undefined = capturedOnEdit;
    const onDelete: ((id: number) => void) | undefined = capturedOnDelete;

    return (
      <div data-testid="mock-table" role="table">

        <div data-testid="table-headers" role="rowgroup">
          {props.columns.map((column, index) => (
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
          {props.data.map((row, rowIndex) => (
            <div key={rowIndex} data-testid={`row-${rowIndex}`} role="row">
              <span 
                data-testid={`cell-${rowIndex}-school`} 
                role="cell"
              >
                {row.school}
              </span>
              <span 
                data-testid={`cell-${rowIndex}-title`} 
                role="cell"
              >
                {row.titleFR}
              </span>
              <span 
                data-testid={`cell-${rowIndex}-diploma`} 
                role="cell"
              >
                {row.diplomaLevelFR}
              </span>
              <span 
                data-testid={`cell-${rowIndex}-year`} 
                role="cell"
              >
                {row.month ? `${row.month}/${row.year}` : row.year}
              </span>

              <div data-testid={`actions-${rowIndex}`} role="cell">
                <div data-testid="action-buttons" role="group">
                  <button
                    data-testid={`edit-btn-${rowIndex}`}
                    type="button"
                    onClick={() => onEdit?.(row)}
                    aria-label="Edit education"
                  >
                    Edit
                  </button>
                  <button
                    data-testid={`delete-btn-${rowIndex}`}
                    type="button"
                    className="bg-red-500/90 hover:bg-red-500"
                    onClick={() => onDelete?.(row.id)}
                    aria-label="Delete education"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
}));

const translationsMock: Lang = {
  messageAdminEducationColumnSchool: "School",
  messageAdminEducationColumnTitle: "Title",
  messageAdminEducationColumnDiploma: "Diploma",
  messageAdminEducationColumnYear: "Year",
  messageAdminEducationColumnAction: "Actions",
} as Lang;

const mockEducationsData: EducationRow[] = [
  {
    id: 1,
    school: "University Paris",
    location: "Paris",
    titleFR: "Master Informatique",
    titleEN: "Master Computer Science",
    diplomaLevelFR: "Master 2",
    diplomaLevelEN: "Master's Degree",
    year: 2023,
    month: 6,
    typeFR: "Diplôme",
    typeEN: "Degree",
  },
  {
    id: 2,
    school: "Lycée Victor Hugo",
    location: "Paris",
    titleFR: "Baccalauréat S",
    titleEN: "High School Diploma",
    diplomaLevelFR: "Bac",
    diplomaLevelEN: "Baccalaureate",
    year: 2018,
    month: null,
    typeFR: "Examen",
    typeEN: "Exam",
  },
];

describe("EducationTable Component", () => {
  const mockOnEditCallback: jest.Mock< void, [education: EducationRow] > = jest.fn();
  const mockOnDeleteCallback: jest.Mock< void, [educationId: number] > = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    capturedOnEdit = undefined;
    capturedOnDelete = undefined;
  });

  it("renders table headers correctly", (): void => {
    render(
      <EducationTable
        educations={mockEducationsData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const mockTableElement: HTMLElement = screen.getByTestId("mock-table");
    expect(mockTableElement).toBeInTheDocument();

    const schoolHeaderElement: HTMLElement = screen.getByText("School");
    const titleHeaderElement: HTMLElement = screen.getByText("Title");
    const diplomaHeaderElement: HTMLElement = screen.getByText("Diploma");
    const yearHeaderElement: HTMLElement = screen.getByText("Year");
    const actionsHeaderElement: HTMLElement = screen.getByText("Actions");

    expect(schoolHeaderElement).toBeInTheDocument();
    expect(titleHeaderElement).toBeInTheDocument();
    expect(diplomaHeaderElement).toBeInTheDocument();
    expect(yearHeaderElement).toBeInTheDocument();
    expect(actionsHeaderElement).toBeInTheDocument();
  });

  it("renders education rows data correctly", (): void => {
    render(
      <EducationTable
        educations={mockEducationsData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const firstRowSchoolCell: HTMLElement = screen.getByTestId("cell-0-school");
    const firstRowTitleCell: HTMLElement = screen.getByTestId("cell-0-title");
    const firstRowDiplomaCell: HTMLElement = screen.getByTestId("cell-0-diploma");
    const firstRowYearCell: HTMLElement = screen.getByTestId("cell-0-year");

    expect(firstRowSchoolCell).toHaveTextContent("University Paris");
    expect(firstRowTitleCell).toHaveTextContent("Master Informatique");
    expect(firstRowDiplomaCell).toHaveTextContent("Master 2");
    expect(firstRowYearCell).toHaveTextContent("6/2023");

    const secondRowSchoolCell: HTMLElement = screen.getByTestId("cell-1-school");
    const secondRowYearCell: HTMLElement = screen.getByTestId("cell-1-year");

    expect(secondRowSchoolCell).toHaveTextContent("Lycée Victor Hugo");
    expect(secondRowYearCell).toHaveTextContent("2018");
  });

  it("renders action buttons correctly", (): void => {
    render(
      <EducationTable
        educations={mockEducationsData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const editButtonFirstRow: HTMLButtonElement = screen.getByTestId("edit-btn-0") as HTMLButtonElement;
    const deleteButtonFirstRow: HTMLButtonElement = screen.getByTestId("delete-btn-0") as HTMLButtonElement;

    expect(editButtonFirstRow).toBeInTheDocument();
    expect(deleteButtonFirstRow).toBeInTheDocument();
    expect(deleteButtonFirstRow).toHaveClass("bg-red-500/90");
  });

  it("calls onEdit callback when edit button is clicked", (): void => {
    capturedOnEdit = mockOnEditCallback;
    capturedOnDelete = mockOnDeleteCallback;

    render(
      <EducationTable
        educations={mockEducationsData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const editButtonElement: HTMLButtonElement = screen.getByTestId("edit-btn-0") as HTMLButtonElement;
    fireEvent.click(editButtonElement);

    expect(mockOnEditCallback).toHaveBeenCalledTimes(1);
    expect(mockOnEditCallback).toHaveBeenCalledWith(mockEducationsData[0]);
  });

  it("calls onDelete callback when delete button is clicked", (): void => {
    capturedOnEdit = mockOnEditCallback;
    capturedOnDelete = mockOnDeleteCallback;

    render(
      <EducationTable
        educations={mockEducationsData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const deleteButtonElement: HTMLButtonElement = screen.getByTestId("delete-btn-0") as HTMLButtonElement;
    fireEvent.click(deleteButtonElement);

    expect(mockOnDeleteCallback).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteCallback).toHaveBeenCalledWith(mockEducationsData[0].id);
  });

  it("handles empty educations array gracefully", (): void => {
    capturedOnEdit = mockOnEditCallback;
    capturedOnDelete = mockOnDeleteCallback;

    render(
      <EducationTable
        educations={[]}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const tableRowsContainer: HTMLElement = screen.getByTestId("table-rows");
    expect(tableRowsContainer).toBeInTheDocument();
    expect(screen.queryAllByTestId(/^edit-btn-/)).toHaveLength(0);
  });
});
