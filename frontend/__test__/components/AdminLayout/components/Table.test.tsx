import React from "react";
import { render, screen } from '@test-utils';
import Table, { ColumnDef, TableProps } from "../../../../src/components/AdminLayout/components/Table/Table";

interface TestData {
  id: number;
  name: string;
  age: number;
}

describe("Table Component", (): void => {
  const columns: ColumnDef<TestData>[] = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Age", accessor: (row: TestData): string => `${row.age} years` },
  ];

  const data: TestData[] = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
  ];

  it("renders table headers correctly", (): void => {
    render(<Table columns={columns} data={data} /> as React.ReactElement);

    columns.forEach((col: ColumnDef<TestData>): void => {
      const headerElement: HTMLElement = screen.getByText(col.header);
      expect(headerElement).toBeInTheDocument();
    });
  });

  it("renders table rows correctly", (): void => {
    render(<Table columns={columns} data={data} /> as React.ReactElement);

    const cell1: HTMLElement = screen.getByText("1");
    const cell2: HTMLElement = screen.getByText("Alice");
    const cell3: HTMLElement = screen.getByText("25 years");
    const cell4: HTMLElement = screen.getByText("2");
    const cell5: HTMLElement = screen.getByText("Bob");
    const cell6: HTMLElement = screen.getByText("30 years");

    expect(cell1).toBeInTheDocument();
    expect(cell2).toBeInTheDocument();
    expect(cell3).toBeInTheDocument();
    expect(cell4).toBeInTheDocument();
    expect(cell5).toBeInTheDocument();
    expect(cell6).toBeInTheDocument();
  });

  it("applies alternating row classes", (): void => {
    const { container }: { container: HTMLElement } = render(
      <Table columns={columns} data={data} />
    );

    const rows: NodeListOf<HTMLTableRowElement> = container.querySelectorAll("tbody tr");

    expect(rows[0] as HTMLTableRowElement).toHaveClass("bg-muted/40");
    expect(rows[1] as HTMLTableRowElement).toHaveClass("bg-muted/70");
  });

  it("applies custom column classes", (): void => {
    const customColumns: ColumnDef<TestData>[] = [
      { header: "ID", accessor: "id", className: "custom-cell", headerClassName: "custom-header" },
    ];

    render(<Table columns={customColumns} data={data} /> as React.ReactElement);

    const header: HTMLElement = screen.getByText("ID");
    expect(header).toHaveClass("custom-header");

    const cell: HTMLElement = screen.getByText("1");
    expect(cell).toHaveClass("custom-cell");
  });
});
