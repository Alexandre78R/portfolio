import React from "react";
import { render, screen, fireEvent } from '@test-utils';
import "@testing-library/jest-dom";
import UserTable, { UserRow } from "@/components/AdminLayout/components/User/UserTable";
import Lang from "@/lang/typeLang";
import { ColumnDef } from "@/components/AdminLayout/components/Table/Table";
import ActionButton, { ActionItem } from "@/components/AdminLayout/components/Button/ActionButton";

jest.mock("@/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: ({ columns, data }: { columns: ColumnDef<UserRow>[]; data: UserRow[] }) => (
    <table data-testid="user-table">
      <thead>
        <tr>
          {columns.map((col: ColumnDef<UserRow>, idx: number) => (
            <th key={idx} className={col.headerClassName}>
              {col.header as string}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: UserRow, rowIdx: number) => (
          <tr key={rowIdx}>
            {columns.map((col: ColumnDef<UserRow>, colIdx: number) => (
              <td key={colIdx} className={col.className}>
                {typeof col.accessor === "function"
                  ? col.accessor(row)
                  : row[col.accessor as keyof UserRow]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock("@/components/AdminLayout/components/Button/ActionButton", () => ({
  __esModule: true,
  default: ({
    actions,
    row,
  }: {
    actions: ActionItem<UserRow>[];
    row: UserRow;
  }) => (
    <div data-testid="action-button">
      {actions.map((action: ActionItem<UserRow>, idx: number) => {
        const label: string = action.label ?? "action";
        return (
          <button
            key={idx}
            data-testid={`action-${label.toLowerCase()}`}
            className={action.colorClass}
            onClick={() => action.onClick(row)}
          >
            {label}
          </button>
        );
      })}
    </div>
  ),
}));

jest.mock("lucide-react", () => ({
  Pencil: () => <span data-testid="pencil-icon">Pencil</span>,
  Trash: () => <span data-testid="trash-icon">Trash</span>,
}));

const mockTranslations: Lang = {
  messageAdminUserColumnFirstname: "First Name",
  messageAdminUserColumnLastname: "Last Name",
  messageAdminUserColumnEmail: "Email",
  messageAdminUserColumnRole: "Role",
  messageAdminUserColumnAction: "Actions",
} as unknown as Lang;

const sampleUsers: UserRow[] = [
  { id: "1", firstname: "John", lastname: "Doe", email: "john.doe@example.com", role: "admin" },
  { id: "2", firstname: "Jane", lastname: "Smith", email: "jane.smith@example.com", role: "user" },
  { id: "3", firstname: "Bob", lastname: "Johnson", email: "bob.johnson@example.com", role: "view" },
];

describe("UserTable Component - Fully Typed", (): void => {
  const mockOnEdit: jest.Mock<(user: UserRow) => void> = jest.fn();
  const mockOnDelete: jest.Mock<(id: string) => void> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  test("renders table with correct headers", (): void => {
    render(<UserTable users={sampleUsers} translations={mockTranslations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("renders all user data correctly", (): void => {
    render(<UserTable users={sampleUsers} translations={mockTranslations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    sampleUsers.forEach((user: UserRow) => {
      expect(screen.getByText(user.firstname)).toBeInTheDocument();
      expect(screen.getByText(user.lastname)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
    });
  });

  test("renders action buttons for each user", (): void => {
    render(<UserTable users={sampleUsers} translations={mockTranslations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const actionButtons: HTMLElement[] = screen.getAllByTestId("action-button");
    expect(actionButtons).toHaveLength(sampleUsers.length);
  });

  test("calls onEdit callback when Edit button is clicked", (): void => {
    render(<UserTable users={sampleUsers} translations={mockTranslations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const editButtons: HTMLElement[] = screen.getAllByTestId("action-edit");
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(sampleUsers[0]);
  });

  test("calls onDelete callback when Delete button is clicked", (): void => {
    render(<UserTable users={sampleUsers} translations={mockTranslations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const deleteButtons: HTMLElement[] = screen.getAllByTestId("action-delete");
    fireEvent.click(deleteButtons[1]);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(sampleUsers[1].id);
  });

  test("renders empty table when no users provided", (): void => {
    render(<UserTable users={[]} translations={mockTranslations} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByTestId("user-table")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.queryByTestId("action-button")).not.toBeInTheDocument();
  });
});
