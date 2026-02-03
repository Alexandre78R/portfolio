import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor, type RenderResult } from '@testing-library/react';
import "@testing-library/jest-dom";
import type Lang from "@/lang/typeLang";

const mockRouterPush: jest.Mock<Promise<boolean>, [pathname: string]> = jest.fn(async (pathname: string): Promise<boolean> => true);
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

jest.mock("@/context/Lang/LangContext");
jest.mock("@/components/ToastCustom/CustomToast");
jest.mock("@/utils/hooks");

import ForgotPasswordPage, { ForgotPasswordFormState, ForgotPasswordMutation, ForgotPasswordMutationVariables } from "@/pages/admin/auth/forgotpassword";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useForgotPassword } from "@/utils/hooks";

type TranslationsMock = Pick<
  Lang,
  | "messagePageForgotPasswordTitle"
  | "messagePageForgotPasswordEmail"
  | "messagePageForgotPasswordButton"
  | "messagePageForgotPasswordSuccess"
  | "messagePageForgotPasswordErrorServer"
  | "messagePageForgotPasswordErrorInvalidEmail"
>;

const translationsMock: TranslationsMock = {
  messagePageForgotPasswordTitle: "Réinitialiser le mot de passe",
  messagePageForgotPasswordEmail: "Email",
  messagePageForgotPasswordButton: "Envoyer",
  messagePageForgotPasswordSuccess: "Si un compte existe avec cette adresse email, vous recevrez un nouveau mot de passe.",
  messagePageForgotPasswordErrorServer: "Erreur serveur lors de la réinitialisation du mot de passe.",
  messagePageForgotPasswordErrorInvalidEmail: "L'adresse email est invalide.",
};

const mockShowAlert: jest.Mock<void, [type: "success" | "error", message: string]> = jest.fn();

describe("ForgotPasswordPage Component", (): void => {
    const getEmailInput = (): HTMLInputElement =>
      document.getElementById('forgot-email') as HTMLInputElement;

  beforeEach((): void => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    (useLang as jest.Mock).mockReturnValue({
      translations: translationsMock,
      lang: "fr",
    });
    
    (CustomToast as jest.Mock).mockReturnValue({
      showAlert: mockShowAlert,
    });
  });

  afterEach((): void => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render forgot password form with correct title", (): void => {
    const mockForgotPasswordFn = jest.fn();
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);
    
    const renderResult: RenderResult = render(<ForgotPasswordPage />);
    
    const titleElement: HTMLElement = screen.getByText(translationsMock.messagePageForgotPasswordTitle);
    expect(titleElement).toBeInTheDocument();
    
    expect(renderResult.container).toBeInTheDocument();
  });

  it("should render email input field and submit button", (): void => {
    const mockForgotPasswordFn = jest.fn();
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);
    
    render(<ForgotPasswordPage />);
    
    const emailInput: HTMLInputElement = getEmailInput();
    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(submitButton).toBeInTheDocument();
  });

  it("should update form state when typing email", async (): Promise<void> => {
    const mockForgotPasswordFn = jest.fn();
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);
    
    render(<ForgotPasswordPage />);
    
    const emailInput: HTMLInputElement = getEmailInput();
    const testEmail: string = "test@example.com";

    fireEvent.change(emailInput, { target: { value: testEmail } });

    await waitFor((): void => {
      expect(emailInput.value).toBe(testEmail);
    });
  });

  it("should display error when email is empty and form submitted", async (): Promise<void> => {
    const mockForgotPasswordFn = jest.fn();
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);
    
    render(<ForgotPasswordPage />);

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageForgotPasswordErrorInvalidEmail
      );
    });
  });

  it("should successfully handle forgot password request and redirect to login", async (): Promise<void> => {
    const testEmail: string = "test@example.com";
    
    const mockForgotPasswordFn = jest.fn(async () => ({
      data: {
        forgotPassword: {
          message: "Success",
          code: 200,
        },
      },
    }));
    
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = getEmailInput();
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messagePageForgotPasswordSuccess
      );
    });

    jest.runAllTimers();

    await waitFor((): void => {
      expect(mockRouterPush).toHaveBeenCalledWith("/admin/auth/login");
    });
  });

  it("should display server error message on mutation failure", async (): Promise<void> => {
    const testEmail: string = "test@example.com";
    
    const mockForgotPasswordFn = jest.fn(async () => ({
      data: {
        forgotPassword: {
          message: "Server error",
          code: 500,
        },
      },
    }));
    
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = getEmailInput();
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageForgotPasswordErrorServer
      );
    });
  });

  it("should display server error message on network error", async (): Promise<void> => {
    const testEmail: string = "test@example.com";
    
    const mockForgotPasswordFn = jest.fn(async () => {
      throw new Error("Network error");
    });
    
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = getEmailInput();
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageForgotPasswordErrorServer
      );
    });
  });

  it("should show error when email is empty", async (): Promise<void> => {
    const mockForgotPasswordFn = jest.fn();
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);
    
    render(<ForgotPasswordPage />);

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageForgotPasswordErrorInvalidEmail
      );
    });
  });

  it("should show loading text during form submission", async (): Promise<void> => {
    const testEmail: string = "test@example.com";
    
    const mockForgotPasswordFn = jest.fn(async () => ({
      data: {
        forgotPassword: {
          message: "Success",
          code: 200,
        },
      },
    }));
    
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: true, error: undefined }
    ]);

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = getEmailInput();
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton + "...",
    }) as HTMLButtonElement;
    
    expect(submitButton).toHaveTextContent(
      translationsMock.messagePageForgotPasswordButton + "..."
    );
  });

  it("should clear email input after successful password reset request", async (): Promise<void> => {
    const testEmail: string = "test@example.com";
    
    const mockForgotPasswordFn = jest.fn(async () => ({
      data: {
        forgotPassword: {
          message: "Success",
          code: 200,
        },
      },
    }));
    
    (useForgotPassword as jest.Mock).mockReturnValue([
      mockForgotPasswordFn,
      { loading: false, error: undefined }
    ]);

    render(<ForgotPasswordPage />);

    const emailInput: HTMLInputElement = getEmailInput();
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messagePageForgotPasswordSuccess
      );
    });

    jest.runAllTimers();

    await waitFor((): void => {
      expect(getEmailInput().value).toBe("");
    });
  });
});
