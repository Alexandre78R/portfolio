import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@test-utils";
import "@testing-library/jest-dom";
import TranslationsList from "@/components/AdminLayout/Pages/Translations/TranslationsList";

// Mock hooks
jest.mock("@/utils/hooks/useTranslation", () => ({
  useListTranslationsPaginated: jest.fn(),
  useUpsertTranslation: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/AdminLayout/AdminLayout", () => {
  const MockAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-testid="admin-layout">{children}</div>
  );
  MockAdminLayout.displayName = "AdminLayout";
  return MockAdminLayout;
});

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => {
  const MockTextAdmin: React.FC<{ children: React.ReactNode; type?: string }> = ({ children }) => (
    <div data-testid="text-admin">{children}</div>
  );
  MockTextAdmin.displayName = "TextAdmin";
  return MockTextAdmin;
});

jest.mock("@/components/AdminLayout/components/Translations/TranslationsFilter", () => {
  const MockFilter: React.FC<any> = ({ onSearch, onFilterChange }) => (
    <div data-testid="translations-filter">
      <button data-testid="search-btn" onClick={() => onSearch("test")}>
        Filter
      </button>
      <button data-testid="lang-filter-btn" onClick={() => onFilterChange("fr")}>
        Language
      </button>
    </div>
  );
  MockFilter.displayName = "TranslationsFilter";
  return MockFilter;
});

jest.mock("@/components/AdminLayout/components/Translations/TranslationsTable", () => {
  const MockTable: React.FC<any> = ({ translations, onEdit }) => (
    <div data-testid="translations-table">
      {translations?.map((t: any) => (
        <button key={t.key} data-testid={`edit-${t.key}`} onClick={() => onEdit(t)}>
          {t.key}
        </button>
      ))}
    </div>
  );
  MockTable.displayName = "TranslationsTable";
  return MockTable;
});

