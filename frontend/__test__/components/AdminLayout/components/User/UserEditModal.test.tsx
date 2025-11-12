import React, { ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserEditModal from "@/components/AdminLayout/components/User/UserEditModal";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateUserMutation,
  useGetUserByIdQuery,
  GetUsersListQuery,
} from "@/types/graphql";
import { UserRow } from "@/components/AdminLayout/components/User/UserTable";
import Lang from "@/lang/typeLang";
import SelectField from "@/components/AdminLayout/components/Input/SelectField";
import { mapRoleToUserRole } from "@/components/AdminLayout/Pages/Users/user.type";
import { UserRole } from "@/components/AdminLayout/Pages/Users/user.type";

// --- Mocks ---

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminUserEditTitle: "Edit User",
      messageAdminUserEditSave: "Save",
      messageAdminUserEditCancel: "Cancel",
      messageAdminUserEditError: "Failed to save user",
      messageAdminUserColumnRole: "Role",
    } as Lang,
  })),
}));

const mockShowAlert: jest.Mock = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

const mockUpdateUserMutation: jest.Mock = jest.fn();
const mockUseGetUserByIdQuery: jest.Mock = jest.fn();

jest.mock("@/types/graphql", () => ({
  useUpdateUserMutation: jest.fn(() => [mockUpdateUserMutation, {}]),
  useGetUserByIdQuery: jest.fn(() => mockUseGetUserByIdQuery()),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: jest.fn((props: { children: React.ReactElement }) => (
    <div data-testid="modal">{props.children}</div>
  )),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: jest.fn(
    (props: {
      name: string;
      value: string;
      onChange: (e: ChangeEvent<HTMLInputElement>) => void;
      id?: string;
      label?: string;
    }) => <input data-testid={`input-${props.name}`} value={props.value} onChange={props.onChange} />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/SelectField", () => ({
  __esModule: true,
  default: jest.fn(
    (props: {
      name: string;
      value: string;
      onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
      id?: string;
      label?: string;
      options: Array<{ value: string; label: string }>;
    }) => (
      <select
        data-testid={`select-${props.name}`}
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: jest.fn(
    (props: { text: string; disable?: boolean; onClick?: () => void; type?: "button" | "submit" }) => (
      <button
        data-testid={`button-${props.text}`}
        disabled={props.disable}
        type={props.type || "button"}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    )
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="loading">Loading...</div>),
}));

// --- Sample Data ---

const sampleUser: UserRow = {
  id: "1",
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: UserRole.admin,
};

// --- Tests ---

describe("UserEditModal Component", (): void => {
  const mockOnClose: jest.Mock = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  test("renders null if no user is provided", (): void => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({ data: null, loading: false });
    const { container } = render(<UserEditModal user={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders loading state while user data is loading", (): void => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({ data: null, loading: true });
    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders form with inputs correctly", (): void => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: { userById: { user: sampleUser } },
      loading: false,
    });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    expect(firstnameInput.value).toBe(sampleUser.firstname);

    const lastnameInput: HTMLInputElement = screen.getByTestId("input-lastname") as HTMLInputElement;
    expect(lastnameInput.value).toBe(sampleUser.lastname);

    const emailInput: HTMLInputElement = screen.getByTestId("input-email") as HTMLInputElement;
    expect(emailInput.value).toBe(sampleUser.email);

    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;
    expect(roleSelect.value).toBe(sampleUser.role);
  });

  test("updates form state when inputs change", (): void => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: { userById: { user: sampleUser } },
      loading: false,
    });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    fireEvent.change(firstnameInput, { target: { name: "firstname", value: "Jane" } });
    expect(firstnameInput.value).toBe("Jane");

    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;
    fireEvent.change(roleSelect, { target: { name: "role", value: UserRole.view } });
    expect(roleSelect.value).toBe(UserRole.view);
  });

  test("submits form successfully and shows success toast", async (): Promise<void> => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: { userById: { user: sampleUser } },
      loading: false,
    });
    mockUpdateUserMutation.mockResolvedValue({ data: { updateUser: { code: 200 } } });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const formEl: HTMLFormElement | null = screen.getByTestId("modal")?.querySelector("form") as HTMLFormElement;
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Save");
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles error response on form submission", async (): Promise<void> => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: { userById: { user: sampleUser } },
      loading: false,
    });
    mockUpdateUserMutation.mockResolvedValue({ data: { updateUser: { code: 500 } } });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const formEl: HTMLFormElement | null = screen.getByTestId("modal")?.querySelector("form") as HTMLFormElement;
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to save user");
    });
  });

  test("closes modal when Cancel button is clicked", (): void => {
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: { userById: { user: sampleUser } },
      loading: false,
    });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const cancelButton: HTMLButtonElement = screen.getByTestId("button-Cancel") as HTMLButtonElement;
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
