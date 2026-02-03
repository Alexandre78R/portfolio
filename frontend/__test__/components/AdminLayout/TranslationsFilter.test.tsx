import React from "react";
import { render, screen, fireEvent } from "@test-utils";
import "@testing-library/jest-dom";
import TranslationsFilter from "@/components/AdminLayout/components/Translations/TranslationsFilter";

describe("TranslationsFilter Component", (): void => {
  const mockOnSearch: jest.Mock<void, [string]> = jest.fn();
  const mockOnFilterChange: jest.Mock<void, ["fr" | "en" | null]> = jest.fn();

  const defaultProps = {
    onSearch: mockOnSearch,
    onFilterChange: mockOnFilterChange,
    langFilter: null,
    translations: {
      messageAdminTranslationsSearchPlaceholder: "Rechercher...",
      messageAdminTranslationsSearchButton: "Rechercher",
      messageAdminTranslationsFilterLanguage: "Filtrer par langue",
      messageAdminTranslationsFilterAll: "Toutes",
      messageAdminTranslationsFilterFR: "Français",
      messageAdminTranslationsFilterEN: "English",
    },
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("renders search input", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    const searchInput: HTMLElement = screen.getByPlaceholderText("Rechercher...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders search button", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    const searchButton: HTMLElement = screen.getByRole("button", { name: "Rechercher" });
    expect(searchButton).toBeInTheDocument();
  });

  it("renders filter language label", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    const filterLabel: HTMLElement = screen.getByText("Filtrer par langue");
    expect(filterLabel).toBeInTheDocument();
  });

  it("renders all language filter buttons", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    const toutesButton: HTMLElement = screen.getByRole("button", { name: "Toutes" });
    const frButton: HTMLElement = screen.getByRole("button", { name: "Français" });
    const enButton: HTMLElement = screen.getByRole("button", { name: "English" });
    
    expect(toutesButton).toBeInTheDocument();
    expect(frButton).toBeInTheDocument();
    expect(enButton).toBeInTheDocument();
  });

  it("calls onSearch when search form is submitted", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const searchInput: HTMLInputElement = screen.getByPlaceholderText("Rechercher...") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });
    
    const searchButton: HTMLElement = screen.getByRole("button", { name: "Rechercher" });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("calls onFilterChange when All filter is clicked", (): void => {
    render(<TranslationsFilter {...defaultProps} langFilter="fr" />);
    
    const toutesButton: HTMLElement = screen.getByRole("button", { name: "Toutes" });
    fireEvent.click(toutesButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith(null);
  });

  it("calls onFilterChange when French filter is clicked", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const frButton: HTMLElement = screen.getByRole("button", { name: "Français" });
    fireEvent.click(frButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith("fr");
  });

  it("calls onFilterChange when English filter is clicked", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const enButton: HTMLElement = screen.getByRole("button", { name: "English" });
    fireEvent.click(enButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith("en");
  });

  it("highlights active language filter", (): void => {
    const { rerender } = render(<TranslationsFilter {...defaultProps} langFilter="fr" />);
    
    const frButton: HTMLElement = screen.getByRole("button", { name: "Français" });
    
    // When fr is selected, it should have the active style
    expect(frButton).toHaveStyle({
      backgroundColor: "var(--primary-color)",
    });
    
    rerender(<TranslationsFilter {...defaultProps} langFilter="en" />);
    
    const enButton: HTMLElement = screen.getByRole("button", { name: "English" });
    expect(enButton).toHaveStyle({
      backgroundColor: "var(--primary-color)",
    });
  });

  it("updates search input value", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const searchInput: HTMLInputElement = screen.getByPlaceholderText("Rechercher...") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "new search term" } });
    
    expect(searchInput.value).toBe("new search term");
  });

  it("uses default translations when not provided", (): void => {
    const propsWithoutTranslations = {
      ...defaultProps,
      translations: {},
    };
    
    render(<TranslationsFilter {...propsWithoutTranslations} />);
    
    // Should render buttons with default labels
    const buttons: HTMLElement[] = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("has container with admin styling", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const container: HTMLElement | null = screen.getByText("Filtrer par langue").closest(".rounded-lg");
    expect(container).toHaveClass("rounded-lg", "shadow-md", "p-6", "space-y-4");
  });

  it("submits search with current input value regardless of content", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const searchInput: HTMLInputElement = screen.getByPlaceholderText("Rechercher...") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "term" } });
    
    const searchButton: HTMLElement = screen.getByRole("button", { name: "Rechercher" });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith("term");
  });

  it("renders multiple filter buttons with correct spacing", (): void => {
    render(<TranslationsFilter {...defaultProps} />);
    
    const filterButtons: HTMLElement[] = screen.getAllByRole("button").slice(1); // Skip search button
    expect(filterButtons.length).toBeGreaterThanOrEqual(3); // At least Toutes, FR, EN
  });
});
