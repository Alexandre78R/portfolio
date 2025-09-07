import React from "react";

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-muted shadow-sm">
      <table className="min-w-full text-sm text-left text-text">
        <thead className="bg-background sticky top-0 z-10">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-4 font-bold uppercase text-xs tracking-wide border-b border-border ${
                  col.headerClassName || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors ${
                rowIndex % 2 === 0 ? "bg-muted/40" : "bg-muted/70"
              } hover:bg-accent/30`}
            >
              {columns.map((col, colIndex) => {
                const value =
                  typeof col.accessor === "function"
                    ? col.accessor(row)
                    : row[col.accessor];

                return (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 ${col.className || ""}`}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;