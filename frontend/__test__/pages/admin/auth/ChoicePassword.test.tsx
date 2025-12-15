import React, { ChangeEvent, FormEvent, ReactNode, MouseEvent as ReactMouseEvent } from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import ChangePasswordPage, { ChangePasswordFormState, ChangePasswordMutation, ChangePasswordMutationVariables } from "@/pages/admin/auth/changePassword";
import { CHANGE_PASSWORD } from "@/requetes/mutations/user.mutations";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useUser, UserContextType } from "@/context/UserContext/UserContext";
import { useRouter } from "next/router";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext");
jest.mock("@/components/ToastCustom/CustomToast");
jest.mock("@/context/UserContext/UserContext");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

type ChangePasswordTranslationsMock = Pick<
  Lang,
  | "messagePageChoicePasswordTitle"
  | "messagePageChoicePasswordNew"
  | "messagePageChoicePasswordConfirm"
  | "messagePageChoicePasswordButton"
  | "messagePageChoicePasswordSuccess"
  | "messagePageChoicePasswordErrorMinLength"
  | "messagePageChoicePasswordErrorMismatch"
  | "messagePageChoicePasswordErrorEmailNotFound"
  | "messagePageChoicePasswordErrorServer"
  | "messagePageChoicePasswordErrorUnexpected"
>;

const translationsMock: ChangePasswordTranslationsMock = {
  messagePageChoicePasswordTitle: "Choisir un mot de passe",
  messagePageChoicePasswordNew: "Nouveau mot de passe",
  messagePageChoicePasswordConfirm: "Confirmer le nouveau mot de passe",
  messagePageChoicePasswordButton: "Valider",
  messagePageChoicePasswordSuccess: "Mot de passe changé avec succès",
  messagePageChoicePasswordErrorMinLength: "Le mot de passe doit contenir au moins 8 caractères",
  messagePageChoicePasswordErrorMismatch: "Les mots de passe ne correspondent pas",
  messagePageChoicePasswordErrorEmailNotFound: "Email non trouvé",
  messagePageChoicePasswordErrorServer: "Erreur serveur : veuillez réessayer plus tard.",
  messagePageChoicePasswordErrorUnexpected: "Une erreur est survenue",
};

const mockShowAlert: jest.Mock<void, [type: "success" | "error", message: string]> = jest.fn();
const mockRouterReplace: jest.Mock<Promise<boolean>, [pathname: string]> = jest.fn(async (pathname: string): Promise<boolean> => true);
const mockRouterPush: jest.Mock<Promise<boolean>, [pathname: string]> = jest.fn(async (pathname: string): Promise<boolean> => true);

