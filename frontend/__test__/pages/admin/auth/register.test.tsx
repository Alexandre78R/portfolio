import React, { ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "@/pages/admin/auth/register";
import { useLang } from "@/context/Lang/LangContext";

// Mock du context Lang
jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

// Mock des composants enfants
jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({
    id,
    name,
    label,
    value,
    onChange,
  }: {
    id: string;
    name: string;
    label?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input data-testid={id} name={name} value={value} onChange={onChange} aria-label={label} />
  ),
}));

jest.mock("@/components/CustomSelect/CustomSelect", () => ({
  __esModule: true,
  default: ({
    id,
    value,
    onChange,
    options,
  }: {
    id: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      data-testid={id}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    text,
    onClick,
  }: {
    text: string;
    onClick: (e: FormEvent<HTMLButtonElement>) => void;
  }) => <button data-testid="register-button" onClick={onClick}>{text}</button>,
}));

describe("RegisterPage Component", () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({
      translations: {
        messagePageRegisterTitle: "Register",
        messagePageRegisterEmail: "Email",
        messagePageRegisterFirstName: "First Name",
        messagePageRegisterLastName: "Last Name",
        messagePageRegisterRole: "Role",
        messagePageRegisterButtom: "Register",
      },
    });

    renderResult = render(<RegisterPage />);
  });

  it("should render all input fields and button", () => {
    const emailInput: HTMLInputElement = screen.getByTestId("register-email") as HTMLInputElement;
    const prenomInput: HTMLInputElement = screen.getByTestId("register-prenom") as HTMLInputElement;
    const nomInput: HTMLInputElement = screen.getByTestId("register-nom") as HTMLInputElement;
    const roleSelect: HTMLSelectElement = screen.getByTestId("register-role") as HTMLSelectElement;
    const button: HTMLButtonElement = screen.getByTestId("register-button") as HTMLButtonElement;

    expect(emailInput).toBeInTheDocument();
    expect(prenomInput).toBeInTheDocument();
    expect(nomInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should allow user to type in inputs", () => {
    const emailInput: HTMLInputElement = screen.getByTestId("register-email") as HTMLInputElement;
    const prenomInput: HTMLInputElement = screen.getByTestId("register-prenom") as HTMLInputElement;
    const nomInput: HTMLInputElement = screen.getByTestId("register-nom") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(prenomInput, { target: { value: "Alex" } });
    fireEvent.change(nomInput, { target: { value: "Renard" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(prenomInput.value).toBe("Alex");
    expect(nomInput.value).toBe("Renard");
  });

  it("should allow user to select a role", () => {
    const roleSelect: HTMLSelectElement = screen.getByTestId("register-role") as HTMLSelectElement;

    fireEvent.change(roleSelect, { target: { value: "admin" } });
    expect(roleSelect.value).toBe("admin");

    fireEvent.change(roleSelect, { target: { value: "editor" } });
    expect(roleSelect.value).toBe("editor");
  });

  it("should handle form submit", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const button: HTMLButtonElement = screen.getByTestId("register-button") as HTMLButtonElement;

    fireEvent.click(button);
    expect(consoleLogSpy).toHaveBeenCalledWith("Register cliqué !", {
      email: "",
      prenom: "",
      nom: "",
      role: "view",
    });

    consoleLogSpy.mockRestore();
  });
});