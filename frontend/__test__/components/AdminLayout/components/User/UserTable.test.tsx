import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTable, { UserRow } from "@/components/AdminLayout/components/User/UserTable";
import Lang from "@/lang/typeLang";

// Mock du composant Table
jest.mock("@/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: jest.fn(({ columns, data }: { columns: any[]; data: any[] }) => (
    <table data-testid="user-table">
      <thead>
        <tr>
          {columns.map((col: any, idx: number) => (
            <th key={idx} className={col.headerClassName}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, rowIdx: number) => (
          <tr key={rowIdx}>
            {columns.map((col: any, colIdx: number) => (
              <td key={colIdx} className={col.className}>
                {typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )),
}));

// Mock du composant ActionButton
jest.mock("@/components/AdminLayout/components/Button/ActionButton", () => ({
  __esModule: true,
  default: jest.fn(({ actions }: { actions: any[] }) => (
    <div data-testid="action-button">
      {actions.map((action: any, idx: number) => (
        <button
          key={idx}
          data-testid={`action-${action.label.toLowerCase()}`}
          onClick={() => action.onClick()}
          className={action.colorClass}
        >
          {action.label}
        </button>
      ))}
    </div>
  )),
}));

// Mock des icônes Lucide
jest.mock("lucide-react", () => ({
  Pencil: () => <span data-testid="pencil-icon">Pencil</span>,
  Trash: () => <span data-testid="trash-icon">Trash</span>,
}));

// Translations mock
const mockTranslations: Lang = {
  messageAdminUserColumnFirstname: "First Name",
  messageAdminUserColumnLastname: "Last Name",
  messageAdminUserColumnEmail: "Email",
  messageAdminUserColumnRole: "Role",
  messageAdminUserColumnAction: "Actions",
} as unknown as Lang;

// Exemple d'utilisateurs
const sampleUsers: UserRow[] = [
  { id: "1", firstname: "John", lastname: "Doe", email: "john.doe@example.com", role: "admin" },
  { id: "2", firstname: "Jane", lastname: "Smith", email: "jane.smith@example.com", role: "user" },
  { id: "3", firstname: "Bob", lastname: "Johnson", email: "bob.johnson@example.com", role: "view" },
];

describe("UserTable Component - Essential Tests", (): void => {
  const mockOnEdit: jest.Mock = jest.fn();
  const mockOnDelete: jest.Mock = jest.fn();

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
    const table: HTMLElement = screen.getByTestId("user-table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.queryByTestId("action-button")).not.toBeInTheDocument();
  });
});
