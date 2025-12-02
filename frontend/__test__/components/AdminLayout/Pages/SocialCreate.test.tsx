import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import SocialCreate from "@/components/AdminLayout/Pages/Socials/SocialCreate";
import { useLang, LangContextType } from "@/context/Lang/LangContext";
import useCustomToast, { AlertType } from "@/components/ToastCustom/CustomToast";
import {
  useCreateSocialMutation,
  CreateSocialInput,
  CreateSocialMutation,
} from "@/types/graphql";
import Lang from "@/lang/typeLang";
import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  FetchResult,
  ApolloError,
} from "@apollo/client";

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ title, children }: { title: ReactElement; children: ReactElement }) => (
    <div data-testid="auth-form-layout">
      <div data-testid="form-title">{title}</div>
      <div data-testid="form-content">{children}</div>
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode; type?: string }) => (
    <h2 data-testid="text-admin">{children}</h2>
  ),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({
    id,
    label,
    name,
    value,
    onChange,
    type = "text",
  }: {
    id: string;
    label: string;
    name: string;
    value: string | number;
    onChange: (e: any) => void;
    type?: string;
  }): ReactElement => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        data-testid={`input-field-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    text,
    type = "button",
    onClick,
    disable = false,
  }: {
    text: string;
    type?: string;
    onClick?: () => void;
    disable?: boolean;
  }): ReactElement => (
    <button
      type={type as "button" | "submit"}
      onClick={onClick}
      disabled={disable}
      data-testid={`button-${text}`}
    >
      {text}
    </button>
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

const mockCreateMutation: jest.Mock = jest.fn();
jest.mock("@/types/graphql", () => ({
  __esModule: true,
  useCreateSocialMutation: jest.fn(() => [mockCreateMutation, { loading: false }]),
}));

const mockShowAlert: jest.Mock = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showAlert: mockShowAlert,
  })),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminSocialCreateTitle: "Create Social",
      messageAdminSocialCreateConfirm: "Create",
      messageAdminSocialCreateLoading: "Creating...",
      messageAdminSocialCreateSuccess: "Social created successfully",
      messageAdminSocialCreateError: "Failed to create social",
      messageAdminSocialInputTitle: "Title",
      messageAdminSocialInputUrl: "URL",
      messageAdminSocialInputTab: "Tab Position",
    } as Lang,
  })),
}));

describe("SocialCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateMutation.mockClear();
    mockShowAlert.mockClear();
  });

  test("should render form layout", () => {
    mockCreateMutation.mockReturnValue([jest.fn(), { loading: false }]);

    render(<SocialCreate />);

    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
    expect(screen.getByText("Create Social")).toBeInTheDocument();
  });

  test("should render all input fields", () => {
    mockCreateMutation.mockReturnValue([jest.fn(), { loading: false }]);

    render(<SocialCreate />);

    expect(screen.getByTestId("input-title")).toBeInTheDocument();
    expect(screen.getByTestId("input-url")).toBeInTheDocument();
    expect(screen.getByTestId("input-tab")).toBeInTheDocument();
  });

  test("should render submit button", () => {
    mockCreateMutation.mockReturnValue([jest.fn(), { loading: false }]);

    render(<SocialCreate />);

    expect(screen.getByTestId("button-Create")).toBeInTheDocument();
  });

  test("should update form fields on input change", () => {
    mockCreateMutation.mockReturnValue([jest.fn(), { loading: false }]);

    render(<SocialCreate />);

    const titleInput = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput = screen.getByTestId("input-field-url") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });

    expect(titleInput.value).toBe("GitHub");
    expect(urlInput.value).toBe("https://github.com/user");
  });

  test("should call mutation on form submit with correct data", async () => {
    mockCreateMutation.mockResolvedValue({
      data: {
        createSocial: {
          code: 200,
          message: "Created",
        },
      },
    });

    render(<SocialCreate />);

    const titleInput = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton = screen.getByTestId("button-Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalled();
    });
  });

  test("should show success message on successful creation", async () => {
    mockCreateMutation.mockResolvedValue({
      data: {
        createSocial: {
          code: 200,
          message: "Created",
        },
      },
    });

    render(<SocialCreate />);

    const titleInput = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton = screen.getByTestId("button-Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social created successfully");
    });
  });

  test("should show error message on failed creation", async () => {
    mockCreateMutation.mockResolvedValue({
      data: {
        createSocial: {
          code: 400,
          message: "Error",
        },
      },
    });

    render(<SocialCreate />);

    const titleInput = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton = screen.getByTestId("button-Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to create social");
    });
  });

  test("should reset form after successful creation", async () => {
    mockCreateMutation.mockResolvedValue({
      data: {
        createSocial: {
          code: 200,
        },
      },
    });

    render(<SocialCreate />);

    const titleInput = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton = screen.getByTestId("button-Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(urlInput.value).toBe("");
      expect(tabInput.value).toBe("0");
    });
  });

  test("should disable submit button during loading", () => {
    const { useCreateSocialMutation } = require("@/types/graphql");
    (useCreateSocialMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: true }]);

    render(<SocialCreate />);

    const buttons = screen.getAllByRole("button");
    const submitButton = buttons[buttons.length - 1] as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });
});
