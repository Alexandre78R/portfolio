import React from "react";
import { render, screen, fireEvent } from "@test-utils";
import "@testing-library/jest-dom";
import TranslationsTable from "@/components/AdminLayout/components/Translations/TranslationsTable";

describe("TranslationsTable Component", (): void => {
  const mockOnEdit: jest.Mock<void, [{ key: string; value: string }]> = jest.fn();

  const mockTranslations = [
    { key: "messageAdminTranslationsTitle", value: "Gestion des traductions" },
    { key: "messageAdminTranslationsEditValue", value: "Valeur" },
    { key: "messageAdminTranslationsEditCancel", value: "Annuler" },
  ];

  const defaultProps = {
    translations: mockTranslations,
    onEdit: mockOnEdit,
    translations_context: {
      messageAdminTranslationsTableColumnKey: "Clé",
      messageAdminTranslationsTableColumnFR: "Français",
      messageAdminTranslationsTableColumnEN: "Anglais",
      messageAdminTranslationsTableColumnAction: "Actions",
      messageAdminTranslationsEditButton: "Modifier",
    },
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("renders table", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    const tableElement: HTMLElement | null = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  it("renders all column headers", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    expect(screen.getByText("Clé")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Anglais")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders all translation keys in table", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    mockTranslations.forEach((translation) => {
      expect(screen.getByText(translation.key)).toBeInTheDocument();
    });
  });

  it("renders all translation values in table", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    mockTranslations.forEach((translation) => {
      const matches: HTMLElement[] = screen.getAllByText(translation.value);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it("renders edit button for each translation", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    const editButtons: HTMLElement[] = screen.getAllByRole("button", { name: /modifier|edit/i });
    expect(editButtons.length).toBeGreaterThanOrEqual(mockTranslations.length);
  });

  it("calls onEdit with correct translation when edit button is clicked", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    const editButtons: HTMLElement[] = screen.getAllByRole("button", { name: /modifier|edit/i });
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockTranslations[0]);
  });

  it("handles empty translations array", (): void => {
    const emptyProps = {
      ...defaultProps,
      translations: [],
    };
    
    render(<TranslationsTable {...emptyProps} />);
    
    // Should still render table headers
    const tableElement: HTMLElement | null = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  it("displays translations in correct table cells", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    const rows: HTMLElement[] = screen.getAllByRole("row");
    // First row is header, second is first translation
    const firstDataRow: HTMLElement = rows[1];
    
    expect(firstDataRow).toHaveTextContent(mockTranslations[0].key);
    expect(firstDataRow).toHaveTextContent(mockTranslations[0].value);
  });

  it("uses custom translations for labels", (): void => {
    const customProps = {
      ...defaultProps,
      translations_context: {
        ...defaultProps.translations_context,
        messageAdminTranslationsTableColumnKey: "Translation Key",
        messageAdminTranslationsTableColumnFR: "French",
      },
    };
    
    render(<TranslationsTable {...customProps} />);
    
    expect(screen.getByText("Translation Key")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("uses default labels when translations not provided", (): void => {
    const propsWithoutTranslations = {
      ...defaultProps,
      translations_context: {},
    };
    
    render(<TranslationsTable {...propsWithoutTranslations} />);
    
    // Should render with defaults or empty strings
    const tableElement: HTMLElement | null = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  it("handles multiple edit button clicks", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    const editButtons: HTMLElement[] = screen.getAllByRole("button", { name: /modifier|edit/i });
    
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTranslations[0]);
    
    fireEvent.click(editButtons[1]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTranslations[1]);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(2);
  });

  it("renders keys with monospace font", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    const keyCell: HTMLElement = screen.getByText(mockTranslations[0].key);
    const parentElement: HTMLElement | null = keyCell.closest(".font-mono");
    
    expect(parentElement).toBeInTheDocument();
  });

  it("maintains table structure with readonly content", (): void => {
    render(<TranslationsTable {...defaultProps} />);
    
    const rows: HTMLElement[] = screen.getAllByRole("row");
    // Header + data rows
    expect(rows.length).toBe(mockTranslations.length + 1);
  });
});
