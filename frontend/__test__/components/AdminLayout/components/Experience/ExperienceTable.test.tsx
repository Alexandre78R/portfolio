import React, { ReactElement } from "react";
import { 
  render, 
  screen, 
  fireEvent 
} from "@testing-library/react";
import "@testing-library/jest-dom";

import ExperienceTable, { 
  ExperienceRow 
} from "@/components/AdminLayout/components/Experience/ExperienceTable";
import Lang from "@/lang/typeLang";
import type { ColumnDef } from "@/components/AdminLayout/components/Table/Table";

let capturedOnEdit: ((experience: ExperienceRow) => void) | undefined;
let capturedOnDelete: ((experienceId: number) => void) | undefined;

const mockTableColumns: ColumnDef<ExperienceRow>[] = [];
const mockTableData: ExperienceRow[] = [];

interface MockTableProps {
  columns: ColumnDef<ExperienceRow>[];
  data: ExperienceRow[];
}

jest.mock("@/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: (props: MockTableProps): ReactElement => {
    const onEdit: ((experience: ExperienceRow) => void) | undefined = capturedOnEdit;
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
                data-testid={`cell-${rowIndex}-job`} 
                role="cell"
              >
                {row.jobFR}
              </span>
              <span 
                data-testid={`cell-${rowIndex}-business`} 
                role="cell"
              >
                {row.business}
              </span>
              <span 
                data-testid={`cell-${rowIndex}-contract`} 
                role="cell"
              >
                {row.employmentContractFR}
              </span>
              <span 
                data-testid={`cell-${rowIndex}-year`} 
                role="cell"
              >
                {rowIndex === 0 ? "6/2023" : "2021"}
              </span>

              <div data-testid={`actions-${rowIndex}`} role="cell">
                <div data-testid="action-buttons" role="group">
                  <button
                    data-testid={`edit-btn-${rowIndex}`}
                    type="button"
                    onClick={() => onEdit?.(row)}
                    aria-label="Edit experience"
                  >
                    Edit
                  </button>
                  <button
                    data-testid={`delete-btn-${rowIndex}`}
                    type="button"
                    className="bg-red-500/90 hover:bg-red-500"
                    onClick={() => onDelete?.(row.id)}
                    aria-label="Delete experience"
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
  messageAdminExperienceColumnJob: "Job",
  messageAdminExperienceColumnBusiness: "Business",
  messageAdminExperienceColumnContract: "Contract",
  messageAdminExperienceColumnYear: "Year",
  messageAdminExperienceColumnAction: "Actions",
} as Lang;

const mockExperiencesData: ExperienceRow[] = [
  {
    id: 1,
    jobEN: "Software Engineer",
    jobFR: "Ingénieur Logiciel",
    business: "TechCorp",
    employmentContractEN: "CDI",
    employmentContractFR: "Contrat à durée indéterminée",
    startDateEN: "2023-06-01",
    startDateFR: "01/06/2023",
    endDateEN: "",
    endDateFR: "",
    month: 6,
    typeEN: "Full-time",
    typeFR: "Temps plein",
  },
  {
    id: 2,
    jobEN: "Junior Developer", 
    jobFR: "Développeur Junior",
    business: "Startup Inc",
    employmentContractEN: "CDD",
    employmentContractFR: "Contrat à durée déterminée",
    startDateEN: "2021-03-15",
    startDateFR: "15/03/2021",
    endDateEN: "2022-12-31",
    endDateFR: "31/12/2022",
    month: 1,
    typeEN: "Contract",
    typeFR: "Contrat",
  },
];

describe("ExperienceTable Component", () => {
  const mockOnEditCallback: jest.Mock<void, [experience: ExperienceRow]> = jest.fn();
  const mockOnDeleteCallback: jest.Mock<void, [experienceId: number]> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    capturedOnEdit = undefined;
    capturedOnDelete = undefined;
  });

  it("renders table headers correctly", (): void => {
    render(
      <ExperienceTable
        experiences={mockExperiencesData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const mockTableElement: HTMLElement = screen.getByTestId("mock-table");
    expect(mockTableElement).toBeInTheDocument();

    const jobHeaderElement: HTMLElement = screen.getByText("Job");
    const businessHeaderElement: HTMLElement = screen.getByText("Business");
    const contractHeaderElement: HTMLElement = screen.getByText("Contract");
    const yearHeaderElement: HTMLElement = screen.getByText("Year");
    const actionsHeaderElement: HTMLElement = screen.getByText("Actions");

    expect(jobHeaderElement).toBeInTheDocument();
    expect(businessHeaderElement).toBeInTheDocument();
    expect(contractHeaderElement).toBeInTheDocument();
    expect(yearHeaderElement).toBeInTheDocument();
    expect(actionsHeaderElement).toBeInTheDocument();
  });

  it("renders experience rows data correctly", (): void => {
    render(
      <ExperienceTable
        experiences={mockExperiencesData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const firstRowJobCell: HTMLElement = screen.getByTestId("cell-0-job");
    const firstRowBusinessCell: HTMLElement = screen.getByTestId("cell-0-business");
    const firstRowContractCell: HTMLElement = screen.getByTestId("cell-0-contract");
    const firstRowYearCell: HTMLElement = screen.getByTestId("cell-0-year");

    expect(firstRowJobCell).toHaveTextContent("Ingénieur Logiciel");
    expect(firstRowBusinessCell).toHaveTextContent("TechCorp");
    expect(firstRowContractCell).toHaveTextContent("Contrat à durée indéterminée");
    expect(firstRowYearCell).toHaveTextContent("6/2023");

    const secondRowJobCell: HTMLElement = screen.getByTestId("cell-1-job");
    const secondRowYearCell: HTMLElement = screen.getByTestId("cell-1-year");

    expect(secondRowJobCell).toHaveTextContent("Développeur Junior");
    expect(secondRowYearCell).toHaveTextContent("2021");
  });

  it("renders action buttons correctly", (): void => {
    render(
      <ExperienceTable
        experiences={mockExperiencesData}
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
      <ExperienceTable
        experiences={mockExperiencesData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const editButtonElement: HTMLButtonElement = screen.getByTestId("edit-btn-0") as HTMLButtonElement;
    fireEvent.click(editButtonElement);

    expect(mockOnEditCallback).toHaveBeenCalledTimes(1);
    expect(mockOnEditCallback).toHaveBeenCalledWith(mockExperiencesData[0]);
  });

  it("calls onDelete callback when delete button is clicked", (): void => {
    capturedOnEdit = mockOnEditCallback;
    capturedOnDelete = mockOnDeleteCallback;

    render(
      <ExperienceTable
        experiences={mockExperiencesData}
        translations={translationsMock}
        onEdit={mockOnEditCallback}
        onDelete={mockOnDeleteCallback}
      />
    );

    const deleteButtonElement: HTMLButtonElement = screen.getByTestId("delete-btn-0") as HTMLButtonElement;
    fireEvent.click(deleteButtonElement);

    expect(mockOnDeleteCallback).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteCallback).toHaveBeenCalledWith(mockExperiencesData[0].id);
  });

  it("handles empty experiences array gracefully", (): void => {
    capturedOnEdit = mockOnEditCallback;
    capturedOnDelete = mockOnDeleteCallback;

    render(
      <ExperienceTable
        experiences={[]}
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
