import React, { ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from "@/pages/admin/auth/login";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useMutation, MutationTuple, useLazyQuery } from "@apollo/client";
import { useRouter, NextRouter } from "next/router";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => jest.fn());

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="auth-layout">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({
    id,
    value,
    onChange,
    label,
    name,
    type,
  }: {
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    name?: string;
    type?: string;
  }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      onChange(e);
    };

    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          data-testid={id}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  },
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    text,
    onClick,
  }: {
    text: string;
    onClick: (e: FormEvent<HTMLButtonElement>) => void;
  }) => (
    <button data-testid="login-button" onClick={onClick}>
      {text}
    </button>
  ),
}));

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useMutation: jest.fn(),
    useLazyQuery: jest.fn(),
    gql: (str: TemplateStringsArray) => str,
  };
});

jest.mock("@/types/graphql", () => ({
  MutationDocument: {},
  MutationMutation: jest.fn(),
  MutationMutationVariables: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage Component", (): void => {
  let mockShowAlert: jest.Mock;
  let mockPush: jest.Mock;

  const translationsMock = {
    messagePageLoginTitle: "Connexion",
    messagePageLoginInputEmail: "Email",
    messagePageLoginInputPassword: "Mot de passe",
    messagePageLoginInputButtom: "Se connecter",
    messagePageLoginMessageSuccess: "Connexion réussie",
    messagePageLoginMessageErrorServer: "Erreur identifiants",
    messagePageLoginMessageErrorUnexpected: "Erreur serveur inattendue",
  } as Lang;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockShowAlert = jest.fn();
    mockPush = jest.fn();

    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
    (CustomToast as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({ data: { login: { code: 200, message: "ok" } } }),
      { loading: false, error: null, data: null },
    ]) as unknown as MutationTuple<any, any>;

    (useLazyQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { loading: false, error: null, data: null },
    ]);
  });

  it("should render correctly", (): void => {
    render(<LoginPage />);
    const authLayout: HTMLElement = screen.getByTestId("auth-layout");
    expect(authLayout).toBeInTheDocument();

    const emailInput: HTMLInputElement = screen.getByLabelText(
      translationsMock.messagePageLoginInputEmail
    ) as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByLabelText(
      translationsMock.messagePageLoginInputPassword
    ) as HTMLInputElement;
    const loginButton: HTMLButtonElement = screen.getByTestId(
      "login-button"
    ) as HTMLButtonElement;

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toHaveTextContent(translationsMock.messagePageLoginInputButtom);
  });

  it("should update form state on input change", (): void => {
    render(<LoginPage />);
    const emailInput: HTMLInputElement = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { name: "email", value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { name: "password", value: "123456" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("123456");
  });

  it("should call login mutation and show success alert on code 200", async (): Promise<void> => {
    const mockLogin: jest.Mock = jest
      .fn()
      .mockResolvedValue({ data: { login: { code: 200, message: "ok" } } });
    (useMutation as jest.Mock).mockReturnValue([mockLogin, { loading: false, error: null, data: null }]);

    render(<LoginPage />);

    const emailInput: HTMLInputElement = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { name: "email", value: "user@test.com" } });
    fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor((): void => {
      expect(mockLogin).toHaveBeenCalledWith({
        variables: { data: { email: "user@test.com", password: "password" } },
      });
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messagePageLoginMessageSuccess
      );
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  it("should show error alert on code 401", async (): Promise<void> => {
    const mockLogin: jest.Mock = jest.fn().mockResolvedValue({
      data: { login: { code: 401, message: "invalid" } },
    });
    (useMutation as jest.Mock).mockReturnValue([mockLogin, { loading: false, error: null, data: null }]);

    render(<LoginPage />);

    const emailInput: HTMLInputElement = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { name: "email", value: "user@test.com" } });
    fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageLoginMessageErrorServer
      );
    });
  });

  it("should show error alert on code 500", async (): Promise<void> => {
    const mockLogin: jest.Mock = jest.fn().mockResolvedValue({
      data: { login: { code: 500, message: "server error" } },
    });
    (useMutation as jest.Mock).mockReturnValue([mockLogin, { loading: false, error: null, data: null }]);

    render(<LoginPage />);

    const emailInput: HTMLInputElement = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { name: "email", value: "user@test.com" } });
    fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageLoginMessageErrorUnexpected
      );
    });
  });

  it("should show generic error alert if mutation throws", async (): Promise<void> => {
    const mockLogin: jest.Mock = jest.fn().mockRejectedValue(new Error("Network Error"));
    (useMutation as jest.Mock).mockReturnValue([mockLogin, { loading: false, error: null, data: null }]);

    render(<LoginPage />);

    const emailInput: HTMLInputElement = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { name: "email", value: "user@test.com" } });
    fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        "Erreur serveur : veuillez réessayer plus tard."
      );
    });
  });

  it("should show loading text on button when mutation is loading", (): void => {
    const mockLogin: jest.Mock = jest.fn().mockResolvedValue({
      data: { login: { code: 200, message: "ok" } },
    });
    (useMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { loading: true, error: null, data: null },
    ]);

    render(<LoginPage />);
    const button: HTMLButtonElement = screen.getByTestId("login-button") as HTMLButtonElement;
    expect(button).toHaveTextContent(translationsMock.messagePageLoginInputButtom + "...");
  });
});