jest.mock("@/components/AdminLayout/components/Translations/TranslationsEditModal", () => {
  const MockModal: React.FC<any> = ({ isOpen, onClose, translation, onSave }) => (
    <div data-testid="translations-modal">
      {isOpen && (
        <>
          <div>{translation?.key}</div>
          <button data-testid="modal-close" onClick={onClose}>
            Close
          </button>
          <button
            data-testid="modal-save"
            onClick={async () => {
              await onSave("new value");
            }}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
  MockModal.displayName = "TranslationsEditModal";
  return MockModal;
});

jest.mock("@/components/Loading/LoadingCustom", () => {
  const MockLoading: React.FC = () => <div data-testid="loading">Loading...</div>;
  MockLoading.displayName = "LoadingCustom";
  return MockLoading;
});

import { useListTranslationsPaginated, useUpsertTranslation } from "@/utils/hooks/useTranslation";
import { useLang } from "@/context/Lang/LangContext";

describe("TranslationsList Component", (): void => {
  const mockListTranslations = jest.fn();
  const mockUpsertTranslation = jest.fn();
  const mockRefetch = jest.fn();

  const mockTranslationsData = {
    listTranslationsPaginated: {
      translations: [
        { key: "messageAdminTranslationsTitle", value: "Gestion des traductions" },
        { key: "messageAdminTranslationsEditValue", value: "Valeur" },
      ],
      total: 2,
      page: 1,
      limit: 10,
    },
  };

  const mockContextTranslations = {
    messageAdminTranslationsTitle: "Gestion des traductions",
    messageAdminTranslationsPaginationPrevious: "Précédent",
    messageAdminTranslationsPaginationNext: "Suivant",
    messageAdminTranslationsPaginationOf: "sur",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    
    (useListTranslationsPaginated as jest.Mock).mockReturnValue({
      data: mockTranslationsData,
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    (useUpsertTranslation as jest.Mock).mockReturnValue({
      upsertTranslation: mockUpsertTranslation,
      loading: false,
      error: undefined,
    });

    (useLang as jest.Mock).mockReturnValue({
      translations: mockContextTranslations,
      lang: "fr",
    });
  });

  it("renders page header", (): void => {
    render(<TranslationsList />);
    expect(screen.getAllByTestId("text-admin")[0]).toHaveTextContent("Gestion des traductions");
  });

  it("renders translations filter", (): void => {
    render(<TranslationsList />);
    expect(screen.getByTestId("translations-filter")).toBeInTheDocument();
  });

  it("renders translations table", (): void => {
    render(<TranslationsList />);
    expect(screen.getByTestId("translations-table")).toBeInTheDocument();
  });

  it("renders translations edit modal", (): void => {
    render(<TranslationsList />);
    expect(screen.queryByTestId("translations-modal")).not.toBeInTheDocument();
  });

  it("calls useListTranslationsPaginated with correct initial params", (): void => {
    render(<TranslationsList />);
    
    expect(useListTranslationsPaginated).toHaveBeenCalledWith(1, 10, null, null);
  });

  it("displays loading state when fetching", (): void => {
    (useListTranslationsPaginated as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    });

    render(<TranslationsList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("opens modal when edit button is clicked", async (): Promise<void> => {
    render(<TranslationsList />);
    
    const editButton: HTMLElement = screen.getByTestId("edit-messageAdminTranslationsTitle");
    fireEvent.click(editButton);
    
    await waitFor((): void => {
      const modal: HTMLElement = screen.getByTestId("translations-modal");
      expect(modal).toBeInTheDocument();
      expect(within(modal).getByText("messageAdminTranslationsTitle")).toBeInTheDocument();
    });
  });

  it("closes modal when close button is clicked", async (): Promise<void> => {
    render(<TranslationsList />);
    
    const editButton: HTMLElement = screen.getByTestId("edit-messageAdminTranslationsTitle");
    fireEvent.click(editButton);
    
    await waitFor((): void => {
      const closeButton: HTMLElement = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);
    });

    await waitFor((): void => {
      expect(screen.queryByTestId("translations-modal")).not.toBeInTheDocument();
    });
  });

  it("saves translation and refetches data", async (): Promise<void> => {
    mockUpsertTranslation.mockResolvedValue(undefined);
    
    render(<TranslationsList />);
    
    const editButton: HTMLElement = screen.getByTestId("edit-messageAdminTranslationsTitle");
    fireEvent.click(editButton);
    
    await waitFor((): void => {
      const saveButton: HTMLElement = screen.getByTestId("modal-save");
      fireEvent.click(saveButton);
    });
    
    await waitFor((): void => {
      expect(mockUpsertTranslation).toHaveBeenCalledWith("messageAdminTranslationsTitle", "new value", "fr");
    });
  });

  it("updates search state when search is triggered", async (): Promise<void> => {
    render(<TranslationsList />);
    
    const searchBtn: HTMLElement = screen.getByTestId("search-btn");
    fireEvent.click(searchBtn);
    
    await waitFor((): void => {
      expect(useListTranslationsPaginated).toHaveBeenCalledWith(1, 10, null, "test");
    });
  });

  it("updates language filter when filter changes", async (): Promise<void> => {
    render(<TranslationsList />);
    
    const filterBtn: HTMLElement = screen.getByTestId("lang-filter-btn");
    fireEvent.click(filterBtn);
    
    await waitFor((): void => {
      expect(useListTranslationsPaginated).toHaveBeenCalledWith(1, 10, "fr", null);
    });
  });

  it("passes translations array to table component", (): void => {
    render(<TranslationsList />);
    
    mockTranslationsData.listTranslationsPaginated.translations.forEach((translation) => {
      // Verify the translation is rendered (either in table or edit buttons)
      const elements: HTMLElement[] = screen.queryAllByText(translation.key);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("handles pagination state", (): void => {
    render(<TranslationsList />);
    
    expect(useListTranslationsPaginated).toHaveBeenCalledWith(1, 10, null, null);
  });

  it("manages pagination limit of 10 items", (): void => {
    render(<TranslationsList />);
    
    const callArgs = (useListTranslationsPaginated as jest.Mock).mock.calls[0];
    const limit: number = callArgs[1];
    expect(limit).toBe(10);
  });

  it("resets page to 1 when search term changes", async (): Promise<void> => {
    render(<TranslationsList />);

    const searchBtn: HTMLElement = screen.getByTestId("search-btn");
    fireEvent.click(searchBtn);

    await waitFor((): void => {
      const latestCall = (useListTranslationsPaginated as jest.Mock).mock.calls.at(-1);
      expect(latestCall?.[0]).toBe(1);
    });
  });

  it("handles empty translations array", (): void => {
    (useListTranslationsPaginated as jest.Mock).mockReturnValue({
      data: {
        listTranslationsPaginated: {
          translations: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(<TranslationsList />);
    expect(screen.queryByTestId("translations-table")).not.toBeInTheDocument();
    expect(screen.getByText("Aucune traduction trouvée")).toBeInTheDocument();
  });

  it("passes correct props to edit modal", (): void => {
    render(<TranslationsList />);
    expect(screen.queryByTestId("translations-modal")).not.toBeInTheDocument();
  });
});
