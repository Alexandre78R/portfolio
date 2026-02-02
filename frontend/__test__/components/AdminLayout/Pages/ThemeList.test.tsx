import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import "@testing-library/jest-dom";
import ThemeList from "@/components/AdminLayout/Pages/Themes/ThemesList";
import type { ThemeRow } from "@/components/AdminLayout/components/Theme/ThemeTable";
import { useGetThemesListQuery } from "@/types/graphql";
import { useDeleteThemeAdmin } from "@/utils/hooks";
import type Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminThemeListNotFound: "Theme list not found",
      messageAdminThemeColumnName: "Name",
      messageAdminThemeColumnNameEN: "Name EN",
      messageAdminThemeColumnNameFR: "Name FR",
      messageAdminThemeColumnAction: "Actions",
      messageAdminThemeListTitle: "Theme List",
    } as Lang,
  })),
}));

jest.mock("@/components/AdminLayout/components/Theme/ThemeEditModal", () => ({
  __esModule: true,
  default: jest.fn(({ theme }: { theme: ThemeRow | null }) => (
    <div data-testid="ThemeEditModal">{theme ? theme.name : "No theme"}</div>
  )),
}));


jest.mock("@/components/AdminLayout/components/Theme/ThemeDeleteDialog", () => ({
  __esModule: true,
  default: jest.fn(({ themeId }: { themeId: string | null }) => (
    <div data-testid="ThemeDeleteDialog">{themeId ?? "No delete"}</div>
  )),
}));

jest.mock("@/types/graphql", () => ({
  useGetThemesListQuery: jest.fn(),
}));

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useDeleteThemeAdmin: jest.fn(),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="loading">Loading...</div>),
}));

describe("ThemeList Component", () => {
  const mockRefetch: jest.Mock = jest.fn();
  const mockDelete: jest.Mock = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    mockDelete.mockResolvedValue({ data: { deleteTheme: { success: true } } });
    (useDeleteThemeAdmin as jest.Mock).mockReturnValue({
      deleteTheme: mockDelete,
      loading: false,
    });
  });

  test("renders loading state correctly", (): void => {
    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      data: null,
      refetch: mockRefetch,
    });

    render(<ThemeList />);

    const loadingElement: HTMLElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  test("renders error state correctly", (): void => {
    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: new Error("GraphQL error"),
      data: null,
      refetch: mockRefetch,
    });

    render(<ThemeList />);

    const errorElement: HTMLElement = screen.getByText("Theme list not found");
    expect(errorElement).toBeInTheDocument();
  });

  test("renders empty data correctly", (): void => {
    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listThemes: { themes: [] } },
      refetch: mockRefetch,
    });

    render(<ThemeList />);

    const headers: HTMLElement[] = screen.getAllByText(/Name|Name EN|Name FR|Actions/i);
    expect(headers.length).toBeGreaterThan(0);
  });

  test("renders theme list and handles actions correctly", async (): Promise<void> => {
    const mockThemes: ThemeRow[] = [
      { id: "1", name: "Theme1", nameEN: "Theme1EN", nameFR: "Theme1FR", visible: true },
      { id: "2", name: "Theme2", nameEN: "Theme2EN", nameFR: "Theme2FR", visible: false },
    ];

    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listThemes: { themes: mockThemes } },
      refetch: mockRefetch,
    });

    render(<ThemeList />);

    const themeCells: HTMLElement[] = screen.getAllByText(/Theme1|Theme2/);
    expect(themeCells.length).toBeGreaterThan(0);

    const editButtons: HTMLElement[] = screen.getAllByTitle("Edit");
    const deleteButtons: HTMLElement[] = screen.getAllByTitle("Delete");
    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);

    fireEvent.click(editButtons[0]);
    await waitFor((): void => {
      const editModal: HTMLElement = screen.getByTestId("ThemeEditModal");
      expect(editModal).toHaveTextContent("Theme1");
    });

    fireEvent.click(deleteButtons[1]);
    await waitFor((): void => {
      const deleteDialog: HTMLElement = screen.getByTestId("ThemeDeleteDialog");
      expect(deleteDialog).toHaveTextContent("2");
    });
  });

  test("handles null values gracefully", (): void => {
    const mockThemes: (ThemeRow | null)[] = [
      { id: "1", name: "Theme1", nameEN: null as unknown as string, nameFR: null as unknown as string, visible: true },
      null,
    ];

    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listThemes: { themes: mockThemes } },
      refetch: mockRefetch,
    });

    render(<ThemeList />);

    const themeCells: HTMLElement[] = screen.getAllByText("Theme1");
    expect(themeCells.length).toBeGreaterThan(0);
  });
});
