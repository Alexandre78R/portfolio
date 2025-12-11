// __test__/components/AdminLayout/Pages/EducationCreate.test.tsx

import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";

import EducationCreate from "@/components/AdminLayout/Pages/Educations/EducationCreate";
import { useLang, LangContextType } from "@/context/Lang/LangContext";
import useCustomToast, { AlertType } from "@/components/ToastCustom/CustomToast";
import {
  useCreateEducationMutation,
  CreateEducationInput,
  CreateEducationMutation,
} from "@/types/graphql";
import * as graphql from "@/types/graphql";
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
    required = false,
    type = "text",
  }: {
    id: string;
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    type?: string;
  }) => (
    <div data-testid={`input-container-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        aria-label={label}
        data-testid={`input-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    text,
    type = "button",
    disable = false,
  }: {
    text: string;
    type?: "button" | "submit";
    disable?: boolean;
  }) => (
    <button
      type={type}
      disabled={disable}
      data-testid="submit-button"
    >
      {text}
    </button>
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => () => (
  <div data-testid="loading">Loading...</div>
));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/types/graphql", () => {
  const mockUseCreateEducationMutation = jest.fn();
  (global as any).__mockUseCreateEducationMutation = mockUseCreateEducationMutation;
  return {
    __esModule: true,
    useCreateEducationMutation: mockUseCreateEducationMutation,
  };
});

const mockUseCreateEducationMutation = () => (global as any).__mockUseCreateEducationMutation;

type TestMutationFn = jest.Mock<
  Promise<FetchResult<CreateEducationMutation>>,
  [MutationFunctionOptions<CreateEducationMutation, { data: CreateEducationInput }, DefaultContext, ApolloCache<any>> | undefined]
>;

interface TestMutationResult {
  loading: boolean;
  error?: ApolloError | undefined; 
  data?: CreateEducationMutation | undefined;
  called: boolean;
  client: any;
  reset: jest.Mock<void, []>;
}

interface TestToastReturn {
  showAlert: jest.Mock<void, [AlertType, string]>;
  ToastContainer: () => ReactElement;
}

const translationsMock = {
  messageAdminEducationCreateTitle: "Create Education",
  messageAdminEducationCreateSuccess: "Education created successfully",
  messageAdminEducationCreateError: "Failed to create education",
  messageErrorServerOff: "Server is off",
  messageAdminEducationCreateLoading: "Creating...",
  messageAdminEducationCreateConfirm: "Confirm",
} as Lang;

