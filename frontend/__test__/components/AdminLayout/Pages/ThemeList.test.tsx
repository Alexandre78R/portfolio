import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import ThemeList, { ThemeRow } from "@/components/AdminLayout/Pages/Themes/ThemesList";
import { useGetThemesListQuery, useDeleteThemeMutation } from "@/types/graphql";
import Lang from "@/lang/typeLang";

// ------------------ MOCKS ------------------

// Mock LangContext
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

// Mock ThemeEditModal
jest.mock("@/components/AdminLayout/components/Theme/ThemeEditModal", () => ({
  __esModule: true,
  default: jest.fn(({ theme }: { theme: ThemeRow | null }) => (
    <div data-testid="ThemeEditModal">{theme ? theme.name : "No theme"}</div>
  )),
}));

// Mock ThemeDeleteDialog
jest.mock("@/components/AdminLayout/components/Theme/ThemeDeleteDialog", () => ({
  __esModule: true,
  default: jest.fn(({ themeId }: { themeId: string | null }) => (
    <div data-testid="ThemeDeleteDialog">{themeId ?? "No delete"}</div>
  )),
}));

// Mock GraphQL hooks
jest.mock("@/types/graphql", () => ({
  useGetThemesListQuery: jest.fn(),
  useDeleteThemeMutation: jest.fn(),
}));

// Mock LoadingCustom
jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="loading">Loading...</div>),
}));

// ------------------ TEST SUITE ------------------

describe("ThemeList Component", () => {
  const mockRefetch: jest.Mock = jest.fn();
  const mockDelete: jest.Mock = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    // Mock delete mutation
    (useDeleteThemeMutation as jest.Mock).mockReturnValue([mockDelete, {}]);
  });

  test("renders loading state correctly", (): void => {
    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      data: null,
      refetch: mockRefetch,
    });

    render(
      <MockedProvider>
        <ThemeList />
      </MockedProvider>
    );

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

    render(
      <MockedProvider>
        <ThemeList />
      </MockedProvider>
    );

    const errorElement: HTMLElement = screen.getByText("Theme list not found");
    expect(errorElement).toBeInTheDocument();
  });

  test("renders empty data correctly", (): void => {
    (useGetThemesListQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { themeList: { themes: [] } },
      refetch: mockRefetch,
    });

    render(
      <MockedProvider>
        <ThemeList />
      </MockedProvider>
    );

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
      data: { themeList: { themes: mockThemes } },
      refetch: mockRefetch,
    });

    render(
      <MockedProvider>
        <ThemeList />
      </MockedProvider>
    );

    // Check that theme rows exist
    const themeCells: HTMLElement[] = screen.getAllByText(/Theme1|Theme2/);
    expect(themeCells.length).toBeGreaterThan(0);

    // Check action buttons via title attribute
    const editButtons: HTMLElement[] = screen.getAllByTitle("Edit");
    const deleteButtons: HTMLElement[] = screen.getAllByTitle("Delete");
    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);

    // Open edit modal for first theme
    fireEvent.click(editButtons[0]);
    await waitFor((): void => {
      const editModal: HTMLElement = screen.getByTestId("ThemeEditModal");
      expect(editModal).toHaveTextContent("Theme1");
    });

    // Open delete dialog for second theme
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
      data: { themeList: { themes: mockThemes } },
      refetch: mockRefetch,
    });

    render(
      <MockedProvider>
        <ThemeList />
      </MockedProvider>
    );

    const themeCells: HTMLElement[] = screen.getAllByText("Theme1");
    expect(themeCells.length).toBeGreaterThan(0);
  });
});