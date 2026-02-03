import React, { ReactElement, ChangeEvent, FormEvent } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import ThemeEditModal, { ThemeFormData } from "@/components/AdminLayout/components/Theme/ThemeEditModal";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useUpdateThemeMutation, useGetThemeByIdQuery, GetThemesListQuery } from "@/types/graphql";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminThemeEditTitle: "Edit Theme",
      messageAdminThemeEditSave: "Save",
      messageAdminThemeEditCancel: "Cancel",
      messageAdminThemeEditError: "Failed to save theme",
    } as Lang,
  })),
}));

const mockShowAlert: jest.Mock = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

const mockUpdateThemeMutation: jest.Mock = jest.fn();
const mockUseGetThemeByIdQuery: jest.Mock = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useUpdateThemeAdmin: jest.fn<[typeof mockUpdateThemeMutation], []>(),
}));

jest.mock("@/types/graphql", () => ({
  useGetThemeByIdQuery: jest.fn(() => mockUseGetThemeByIdQuery()),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: jest.fn((props: { children: ReactElement }) => <div data-testid="modal">{props.children}</div>),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: jest.fn((props: { children: ReactElement }) => <div data-testid="text-admin">{props.children}</div>),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: jest.fn((props: { name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <input data-testid={`input-${props.name}`} value={props.value} onChange={props.onChange} />
  )),
}));

jest.mock("@/components/AdminLayout/components/Input/InputColor", () => ({
  __esModule: true,
  default: jest.fn((props: { name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <input data-testid={`color-${props.name}`} value={props.value} onChange={props.onChange} />
  )),
}));

jest.mock("@/components/AdminLayout/components/Input/InputBoolean", () => ({
  __esModule: true,
  default: jest.fn((props: { name: string; value: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <input type="checkbox" data-testid={`checkbox-${props.name}`} checked={props.value} onChange={props.onChange} />
  )),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: jest.fn((props: { text: string; disable?: boolean; onClick: () => void }) => (
    <button data-testid={`button-${props.text}`} disabled={props.disable} onClick={props.onClick}>
      {props.text}
    </button>
  )),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="loading">Loading...</div>),
}));

describe("ThemeEditModal Component", (): void => {
  const mockOnClose: jest.Mock = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);
  const mockOnChange: jest.Mock = jest.fn();

  const sampleTheme: ThemeFormData = {
    id: "1",
    name: "Theme1",
    nameEN: "Theme1EN",
    nameFR: "Theme1FR",
    visible: true,
    body: "#FFFFFF",
    scrollHandle: "#CCCCCC",
    scrollHandleHover: "#999999",
    primary: "#000000",
    secondary: "#666666",
    success: "#00FF00",
    error: "#FF0000",
    warn: "#FFA500",
    info: "#0000FF",
    grey: "#808080",
    placeholder: "#CCCCCC",
    admin: "#000000",
    textDefault: "#000000",
    text100: "#1a1a1a",
    text200: "#333333",
    text300: "#666666",
    textButton: "#FFFFFF",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    
    const { useUpdateThemeAdmin } = require("@/utils/hooks");
    (useUpdateThemeAdmin as jest.Mock).mockReturnValue([mockUpdateThemeMutation]);
  });

  test("renders null if no theme provided", (): void => {
    mockUseGetThemeByIdQuery.mockReturnValue({ data: null, loading: false });
    const { container } = render(
      <ThemeEditModal theme={null} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders loading state while theme is loading", (): void => {
    mockUseGetThemeByIdQuery.mockReturnValue({ data: null, loading: true });
    render(
      <ThemeEditModal theme={sampleTheme} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders form with inputs correctly", (): void => {
    mockUseGetThemeByIdQuery.mockReturnValue({ data: { getThemeById: { theme: sampleTheme } }, loading: false });
    render(
      <ThemeEditModal theme={sampleTheme} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />
    );

    const nameInput: HTMLInputElement = screen.getByTestId("input-name") as HTMLInputElement;
    expect(nameInput.value).toBe(sampleTheme.name);

    const visibleCheckbox: HTMLInputElement = screen.getByTestId("checkbox-visible") as HTMLInputElement;
    expect(visibleCheckbox.checked).toBe(true);

    const saveButton: HTMLButtonElement = screen.getByTestId("button-Save") as HTMLButtonElement;
    expect(saveButton).toBeInTheDocument();
  });

  test("calls onChange callback when input value changes", (): void => {
    mockUseGetThemeByIdQuery.mockReturnValue({ data: { getThemeById: { theme: sampleTheme } }, loading: false });
    render(
      <ThemeEditModal theme={sampleTheme} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />
    );

    const nameInput: HTMLInputElement = screen.getByTestId("input-name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { name: "name", value: "NewName" } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  test("submits form and handles success response", async (): Promise<void> => {
    mockUseGetThemeByIdQuery.mockReturnValue({ data: { getThemeById: { theme: sampleTheme } }, loading: false });
    mockUpdateThemeMutation.mockResolvedValue({ data: { updateTheme: { code: 200 } } });

    render(<ThemeEditModal theme={sampleTheme} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />);

    const formEl: HTMLFormElement | null = screen.getByTestId("modal")?.querySelector("form") as HTMLFormElement;
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateThemeMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Save");
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  test("submits form and handles error response", async (): Promise<void> => {
    mockUseGetThemeByIdQuery.mockReturnValue({ data: { getThemeById: { theme: sampleTheme } }, loading: false });
    mockUpdateThemeMutation.mockResolvedValue({ data: { updateTheme: { code: 500 } } });

    render(<ThemeEditModal theme={sampleTheme} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />);

    const formEl: HTMLFormElement | null = screen.getByTestId("modal")?.querySelector("form") as HTMLFormElement;
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(mockUpdateThemeMutation).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to save theme");
    }, { timeout: 2000 });
  });

  test("closes modal when Cancel button is clicked", (): void => {
    render(<ThemeEditModal theme={sampleTheme} onClose={mockOnClose} onRefresh={mockOnRefresh} onChange={mockOnChange} />);

    const cancelButton: HTMLButtonElement = screen.getByTestId("button-Cancel") as HTMLButtonElement;
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