describe("EducationCreate Component", (): void => {
  let mockMutationFn: TestMutationFn;
  const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();

    (useLang as jest.MockedFunction<typeof useLang>).mockReturnValue({
      translations: translationsMock,
      lang: "en",
      setLang: jest.fn() as (lang: "en" | "fr") => void,
      listLang: ["en", "fr"],
    } as LangContextType);

    (useCustomToast as jest.MockedFunction<typeof useCustomToast>).mockReturnValue({
      showAlert: mockShowAlert,
      ToastContainer: (): ReactElement => <div data-testid="toast-container" />,
    } as TestToastReturn);

    mockMutationFn = jest.fn<
      Promise<FetchResult<CreateEducationMutation>>,
      [MutationFunctionOptions<CreateEducationMutation, { data: CreateEducationInput }, DefaultContext, ApolloCache<any>> | undefined]
    >() as TestMutationFn;

    mockUseCreateEducationMutation().mockReturnValue([
      mockMutationFn,
      {
        called: false,
        loading: false,
        data: undefined,
        error: undefined,
        reset: jest.fn(),
        client: {
          query: jest.fn(),
          mutate: jest.fn(),
        },
      } as TestMutationResult,
    ]);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it("renders the form title correctly", (): void => {
    render(<EducationCreate />);

    const titleText: HTMLElement = screen.getByText(
      translationsMock.messageAdminEducationCreateTitle
    ) as HTMLElement;
    const formLayout: HTMLElement = screen.getByTestId("auth-form-layout") as HTMLElement;

    expect(titleText).toBeInTheDocument();
    expect(formLayout).toBeInTheDocument();
  });

  it("renders all form fields correctly", (): void => {
    render(<EducationCreate />);

    const schoolInput: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    const titleFRInput: HTMLInputElement = screen.getByTestId("input-titleFR") as HTMLInputElement;
    const yearInput: HTMLInputElement = screen.getByTestId("input-year") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    expect(schoolInput).toBeInTheDocument();
    expect(titleFRInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it("updates input fields correctly on user input", (): void => {
    render(<EducationCreate />);

    const schoolInput: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    const yearInput: HTMLInputElement = screen.getByTestId("input-year") as HTMLInputElement;

    fireEvent.change(schoolInput, { target: { value: "Test School" } });
    fireEvent.change(yearInput, { target: { value: "2025" } });

    expect(schoolInput).toHaveValue("Test School");
    expect(yearInput).toHaveValue(2025);
  });

  it("displays loading state correctly", (): void => {
    mockUseCreateEducationMutation().mockReturnValue([
      mockMutationFn,
      {
        called: false,
        loading: true,
        data: undefined,
        error: undefined,
        reset: jest.fn(),
        client: {
          query: jest.fn(),
          mutate: jest.fn(),
        },
      } as TestMutationResult,
    ]);

    render(<EducationCreate />);

    const loadingElement: HTMLElement = screen.getByTestId("loading") as HTMLElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    expect(loadingElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(translationsMock.messageAdminEducationCreateLoading);
  });

  it("submits form successfully and shows success toast", async (): Promise<void> => {
    const successResult: FetchResult<CreateEducationMutation> = {
      data: {
        createEducation: {
          __typename: "CreateEducationResponse",
          code: 200,
        } as any,
      },
    };

    mockMutationFn.mockResolvedValueOnce(successResult);

    render(<EducationCreate />);

    const schoolInput: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    const titleFRInput: HTMLInputElement = screen.getByTestId("input-titleFR") as HTMLInputElement;
    const yearInput: HTMLInputElement = screen.getByTestId("input-year") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    fireEvent.change(schoolInput, { target: { value: "Test School" } });
    fireEvent.change(titleFRInput, { target: { value: "Master Degree" } });
    fireEvent.change(yearInput, { target: { value: "2025" } });

    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockMutationFn).toHaveBeenCalledTimes(1);
      
      const callArgs: MutationFunctionOptions<
        CreateEducationMutation,
        { data: CreateEducationInput },
        DefaultContext,
        ApolloCache<any>
      > | undefined = mockMutationFn.mock.calls[0][0] as any;

      if (callArgs?.variables?.data) {
        expect(callArgs.variables.data.school).toBe("Test School");
        expect(callArgs.variables.data.year).toBe(2025);
        expect(callArgs.variables.data.month).toBe(0);
      }

      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messageAdminEducationCreateSuccess
      );
    });
  });

  it("shows error toast when mutation returns error code", async (): Promise<void> => {
    const errorResult: FetchResult<CreateEducationMutation> = {
      data: {
        createEducation: {
          __typename: "CreateEducationResponse",
          code: 400,
        } as any,
      },
    };

    mockMutationFn.mockResolvedValueOnce(errorResult);

    render(<EducationCreate />);

    const schoolInput: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    const titleFRInput: HTMLInputElement = screen.getByTestId("input-titleFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    fireEvent.change(schoolInput, { target: { value: "Test School" } });
    fireEvent.change(titleFRInput, { target: { value: "Test Title" } });
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockMutationFn).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messageAdminEducationCreateError
      );
    });
  });

  it("shows server error toast when mutation throws exception", async (): Promise<void> => {
    const mockNetworkError: Error = new Error("Network Error");

    mockMutationFn.mockRejectedValueOnce(mockNetworkError);

    render(<EducationCreate />);

    const schoolInput: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    const titleFRInput: HTMLInputElement = screen.getByTestId("input-titleFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    fireEvent.change(schoolInput, { target: { value: "Test School" } });
    fireEvent.change(titleFRInput, { target: { value: "Test Title" } });
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockMutationFn).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messageErrorServerOff
      );
    });
  });
});
