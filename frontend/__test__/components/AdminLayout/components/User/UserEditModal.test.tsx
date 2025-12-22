import { type ChangeEvent, type FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import UserEditModal from "@/components/AdminLayout/components/User/UserEditModal";
import type { UserRow } from "@/components/AdminLayout/components/User/UserTable";
import type Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminUserEditTitle: "Edit User",
      messageAdminUserEditSave: "Save",
      messageAdminUserEditCancel: "Cancel",
      messageAdminUserEditError: "Failed to save user",
      messageAdminUserEditSuccess: "User updated successfully",
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
jest.mock("@/types/graphql", () => ({
  useUpdateUserMutation: jest.fn(() => [mockUpdateUserMutation, {}]),
  useGetUserByIdQuery: jest.fn(),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: jest.fn((props: { children: React.ReactNode }) => (
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
    }) => (
      <input
        data-testid={`input-${props.name}`}
        id={props.id}
        aria-label={props.label}
        value={props.value}
        onChange={props.onChange}
      />
    )
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
        id={props.id}
        aria-label={props.label}
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
    (props: {
      text: string;
      disable?: boolean;
      onClick?: () => void;
      type?: "button" | "submit";
    }) => (
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

const sampleUser: UserRow = {
  id: "1",
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: "admin",
};


describe("UserEditModal Component", (): void => {
  const mockOnClose: jest.Mock = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

  beforeEach((): void => {
    jest.clearAllMocks();

    const { useGetUserByIdQuery } = require("@/types/graphql");
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({
      data: { userById: { user: sampleUser } },
      loading: false,
      error: undefined,
    });
  });

  test("renders null if no user is provided", (): void => {
    const { container } = render(<UserEditModal user={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders loading state while user data is loading", (): void => {
    const { useGetUserByIdQuery } = require("@/types/graphql");
    (useGetUserByIdQuery as jest.Mock).mockReturnValue({ data: null, loading: true });
    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders form with inputs correctly", (): void => {
    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    expect(firstnameInput.value).toBe(sampleUser.firstname);

    const lastnameInput: HTMLInputElement = screen.getByTestId("input-lastname") as HTMLInputElement;
    expect(lastnameInput.value).toBe(sampleUser.lastname);

    const emailInput: HTMLInputElement = screen.getByTestId("input-email") as HTMLInputElement;
    expect(emailInput.value).toBe(sampleUser.email);

    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;
    expect(roleSelect.value).toBe(sampleUser.role);

    const saveButton: HTMLButtonElement = screen.getByTestId("button-User updated successfully") as HTMLButtonElement;
    expect(saveButton).toBeInTheDocument();

    const cancelButton: HTMLButtonElement = screen.getByTestId("button-Cancel") as HTMLButtonElement;
    expect(cancelButton).toBeInTheDocument();
  });

  test("updates form state when inputs change", (): void => {
    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    fireEvent.change(firstnameInput, { target: { name: "firstname", value: "Jane" } });
    expect(firstnameInput.value).toBe("Jane");

    const lastnameInput: HTMLInputElement = screen.getByTestId("input-lastname") as HTMLInputElement;
    fireEvent.change(lastnameInput, { target: { name: "lastname", value: "Smith" } });
    expect(lastnameInput.value).toBe("Smith");

    const emailInput: HTMLInputElement = screen.getByTestId("input-email") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { name: "email", value: "jane.smith@example.com" } });
    expect(emailInput.value).toBe("jane.smith@example.com");

    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;
    fireEvent.change(roleSelect, { target: { name: "role", value: "view" } });
    expect(roleSelect.value).toBe("view");
  });

  test("submits form successfully and shows success toast", async (): Promise<void> => {
    mockUpdateUserMutation.mockResolvedValue({ data: { updateUser: { code: 200 } } });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const formEl: HTMLFormElement = screen.getByTestId("modal").querySelector("form") as HTMLFormElement;
    expect(formEl).not.toBeNull();
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("success", expect.any(String));
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles error response on form submission", async (): Promise<void> => {
    mockUpdateUserMutation.mockResolvedValue({ data: { updateUser: { code: 500 } } });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const formEl: HTMLFormElement = screen.getByTestId("modal").querySelector("form") as HTMLFormElement;
    expect(formEl).not.toBeNull();
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to save user");
    });
  });

  test("handles mutation rejection error", async (): Promise<void> => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockUpdateUserMutation.mockRejectedValue(new Error("Network error"));

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const formEl: HTMLFormElement = screen.getByTestId("modal").querySelector("form") as HTMLFormElement;
    expect(formEl).not.toBeNull();
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Erreur serveur !");
    });

    consoleErrorSpy.mockRestore();
  });

  test("closes modal when Cancel button is clicked", (): void => {
    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const cancelButton: HTMLButtonElement = screen.getByTestId("button-Cancel") as HTMLButtonElement;
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("verifies mutation is called with correct variables", async (): Promise<void> => {
    mockUpdateUserMutation.mockResolvedValue({ data: { updateUser: { code: 200 } } });

    render(<UserEditModal user={sampleUser} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const formEl: HTMLFormElement = screen.getByTestId("modal").querySelector("form") as HTMLFormElement;
    expect(formEl).not.toBeNull();
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalledWith({
        variables: {
          id: Number(sampleUser.id),
          firstname: sampleUser.firstname,
          lastname: sampleUser.lastname,
          email: sampleUser.email,
          role: sampleUser.role,
        },
      });
    });
  });
});
