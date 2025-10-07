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
    { id: 1, name: "Alice", age: 25 } as TestData,
    { id: 2, name: "Bob", age: 30 } as TestData,
  ] as TestData[];

  it("renders table headers correctly", () => {
    render(<Table columns={columns} data={data} /> as React.ReactElement);
    
    columns.forEach((col) => {
      expect(screen.getByText(col.header)).toBeInTheDocument();
    });
  });

  it("renders table rows correctly", () => {
    render(<Table columns={columns} data={data} /> as React.ReactElement);

    expect(screen.getByText("1" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Alice" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("25 years" as string) as HTMLElement).toBeInTheDocument();

    expect(screen.getByText("2" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Bob" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("30 years" as string) as HTMLElement).toBeInTheDocument();
  });

  it("applies alternating row classes", () => {
    const { container }: { container: HTMLElement } = render(<Table columns={columns} data={data} />);
    const rows: NodeListOf<HTMLTableRowElement> = container.querySelectorAll("tbody tr" as string);

    expect(rows[0] as HTMLElement).toHaveClass("bg-muted/40" as string);
    expect(rows[1] as HTMLElement).toHaveClass("bg-muted/70" as string);
  });

  it("applies custom column classes", () => {
    const customColumns: ColumnDef<TestData>[] = [
      { header: "ID" as string, accessor: "id" as keyof TestData, className: "custom-cell" as string, headerClassName: "custom-header" as string },
    ];

    render(<Table columns={customColumns} data={data} /> as React.ReactElement);

    const header: HTMLElement | null = screen.getByText("ID") as HTMLElement;
    expect(header as HTMLElement).toHaveClass("custom-header" as string);

    const cell: HTMLElement | null = screen.getByText("1") as HTMLElement;
    expect(cell as HTMLElement).toHaveClass("custom-cell" as string);
  });
});