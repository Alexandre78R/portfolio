import React from "react";
import { render, screen } from "@testing-library/react";
import Table, { ColumnDef } from "../../../../src/components/AdminLayout/components/Table/Table";

interface TestData {
  id: number;
  name: string;
  age: number;
}

describe("Table Component", () => {
  const columns: ColumnDef<TestData>[] = [
    { header: "ID" as string, accessor: "id" as keyof TestData } as ColumnDef<TestData>,
    { header: "Name" as string, accessor: "name" as keyof TestData } as ColumnDef<TestData>,
    { 
      header: "Age" as string, 
      accessor: (row) => `${row.age} years` as React.ReactNode
    },
  ];

  const data: TestData[] = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
  ];

  it("renders table headers correctly", () => {
    render(<Table columns={columns} data={data} />);
    
    columns.forEach((col) => {
      expect(screen.getByText(col.header)).toBeInTheDocument();
    });
  });

  it("renders table rows correctly", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("25 years")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("30 years")).toBeInTheDocument();
  });

  it("applies alternating row classes", () => {
    const { container }: { container: HTMLElement } = render(<Table columns={columns} data={data} />);
    const rows: NodeListOf<HTMLTableRowElement> = container.querySelectorAll("tbody tr");

    expect(rows[0]).toHaveClass("bg-muted/40");
    expect(rows[1]).toHaveClass("bg-muted/70");
  });

  it("applies custom column classes", () => {
    const customColumns: ColumnDef<TestData>[] = [
      { header: "ID" as string, accessor: "id" as keyof TestData, className: "custom-cell" as string, headerClassName: "custom-header" as string },
    ];

    render(<Table columns={customColumns} data={data} />);

    const header: HTMLElement | null = screen.getByText("ID") as HTMLElement;
    expect(header).toHaveClass("custom-header");

    const cell: HTMLElement | null = screen.getByText("1") as HTMLElement;
    expect(cell).toHaveClass("custom-cell");
  });
});