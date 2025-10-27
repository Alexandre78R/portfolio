import React, { ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordPage from "@/pages/admin/auth/forgotpassword";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

// Mock du contexte useLang
jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

describe("ForgotPasswordPage Component", (): void => {
  const translations = {
    messagePageForgotPasswordTitle: "Réinitialiser le mot de passe",
    messagePageForgotPasswordEmail: "Email",
    messagePageForgotPasswordButton: "Envoyer",
  } as Lang;

  beforeEach((): void => {
    (useLang as jest.Mock).mockReturnValue({
      translations,
    });
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it("should render the AuthFormLayout with correct title", (): void => {
    render(<ForgotPasswordPage />);
    const titleElement: HTMLElement | null = screen.getByText(
      translations.messagePageForgotPasswordTitle
    );
    expect(titleElement).toBeInTheDocument();
  });

  it("should render email input and button", (): void => {
    render(<ForgotPasswordPage />);
    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByRole("button", {
        name: translations.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(submitButton).toBeInTheDocument();
  });

  it("should update form state when typing in email input", async (): Promise<void> => {
    render(<ForgotPasswordPage />);
    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    await waitFor((): void => {
        expect(emailInput.value).toBe("test@example.com");
    });
  });

  it("should call handleSubmit when form is submitted", async (): Promise<void> => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const formElement: HTMLFormElement = screen.getByTestId("forgot-password-form") as HTMLFormElement;
    fireEvent.submit(formElement);

    await waitFor((): void => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
        "Demande de réinitialisation envoyée !",
        { email: "test@example.com" }
        );
    });

    consoleLogSpy.mockRestore();
  });

  it("should call handleSubmit when button is clicked", async (): Promise<void> => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test2@example.com" } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
        name: translations.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor((): void => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
        "Demande de réinitialisation envoyée !",
        { email: "test2@example.com" }
        );
    });

    consoleLogSpy.mockRestore();
  });
});