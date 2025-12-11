import React, { ReactElement } from "react";
import { 
  render, 
  screen, 
  fireEvent 
} from '@test-utils';
import "@testing-library/jest-dom";

import SocialTable, { 
  SocialRow 
} from "@/components/AdminLayout/components/Social/SocialTable";
import Lang from "@/lang/typeLang";
import type { ColumnDef } from "@/components/AdminLayout/components/Table/Table";

let capturedOnEdit: ((social: SocialRow) => void) | undefined;
let capturedOnDelete: ((socialId: number) => void) | undefined;

const mockTableColumns: ColumnDef<SocialRow>[] = [];
const mockTableData: SocialRow[] = [];

interface MockTableProps {
  columns: ColumnDef<SocialRow>[];
  data: SocialRow[];
}

jest.mock("@/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: (props: MockTableProps): ReactElement => {
    const onEdit: ((social: SocialRow) => void) | undefined = capturedOnEdit;
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
              {props.columns.map((column, colIndex) => {
                const content = typeof column.accessor === "function" 
                  ? column.accessor(row) 
                  : row[column.accessor as keyof SocialRow];
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

const mockTranslations: Lang = {
  messageAdminSocialColumnTitle: "Title",
  messageAdminSocialColumnUrl: "URL",
  messageAdminSocialColumnTab: "Tab",
  messageAdminSocialColumnAction: "Actions",
} as Lang;

const mockSocials: SocialRow[] = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com/user",
    tab: 1,
  },
  {
    id: 2,
    title: "LinkedIn",
    url: "https://linkedin.com/in/user",
    tab: 2,
  },
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("SocialTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  test("should render table with columns", () => {
    render(
      <SocialTable
        socials={mockSocials}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Tab")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("should render social data rows", () => {
    render(
      <SocialTable
        socials={mockSocials}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("https://github.com/user")).toBeInTheDocument();
  });

  test("should render empty table when no data", () => {
    render(
      <SocialTable
        socials={[]}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const table: HTMLElement = screen.getByTestId("mock-table");
    const rows: HTMLElement[] = screen.queryAllByTestId(/^row-/);
    expect(rows).toHaveLength(0);
  });

  test("should pass correct translations", () => {
    const customTranslations: Lang = {
      messageAdminSocialColumnTitle: "Titre",
      messageAdminSocialColumnUrl: "Lien",
      messageAdminSocialColumnTab: "Position",
      messageAdminSocialColumnAction: "Actions",
    } as Lang;

    render(
      <SocialTable
        socials={mockSocials}
        translations={customTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Titre")).toBeInTheDocument();
    expect(screen.getByText("Lien")).toBeInTheDocument();
    expect(screen.getByText("Position")).toBeInTheDocument();
  });

  test("should render correct number of rows", () => {
    render(
      <SocialTable
        socials={mockSocials}
        translations={mockTranslations}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const rows: HTMLElement[] = screen.getAllByTestId(/^row-/);
    expect(rows).toHaveLength(mockSocials.length);
  });
});
