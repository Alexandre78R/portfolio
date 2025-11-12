import React, { ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserCreate from "@/components/AdminLayout/Pages/Users/UserCreate";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useCreateUserMutation } from "@/types/graphql";
import Lang from "@/lang/typeLang";

const mockShowAlert: jest.Mock<(type: "success" | "error", message: string) => void> = jest.fn();
const mockCreateUserMutation: jest.Mock<Promise<any>, [variables: any]> = jest.fn();

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminUserCreateTitle: "Create User",
      messageAdminUserCreateButton: "Create",
      messageAdminUserCreateLoading: "Creating...",
      messageAdminUserCreateSuccess: "User created successfully",
      messageAdminUserCreateError: "Failed to create user",
      messageAdminUserColumnFirstname: "First Name",
      messageAdminUserColumnLastname: "Last Name",
      messageAdminUserColumnEmail: "Email",
      messageAdminUserColumnRole: "Role",
      messageErrorServerOff: "Server error",
    } as Lang,
  })),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

jest.mock("@/types/graphql", () => ({
  useCreateUserMutation: jest.fn(() => [mockCreateUserMutation, { loading: false }]),
}));

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: jest.fn((props: { children: React.ReactElement; title: React.ReactElement }) => (
    <div data-testid="auth-form-layout">
      <div data-testid="form-title">{props.title}</div>
      {props.children}
    </div>
  )),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: jest.fn((props: { children: React.ReactNode; type?: string }) => (
    <div data-testid={`text-admin-${props.type}`}>{props.children}</div>
  )),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({ name, value, onChange }: { name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <input data-testid={`input-${name}`} value={value} onChange={onChange} />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/SelectField", () => ({
  __esModule: true,
  default: ({ name, value, onChange, options }: { name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) => (
    <select data-testid={`select-${name}`} value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: jest.fn(
    (props: { text: string; disable?: boolean; onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
      <button data-testid="submit-button" disabled={props.disable} onClick={props.onClick}>
        {props.text}
      </button>
    )
  ),
}));

jest.mock("@/components/AdminLayout/Pages/Users/user.type", () => ({
  UserRole: { admin: "admin", user: "user", view: "view" },
  getUserRoleOptions: jest.fn(() => [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "view", label: "View" },
  ]),
}));

describe("UserCreate Component", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  const fillForm = (): void => {
    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    const lastnameInput: HTMLInputElement = screen.getByTestId("input-lastname") as HTMLInputElement;
    const emailInput: HTMLInputElement = screen.getByTestId("input-email") as HTMLInputElement;
    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;

    fireEvent.change(firstnameInput, { target: { name: "firstname", value: "Jane" } });
    fireEvent.change(lastnameInput, { target: { name: "lastname", value: "Smith" } });
    fireEvent.change(emailInput, { target: { name: "email", value: "jane@example.com" } });
    fireEvent.change(roleSelect, { target: { name: "role", value: "user" } });
  };

  test("should render all input fields", (): void => {
    render(<UserCreate />);
    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    const lastnameInput: HTMLInputElement = screen.getByTestId("input-lastname") as HTMLInputElement;
    const emailInput: HTMLInputElement = screen.getByTestId("input-email") as HTMLInputElement;
    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    expect(firstnameInput).toBeInTheDocument();
    expect(lastnameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("should display form title correctly", (): void => {
    render(<UserCreate />);
    const formTitle: HTMLElement = screen.getByText("Create User");
    expect(formTitle).toBeInTheDocument();
  });

  test("should update input fields when changed", (): void => {
    render(<UserCreate />);
    fillForm();

    const firstnameInput: HTMLInputElement = screen.getByTestId("input-firstname") as HTMLInputElement;
    const lastnameInput: HTMLInputElement = screen.getByTestId("input-lastname") as HTMLInputElement;
    const emailInput: HTMLInputElement = screen.getByTestId("input-email") as HTMLInputElement;
    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;

    expect(firstnameInput.value).toBe("Jane");
    expect(lastnameInput.value).toBe("Smith");
    expect(emailInput.value).toBe("jane@example.com");
    expect(roleSelect.value).toBe("user");
  });

  test("should submit form successfully and show success toast", async (): Promise<void> => {
    mockCreateUserMutation.mockResolvedValue({ data: { registerUser: { code: 201 } }, errors: undefined });
    render(<UserCreate />);
    fillForm();

    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockCreateUserMutation).toHaveBeenCalledWith({
        variables: { data: { firstname: "Jane", lastname: "Smith", email: "jane@example.com", role: "user" } },
      });
      expect(mockShowAlert).toHaveBeenCalledWith("success", "User created successfully");
    });
  });

  test("should reset form after successful submission", async (): Promise<void> => {
    mockCreateUserMutation.mockResolvedValue({ data: { registerUser: { code: 201 } }, errors: undefined });
    render(<UserCreate />);
    fillForm();

    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect((screen.getByTestId("input-firstname") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("input-lastname") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("input-email") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("select-role") as HTMLSelectElement).value).toBe("view");
    });
  });

  test("should handle error response on form submission", async (): Promise<void> => {
    mockCreateUserMutation.mockResolvedValue({ data: { registerUser: { code: 500 } }, errors: undefined });
    render(<UserCreate />);
    fillForm();

    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to create user");
    });
  });

  test("should handle mutation rejection error", async (): Promise<void> => {
    mockCreateUserMutation.mockRejectedValue(new Error("Network error"));
    render(<UserCreate />);
    fillForm();

    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Server error");
    });
  });

  test("should show loading state during submission", (): void => {
    (useCreateUserMutation as jest.Mock).mockReturnValue([mockCreateUserMutation, { loading: true }]);
    render(<UserCreate />);
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    expect(submitButton).toHaveTextContent("Creating...");
    expect(submitButton).toBeDisabled();
  });

  test("should have default role value as 'view'", (): void => {
    render(<UserCreate />);
    const roleSelect: HTMLSelectElement = screen.getByTestId("select-role") as HTMLSelectElement;
    expect(roleSelect.value).toBe("view");
  });
});