describe("ChangePasswordPage Component", (): void => {
  const mockUser: UserContextType | any = {
    user: {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      role: "admin",
      isPasswordChange: false,
    },
    loading: false,
    refetch: jest.fn(async () => ({ data: undefined })),
  };

  const getNewPasswordInput = (): HTMLInputElement =>
    document.getElementById('change-password-new') as HTMLInputElement;

  const getConfirmPasswordInput = (): HTMLInputElement =>
    document.getElementById('change-password-confirm') as HTMLInputElement;

  beforeEach((): void => {
    jest.clearAllMocks();
    
    (useLang as jest.Mock).mockReturnValue({
      translations: translationsMock,
      lang: "fr",
    });
    
    (CustomToast as jest.Mock).mockReturnValue({
      showAlert: mockShowAlert,
    });
    
    (useUser as jest.Mock).mockReturnValue(mockUser);
    
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
      push: mockRouterPush,
    });
  });

  it("should render change password form with correct title", (): void => {
    const mocks: MockedResponse[] = [];
    
    const renderResult: RenderResult = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );
    
    const titleElement: HTMLElement = screen.getByText(translationsMock.messagePageChoicePasswordTitle);
    expect(titleElement).toBeInTheDocument();
    
    expect(renderResult.container).toBeInTheDocument();
  });

  it("should render new password and confirm password input fields", (): void => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );
    
    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput();
    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;

    expect(newPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(submitButton).toBeInTheDocument();
  });

  it("should update form state when typing passwords", async (): Promise<void> => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );
    
    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput();
    const testPassword: string = "SecurePassword123!";

    fireEvent.change(newPasswordInput, { target: { value: testPassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: testPassword } });

    await waitFor((): void => {
      expect(newPasswordInput.value).toBe(testPassword);
      expect(confirmPasswordInput.value).toBe(testPassword);
    });
  });

  it("should display error when password is too short", async (): Promise<void> => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput();
    const shortPassword: string = "short1!";
    
    fireEvent.change(newPasswordInput, { target: { value: shortPassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: shortPassword } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageChoicePasswordErrorMinLength
      );
    });
  });

  it("should display error when passwords do not match", async (): Promise<void> => {
    const mocks: MockedResponse[] = [];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput();
    
    fireEvent.change(newPasswordInput, { target: { value: "SecurePassword123!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "DifferentPassword456!" } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageChoicePasswordErrorMismatch
      );
    });
  });

  it("should successfully change password and show success message", async (): Promise<void> => {
    const testPassword: string = "SecurePassword123!";
    const userEmail: string = "john@example.com";
    
    const changePasswordMock: MockedResponse<ChangePasswordMutation> = {
      request: {
        query: CHANGE_PASSWORD,
        variables: {
          email: userEmail,
          newPassword: testPassword,
        },
      },
      result: {
        data: {
          changePassword: {
            message: "Password changed successfully",
            code: 200,
          },
        },
      },
    };
    
    const mocks: MockedResponse[] = [changePasswordMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput();
    
    fireEvent.change(newPasswordInput, { target: { value: testPassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: testPassword } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messagePageChoicePasswordSuccess
      );
      expect(mockUser.refetch).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("should display server error on mutation failure with code 500", async (): Promise<void> => {
    const testPassword: string = "SecurePassword123!";
    const userEmail: string = "john@example.com";
    
    const changePasswordErrorMock: MockedResponse<ChangePasswordMutation> = {
      request: {
        query: CHANGE_PASSWORD,
        variables: {
          email: userEmail,
          newPassword: testPassword,
        },
      },
      result: {
        data: {
          changePassword: {
            message: "Server error",
            code: 500,
          },
        },
      },
    };
    
    const mocks: MockedResponse[] = [changePasswordErrorMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput()
    
    fireEvent.change(newPasswordInput, { target: { value: testPassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: testPassword } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageChoicePasswordErrorServer
      );
    });
  });

  it("should show loading state when submitting form", async (): Promise<void> => {
    const testPassword: string = "SecurePassword123!";
    const userEmail: string = "john@example.com";
    
    const changePasswordMock: MockedResponse<ChangePasswordMutation> = {
      request: {
        query: CHANGE_PASSWORD,
        variables: {
          email: userEmail,
          newPassword: testPassword,
        },
      },
      result: {
        data: {
          changePassword: {
            message: "Success",
            code: 200,
          },
        },
      },
      delay: 100,
    };
    
    const mocks: MockedResponse[] = [changePasswordMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    const newPasswordInput: HTMLInputElement = getNewPasswordInput();
    const confirmPasswordInput: HTMLInputElement = getConfirmPasswordInput();
    
    fireEvent.change(newPasswordInput, { target: { value: testPassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: testPassword } });

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;
    
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(screen.getByText(translationsMock.messagePageChoicePasswordButton + "...")).toBeInTheDocument();
    });
  });

  it("should redirect to dashboard when user already changed password", async (): Promise<void> => {
    const userAlreadyChangedPassword: UserContextType = {
      ...mockUser,
      user: {
        ...mockUser.user!,
        isPasswordChange: true,
      },
    };
    
    (useUser as jest.Mock).mockReturnValue(userAlreadyChangedPassword);
    
    const mocks: MockedResponse[] = [];

    jest.useFakeTimers();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    jest.runAllTimers();
    jest.useRealTimers();

    await waitFor((): void => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("should redirect to login when no user is authenticated", async (): Promise<void> => {
    const noUserContext: UserContextType | any = {
      user: null,
      loading: false,
      refetch: jest.fn(async () => ({ data: undefined })),
    };
    
    (useUser as jest.Mock).mockReturnValue(noUserContext);
    
    const mocks: MockedResponse[] = [];

    jest.useFakeTimers();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChangePasswordPage />
      </MockedProvider>
    );

    jest.runAllTimers();
    jest.useRealTimers();

    await waitFor((): void => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/admin/auth/login");
    });
  });
});
