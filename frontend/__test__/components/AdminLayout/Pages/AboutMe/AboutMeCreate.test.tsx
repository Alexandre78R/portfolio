import React, { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMeCreate from "@/components/AdminLayout/Pages/AboutMe/AboutMeCreate";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import CustomToast, { type AlertType } from "@/components/ToastCustom/CustomToast";
import { type ApolloError, type FetchResult } from "@apollo/client";
import {
  CreateAboutMeMutation,
  CreateAboutMeMutationVariables,
  useCreateAboutMeMutation,
} from "@/types/graphql";

type MockAuthFormLayoutProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

type MockTextAdminProps = {
  children: React.ReactNode;
};

type MockHtmlEditorProps = {
  content: string;
  onChange: (value: string) => void;
};

type MockInputBooleanProps = {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type MockButtonProps = {
  text: string;
  type?: "button" | "submit";
  disable?: boolean;
};

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ title, children }: MockAuthFormLayoutProps): ReactElement => (
    <div data-testid="auth-layout">
      <div data-testid="auth-title">{title}</div>
      <div data-testid="auth-content">{children}</div>
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: MockTextAdminProps): ReactElement => <h2>{children}</h2>,
}));

jest.mock("@/components/AdminLayout/components/Editor/HtmlEditor", () => ({
  __esModule: true,
  default: ({ content, onChange }: MockHtmlEditorProps): ReactElement => (
    <input
      data-testid="html-editor"
      value={content}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputBoolean", () => ({
  __esModule: true,
  default: ({ value, onChange }: MockInputBooleanProps): ReactElement => (
    <input
      data-testid="input-boolean"
      type="checkbox"
      checked={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChange(e)}
    />
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({ text, type = "button", disable = false }: MockButtonProps): ReactElement => (
    <button data-testid="submit-btn" type={type} disabled={disable}>
      {text}
    </button>
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn<LangContextType, []>(),
}));

const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockMutate: jest.Mock<
  Promise<FetchResult<CreateAboutMeMutation>>,
  [{ variables: CreateAboutMeMutationVariables }]
> = jest.fn();

jest.mock("@/types/graphql", () => ({
  ...jest.requireActual("@/types/graphql"),
  useCreateAboutMeMutation: jest.fn<
    [typeof mockMutate, { loading: boolean; error?: ApolloError }],
    []
  >(),
}));

describe("AboutMeCreate Page", (): void => {
  const translationsMock = {
    messageAdminAboutMeCreateTitle: "Create About Me",
    messageAdminAboutMeInputTitleFR: "Title FR",
    messageAdminAboutMeInputTitleEN: "Title EN",
    messageAdminAboutMeInputDescFR: "Description FR",
    messageAdminAboutMeInputDescEN: "Description EN",
    messageAdminAboutMeInputVisible: "Visible",
    messageAdminAboutMeCreateConfirm: "Create",
    messageAdminAboutMeCreateLoading: "Creating...",
    messageAdminAboutMeCreateSuccess: "Created successfully",
    messageAdminAboutMeCreateError: "Creation failed",
    messageErrorFieldsRequired: "All fields are required",
  } as unknown as Lang;

  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
    (CustomToast as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
    (useCreateAboutMeMutation as jest.Mock).mockReturnValue([mockMutate, { loading: false }]);
  });

  it("should render form with correct title", (): void => {
    render(<AboutMeCreate />);

    const titleElement: HTMLElement = screen.getByText("Create About Me");
    expect(titleElement).toBeInTheDocument();
  });

  it("should render all form fields", (): void => {
    render(<AboutMeCreate />);

    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    const inputBoolean: HTMLElement = screen.getByTestId("input-boolean");
    const submitButton: HTMLElement = screen.getByTestId("submit-btn");

    expect(htmlEditors).toHaveLength(4); // titleFR, titleEN, descFR, descEN
    expect(inputBoolean).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("should show validation error when submitting empty form", async (): Promise<void> => {
    render(<AboutMeCreate />);

    const submitButton: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith("error", "All fields are required");
    });
  });

  it("should submit mutation with correct form values", async (): Promise<void> => {
    mockMutate.mockResolvedValueOnce({
      data: {
        createAboutMe: {
          aboutMe: {
            id: "1",
            titleEN: "Test Title EN",
            titleFR: "Test Title FR",
            descriptionEN: "Test Description EN",
            descriptionFR: "Test Description FR",
            isVisible: true,
          },
          code: 201,
          message: "Created",
        },
      },
    });

    render(<AboutMeCreate />);

    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    
    // Fill form fields
    fireEvent.change(htmlEditors[0], { target: { value: "Test Title FR" } });
    fireEvent.change(htmlEditors[1], { target: { value: "Test Title EN" } });
    fireEvent.change(htmlEditors[2], { target: { value: "Test Description FR" } });
    fireEvent.change(htmlEditors[3], { target: { value: "Test Description EN" } });

    const inputBoolean: HTMLElement = screen.getByTestId("input-boolean");
    fireEvent.click(inputBoolean);

    const submitButton: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        variables: {
          data: {
            titleEN: "Test Title EN",
            titleFR: "Test Title FR",
            descriptionEN: "Test Description EN",
            descriptionFR: "Test Description FR",
            isVisible: true,
          },
        },
      });
    });
  });

  it("should show success message on successful creation", async (): Promise<void> => {
    mockMutate.mockResolvedValueOnce({
      data: {
        createAboutMe: {
          aboutMe: {
            id: "1",
            titleEN: "Title EN",
            titleFR: "Title FR",
            descriptionEN: "Description EN",
            descriptionFR: "Description FR",
            isVisible: false,
          },
          code: 201,
          message: "Created",
        },
      },
    });

    render(<AboutMeCreate />);

    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    fireEvent.change(htmlEditors[0], { target: { value: "Title FR" } });
    fireEvent.change(htmlEditors[1], { target: { value: "Title EN" } });
    fireEvent.change(htmlEditors[2], { target: { value: "Description FR" } });
    fireEvent.change(htmlEditors[3], { target: { value: "Description EN" } });

    const submitButton: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Created successfully");
    });
  });

  it("should show error message on failed creation", async (): Promise<void> => {
    mockMutate.mockResolvedValueOnce({
      data: {
        createAboutMe: {
          aboutMe: null,
          code: 500,
          message: "Server error",
        },
      },
    });

    render(<AboutMeCreate />);

    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    fireEvent.change(htmlEditors[0], { target: { value: "Title FR" } });
    fireEvent.change(htmlEditors[1], { target: { value: "Title EN" } });
    fireEvent.change(htmlEditors[2], { target: { value: "Description FR" } });
    fireEvent.change(htmlEditors[3], { target: { value: "Description EN" } });

    const submitButton: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Creation failed");
    });
  });

  it("should reset form after successful creation", async (): Promise<void> => {
    mockMutate.mockResolvedValueOnce({
      data: {
        createAboutMe: {
          aboutMe: {
            id: "1",
            titleEN: "Title EN",
            titleFR: "Title FR",
            descriptionEN: "Description EN",
            descriptionFR: "Description FR",
            isVisible: false,
          },
          code: 201,
          message: "Created",
        },
      },
    });

    render(<AboutMeCreate />);

    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    fireEvent.change(htmlEditors[0], { target: { value: "Title FR" } });
    fireEvent.change(htmlEditors[1], { target: { value: "Title EN" } });
    fireEvent.change(htmlEditors[2], { target: { value: "Description FR" } });
    fireEvent.change(htmlEditors[3], { target: { value: "Description EN" } });

    const submitButton: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor((): void => {
      const editorsAfterSubmit: HTMLElement[] = screen.getAllByTestId("html-editor");
      expect((editorsAfterSubmit[0] as HTMLInputElement).value).toBe("");
      expect((editorsAfterSubmit[1] as HTMLInputElement).value).toBe("");
      expect((editorsAfterSubmit[2] as HTMLInputElement).value).toBe("");
      expect((editorsAfterSubmit[3] as HTMLInputElement).value).toBe("");
    });
  });
});
