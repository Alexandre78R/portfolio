import React, { type ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMeTable, { type AboutMeRow } from "@/components/AdminLayout/components/AboutMe/AboutMeTable";
import type { ColumnDef } from "@/components/AdminLayout/components/Table/Table";
import type Lang from "@/lang/typeLang";

interface MockTableProps {
  columns: ColumnDef<AboutMeRow>[];
  data: AboutMeRow[];
}

type ActionButtonProps<T> = {
  row: T;
  actions: Array<{ label: string; onClick: () => void }>;
};

jest.mock("@/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: (props: MockTableProps): ReactElement => (
    <div data-testid="mock-table">
      <div data-testid="headers">
        {props.columns.map((column, index: number) => (
          <div key={index} data-testid={`header-${index}`}>
            {column.header}
          </div>
        ))}
      </div>
      <div data-testid="rows">
        {props.data.map((row: AboutMeRow, rowIndex: number) => (
          <div key={rowIndex} data-testid={`row-${rowIndex}`}>
            {props.columns.map((column: ColumnDef<AboutMeRow>, colIndex: number) => {
              const value: React.ReactNode =
                typeof column.accessor === "function"
                  ? column.accessor(row)
                  : row[column.accessor as keyof AboutMeRow];
              return (
                <div key={colIndex} data-testid={`cell-${rowIndex}-${colIndex}`}>
                  {value as React.ReactNode}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Button/ActionButton", () => ({
  __esModule: true,
  default: <T,>({
    actions,
  }: ActionButtonProps<T>): ReactElement => (
    <div data-testid="action-buttons">
      {actions.map((action: { label: string; onClick: () => void }, index: number) => (
        <button key={index} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

describe("AboutMeTable", (): void => {
  const translationsMock: Lang = {
    messageAdminAboutMeColumnTitleFR: "Titre FR",
    messageAdminAboutMeColumnTitleEN: "Titre EN",
    messageAdminAboutMeColumnVisible: "Visible",
    messageAdminAboutMeColumnAction: "Actions",
    messageAdminAboutMeVisibleYes: "Oui",
    messageAdminAboutMeVisibleNo: "Non",
  } as Lang;

  const mockRows: AboutMeRow[] = [
    {
      id: 1,
      titleFR: "<h1>FR</h1>",
      titleEN: "<p>EN</p>",
      descriptionFR: "Desc FR",
      descriptionEN: "Desc EN",
      isVisible: true,
    },
  ];

  const mockOnEdit: jest.Mock<void, [AboutMeRow]> = jest.fn();
  const mockOnDelete: jest.Mock<void, [number]> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should render table headers correctly", (): void => {
    render(
      <AboutMeTable
        aboutMes={mockRows}
        translations={translationsMock}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Titre FR")).toBeInTheDocument();
    expect(screen.getByText("Titre EN")).toBeInTheDocument();
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should render row data with HTML stripped from titles", (): void => {
    render(
      <AboutMeTable
        aboutMes={mockRows}
        translations={translationsMock}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("Oui")).toBeInTheDocument();
  });

  it("should call onEdit callback with row data when edit action is triggered", (): void => {
    const mockEditFn: jest.Mock<void, [AboutMeRow]> = jest.fn();
    const mockDeleteFn: jest.Mock<void, [number]> = jest.fn();

    render(
      <AboutMeTable
        aboutMes={mockRows}
        translations={translationsMock}
        onEdit={mockEditFn}
        onDelete={mockDeleteFn}
      />
    );

    const editButton: HTMLElement = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(mockEditFn).toHaveBeenCalledTimes(1);
    expect(mockEditFn).toHaveBeenCalledWith(mockRows[0]);
  });

  it("should call onDelete callback with row id when delete action is triggered", (): void => {
    const mockEditFn: jest.Mock<void, [AboutMeRow]> = jest.fn();
    const mockDeleteFn: jest.Mock<void, [number]> = jest.fn();

    render(
      <AboutMeTable
        aboutMes={mockRows}
        translations={translationsMock}
        onEdit={mockEditFn}
        onDelete={mockDeleteFn}
      />
    );

    const deleteButton: HTMLElement = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockDeleteFn).toHaveBeenCalledTimes(1);
    expect(mockDeleteFn).toHaveBeenCalledWith(mockRows[0].id);
  });
});
