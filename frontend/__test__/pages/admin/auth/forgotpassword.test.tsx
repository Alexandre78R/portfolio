import React from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { ApolloError } from "@apollo/client";
import { FORGOT_PASSWORD } from "@/requetes/mutations/user.mutations";
import Lang from "@/lang/typeLang";

const mockRouterPush: jest.Mock<Promise<boolean>, [pathname: string]> = jest.fn(async (pathname: string): Promise<boolean> => true);
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

jest.mock("@/context/Lang/LangContext");
jest.mock("@/components/ToastCustom/CustomToast");

import ForgotPasswordPage, { ForgotPasswordFormState, ForgotPasswordMutation, ForgotPasswordMutationVariables } from "@/pages/admin/auth/forgotpassword";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";

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
    const mocks: MockedResponse[] = [];
    
    const renderResult: RenderResult = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );
    
    const titleElement: HTMLElement = screen.getByText(translationsMock.messagePageForgotPasswordTitle);
    expect(titleElement).toBeInTheDocument();
    
    expect(renderResult.container).toBeInTheDocument();
  });

  it("should render email input field and submit button", (): void => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );
    
    const emailInput: HTMLInputElement = getEmailInput();
    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(submitButton).toBeInTheDocument();
  });

  it("should update form state when typing email", async (): Promise<void> => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );
    
    const emailInput: HTMLInputElement = getEmailInput();
    const testEmail: string = "test@example.com";

    fireEvent.change(emailInput, { target: { value: testEmail } });

    await waitFor((): void => {
      expect(emailInput.value).toBe(testEmail);
    });
  });

  it("should display error when email is empty and form submitted", async (): Promise<void> => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

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
    
    const forgotPasswordMock: MockedResponse<ForgotPasswordMutation> = {
      request: {
        query: FORGOT_PASSWORD,
        variables: {
          data: {
            email: testEmail,
            lang: "fr",
          },
        },
      },
      result: {
        data: {
          forgotPassword: {
            message: "Success",
            code: 200,
          },
        },
      },
    };
    
    const mocks: MockedResponse[] = [forgotPasswordMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

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
    
    const forgotPasswordErrorMock: MockedResponse<ForgotPasswordMutation> = {
      request: {
        query: FORGOT_PASSWORD,
        variables: {
          data: {
            email: testEmail,
            lang: "fr",
          },
        },
      },
      result: {
        data: {
          forgotPassword: {
            message: "Server error",
            code: 500,
          },
        },
      },
    };
    
    const mocks: MockedResponse[] = [forgotPasswordErrorMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

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
    const networkError: Error = new Error("Network error");
    
    const forgotPasswordNetworkErrorMock: MockedResponse<ForgotPasswordMutation> = {
      request: {
        query: FORGOT_PASSWORD,
        variables: {
          data: {
            email: testEmail,
            lang: "fr",
          },
        },
      },
      error: networkError as unknown as ApolloError,
    };
    
    const mocks: MockedResponse[] = [forgotPasswordNetworkErrorMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

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
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

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
    
    const forgotPasswordMock: MockedResponse<ForgotPasswordMutation> = {
      request: {
        query: FORGOT_PASSWORD,
        variables: {
          data: {
            email: testEmail,
            lang: "fr",
          },
        },
      },
      result: {
        data: {
          forgotPassword: {
            message: "Success",
            code: 200,
          },
        },
      },
    };
    
    const mocks: MockedResponse[] = [forgotPasswordMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

    const emailInput: HTMLInputElement = getEmailInput();
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageForgotPasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(submitButton).toHaveTextContent(
        translationsMock.messagePageForgotPasswordButton + "..."
      );
    });
  });

  it("should clear email input after successful password reset request", async (): Promise<void> => {
    const testEmail: string = "test@example.com";
    
    const forgotPasswordMock: MockedResponse<ForgotPasswordMutation> = {
      request: {
        query: FORGOT_PASSWORD,
        variables: {
          data: {
            email: testEmail,
            lang: "fr",
          },
        },
      },
      result: {
        data: {
          forgotPassword: {
            message: "Success",
            code: 200,
          },
        },
      },
    };
    
    const mocks: MockedResponse[] = [forgotPasswordMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ForgotPasswordPage />
      </MockedProvider>
    );

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
