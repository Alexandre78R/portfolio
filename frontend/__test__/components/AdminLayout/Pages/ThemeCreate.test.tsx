import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";

import ThemeCreate from "@/components/AdminLayout/Pages/Themes/ThemeCreate"; // ✅ Chemin corrigé
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import useCustomToast, { type AlertType } from "@/components/ToastCustom/CustomToast";
import { type CreateThemeInput } from "@/types/graphql";
import { useCreateThemeAdmin } from "@/utils/hooks";
import type Lang from "@/lang/typeLang";
import {
  type ApolloCache,
  type DefaultContext,
  type MutationFunctionOptions,
  type FetchResult,
  type ApolloError,
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
  default: ({ children, type, className }: { children: React.ReactNode; type?: string; className?: string }) => (
    <div data-testid={`text-admin-${type}`} className={className}>
      {children}
    </div>
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
    placeholder,
  }: {
    id: string;
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div data-testid={`input-container-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        aria-label={label}
        data-testid={`input-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputColor", () => ({
  __esModule: true,
  default: ({
    id,
    label,
    name,
    value,
    onChange,
    required = false,
  }: {
    id: string;
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }) => (
    <div data-testid={`color-container-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        value={value.toLowerCase()}
        onChange={onChange}
        type="color"
        required={required}
        aria-label={label}
        data-testid={`color-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputBoolean", () => ({
  __esModule: true,
  default: ({
    id,
    label,
    name,
    value,
    onChange,
    className,
    optionClassName,
    selectedClassName,
  }: {
    id: string;
    label: string;
    name: string;
    value: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    optionClassName?: string;
    selectedClassName?: string;
  }) => (
    <div data-testid={`boolean-container-${id}`} className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={value}
        onChange={onChange}
        data-testid={`boolean-${id}`}
        className={optionClassName}
      />
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: (props: any) => {
    const isLoading = props.text?.includes("Creating") || 
                      props.text?.includes("Loading") || 
                      props.disable === true;
    return (
      <button
        type="submit"
        data-testid="submit-button"
        onClick={props.onClick}
        disabled={isLoading} 
      >
        {props.text || "Button"}
      </button>
    );
  },
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useCreateThemeAdmin: jest.fn(),
}));

type TestThemeMutationFn = jest.Mock<
  Promise<FetchResult<any>>,
  [MutationFunctionOptions<any, { data: CreateThemeInput }, DefaultContext, ApolloCache<any>> | undefined]
>;

interface TestThemeMutationResult {
  loading: boolean;
  error?: ApolloError | undefined;
  data?: any;
  called: boolean;
  client: any;
  reset: jest.Mock<void, []>;
}

interface TestToastReturn {
  showAlert: jest.Mock<void, [AlertType, string]>;
  ToastContainer: () => ReactElement;
}

const translationsMock: Lang = {
  messagePageAddNewThemesTitleH2: "Create New Theme",
  messagePageAddNewThemesInputThemeName: "Theme Name",
  messagePageAddNewThemesInputThemeNameEN: "Theme Name EN",
  messagePageAddNewThemesInputThemeNameFR: "Theme Name FR",
  messagePageAddNewThemesTextVisible: "Visible",
  messagePageAddNewThemesTitleColors: "Colors",
  messagePageAddNewThemesButtonTextSucces: "Create Theme",
  messagePageAddNewThemesButtonTextLoading: "Creating...",
  messagePageAddNewThemesSucces: "Theme created successfully",
  messagePageAddNewThemesError: "Failed to create theme",
  messageErrorServerOff: "Server is off",
} as Lang;

describe("ThemeCreate Component", (): void => {
  let mockThemeMutationFn: TestThemeMutationFn;
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

    mockThemeMutationFn = jest.fn<
      Promise<FetchResult<any>>,
      [MutationFunctionOptions<any, { data: CreateThemeInput }, DefaultContext, ApolloCache<any>> | undefined]
    >() as TestThemeMutationFn;
    mockThemeMutationFn.mockResolvedValue({ data: { createTheme: { theme: {} } } } as FetchResult<any>);

    (useCreateThemeAdmin as jest.Mock).mockReturnValue({
      createTheme: mockThemeMutationFn,
      loading: false,
    });
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it("renders the form title correctly", (): void => {
    render(<ThemeCreate />);
    const titleText: HTMLElement = screen.getByText(
      translationsMock.messagePageAddNewThemesTitleH2
    ) as HTMLElement;
    const formLayout: HTMLElement = screen.getByTestId("auth-form-layout") as HTMLElement;

    expect(titleText).toBeInTheDocument();
    expect(formLayout).toBeInTheDocument();
  });

  it("renders all form fields correctly", (): void => {
    render(<ThemeCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId("input-theme-name") as HTMLInputElement;
    const nameENInput: HTMLInputElement = screen.getByTestId("input-theme-nameEN") as HTMLInputElement;
    const nameFRInput: HTMLInputElement = screen.getByTestId("input-theme-nameFR") as HTMLInputElement;
    const visibleCheckbox: HTMLInputElement = screen.getByTestId("boolean-theme-visible") as HTMLInputElement;
    const primaryColor: HTMLInputElement = screen.getByTestId("color-color-primary") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    expect(nameInput).toBeInTheDocument();
    expect(nameENInput).toBeInTheDocument();
    expect(nameFRInput).toBeInTheDocument();
    expect(visibleCheckbox).toBeInTheDocument();
    expect(primaryColor).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(visibleCheckbox).toBeChecked();
  });

  it("updates text inputs correctly", (): void => {
    render(<ThemeCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId("input-theme-name") as HTMLInputElement;
    const nameENInput: HTMLInputElement = screen.getByTestId("input-theme-nameEN") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Dark Theme" } });
    fireEvent.change(nameENInput, { target: { value: "Dark Theme EN" } });

    expect(nameInput).toHaveValue("Dark Theme");
    expect(nameENInput).toHaveValue("Dark Theme EN");
  });

  it("toggles visible checkbox correctly", (): void => {
    render(<ThemeCreate />);

    const visibleCheckbox: HTMLInputElement = screen.getByTestId("boolean-theme-visible") as HTMLInputElement;

    expect(visibleCheckbox).toBeChecked();
    fireEvent.click(visibleCheckbox);
    expect(visibleCheckbox).not.toBeChecked();
  });

  it("updates color inputs correctly", (): void => {
    render(<ThemeCreate />);

    const primaryColor: HTMLInputElement = screen.getByTestId("color-color-primary") as HTMLInputElement;
    const bodyColor: HTMLInputElement = screen.getByTestId("color-color-body") as HTMLInputElement;

    fireEvent.change(primaryColor, { target: { value: "#ff0000" } });
    fireEvent.change(bodyColor, { target: { value: "#000000" } });

    expect(primaryColor).toHaveValue("#ff0000");
    expect(bodyColor).toHaveValue("#000000");
  });

  it("displays loading state correctly", (): void => {
    (useCreateThemeAdmin as jest.Mock).mockReturnValue({
      createTheme: mockThemeMutationFn,
      loading: true,
    });

    render(<ThemeCreate />);

    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(translationsMock.messagePageAddNewThemesButtonTextLoading);
  });

  it("submits form successfully and shows success toast", async (): Promise<void> => {
    const successResult: FetchResult<any> = {
      data: {
        createTheme: {
          __typename: "CreateThemeResponse",
          code: 200,
        },
      },
    };

    mockThemeMutationFn.mockResolvedValueOnce(successResult);

    render(<ThemeCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId("input-theme-name") as HTMLInputElement;
    const nameENInput: HTMLInputElement = screen.getByTestId("input-theme-nameEN") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "Test Theme" } });
    fireEvent.change(nameENInput, { target: { value: "Test Theme EN" } });
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockThemeMutationFn).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messagePageAddNewThemesSucces
      );
    });
  });

  it("shows error toast when mutation returns error code", async (): Promise<void> => {
    const errorResult: FetchResult<any> = {
      data: {
        createTheme: {
          __typename: "CreateThemeResponse",
          code: 400,
        },
      },
    };

    mockThemeMutationFn.mockResolvedValueOnce(errorResult);

    render(<ThemeCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId("input-theme-name") as HTMLInputElement;
    const nameENInput: HTMLInputElement = screen.getByTestId("input-theme-nameEN") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "Test Theme" } });
    fireEvent.change(nameENInput, { target: { value: "Test Theme EN" } });
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockThemeMutationFn).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messagePageAddNewThemesError
      );
    });
  });

  it("shows server error toast when mutation throws exception", async (): Promise<void> => {
    const mockNetworkError: Error = new Error("Network Error");

    mockThemeMutationFn.mockRejectedValueOnce(mockNetworkError);

    render(<ThemeCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId("input-theme-name") as HTMLInputElement;
    const nameENInput: HTMLInputElement = screen.getByTestId("input-theme-nameEN") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("submit-button") as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "Test Theme" } });
    fireEvent.change(nameENInput, { target: { value: "Test Theme EN" } });
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockThemeMutationFn).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messageErrorServerOff
      );
    });
  });
});
