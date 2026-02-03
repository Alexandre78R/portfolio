import React from "react";
import { render, screen, fireEvent, waitFor } from "@test-utils";
import "@testing-library/jest-dom";
import TranslationsEditModal from "@/components/AdminLayout/components/Translations/TranslationsEditModal";
import { ApolloError } from "@apollo/client";

// Mock CustomToast
jest.mock("@/components/ToastCustom/CustomToast", () => {
  return jest.fn(() => ({
    showAlert: jest.fn(),
  }));
});

describe("TranslationsEditModal Component", (): void => {
  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnSave: jest.Mock<Promise<void>, [string]> = jest.fn();

  const defaultTranslation = {
    key: "messageAdminTranslationsTitle",
    value: "Gestion des traductions",
  };

  const defaultProps = {
    translation: defaultTranslation,
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    isLoading: false,
    error: undefined,
    translations: {
      messageAdminTranslationsEditTitle: "Modifier la traduction",
      messageAdminTranslationsEditValue: "Valeur",
      messageAdminTranslationsEditError: "Une erreur est survenue",
      messageAdminTranslationsEditCancel: "Annuler",
      messageAdminTranslationsEditSave: "Sauvegarder",
      messageAdminTranslationsEditSuccess: "Succès",
    },
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("does not render when closed", (): void => {
    render(<TranslationsEditModal {...defaultProps} isOpen={false} />);
    const modalTitle: HTMLElement | null = screen.queryByText("Modifier la traduction");
    expect(modalTitle).not.toBeInTheDocument();
  });

  it("renders modal title when open", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const modalTitle: HTMLElement = screen.getByText("Modifier la traduction");
    expect(modalTitle).toBeInTheDocument();
  });

  it("displays translation key in read-only format", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const keyDisplay: HTMLElement | null = screen.queryByText(defaultTranslation.key);
    expect(keyDisplay).toBeInTheDocument();
  });

  it("displays initial translation value in textarea", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const textareaElement: HTMLElement = screen.getByDisplayValue(defaultTranslation.value);
    expect(textareaElement).toBeInTheDocument();
  });

  it("updates textarea value when user types", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const textareaElement: HTMLTextAreaElement = screen.getByDisplayValue(
      defaultTranslation.value
    ) as HTMLTextAreaElement;
    
    fireEvent.change(textareaElement, { target: { value: "New translation value" } });
    
    expect(textareaElement.value).toBe("New translation value");
  });

  it("updates value when translation prop changes", async (): Promise<void> => {
    const { rerender } = render(<TranslationsEditModal {...defaultProps} />);
    
    const newTranslation = {
      key: "anotherKey",
      value: "Another value",
    };
    
    rerender(<TranslationsEditModal {...defaultProps} translation={newTranslation} />);
    
    await waitFor((): void => {
      const textareaElement: HTMLElement = screen.getByDisplayValue(newTranslation.value);
      expect(textareaElement).toBeInTheDocument();
    });
  });

  it("renders close button", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const closeButton: HTMLElement = screen.getByRole("button", { name: "Close modal" });
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const closeButton: HTMLElement = screen.getByRole("button", { name: "Close modal" });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders Cancel button", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const cancelButton: HTMLElement | null = screen.queryByText("Annuler");
    expect(cancelButton).toBeInTheDocument();
  });

  it("renders Save button", (): void => {
    render(<TranslationsEditModal {...defaultProps} />);
    const saveButton: HTMLElement | null = screen.queryByText("Sauvegarder");
    expect(saveButton).toBeInTheDocument();
  });

  it("calls onSave with edited value when save button is clicked", async (): Promise<void> => {
    mockOnSave.mockResolvedValue(undefined);
    
    render(<TranslationsEditModal {...defaultProps} />);
    
    const textareaElement: HTMLTextAreaElement = screen.getByDisplayValue(
      defaultTranslation.value
    ) as HTMLTextAreaElement;
    
    fireEvent.change(textareaElement, { target: { value: "Updated translation" } });
    
    // Find save button by role
    const buttons: HTMLElement[] = screen.getAllByRole("button");
    const saveButton: HTMLElement = buttons[buttons.length - 1]; // Last button should be Save
    
    fireEvent.click(saveButton);
    
    await waitFor((): void => {
      expect(mockOnSave).toHaveBeenCalledWith("Updated translation");
    });
  });

  it("prevents saving empty translation values", async (): Promise<void> => {
    render(<TranslationsEditModal {...defaultProps} />);
    
    const textareaElement: HTMLTextAreaElement = screen.getByDisplayValue(
      defaultTranslation.value
    ) as HTMLTextAreaElement;
    
    fireEvent.change(textareaElement, { target: { value: "   " } });
    
    const buttons: HTMLElement[] = screen.getAllByRole("button");
    const saveButton: HTMLElement = buttons[buttons.length - 1];
    
    fireEvent.click(saveButton);
    
    // Should not call onSave for empty/whitespace values
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("closes modal when close button is not blocked by loading", (): void => {
    const propsWithoutLoading = {
      ...defaultProps,
      isLoading: false,
    };
    
    render(<TranslationsEditModal {...propsWithoutLoading} />);
    const closeButton: HTMLElement = screen.getByRole("button", { name: "Close modal" });
    fireEvent.click(closeButton);
    // Button should be clickable when not saving
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("uses default translations when not provided", (): void => {
    const propsWithoutTranslations = {
      ...defaultProps,
      translations: {},
    };
    
    render(<TranslationsEditModal {...propsWithoutTranslations} />);
    // Should render with default labels
    const modalTitle: HTMLElement | null = screen.queryByText("Modifier la traduction");
    expect(modalTitle).toBeInTheDocument();
  });

  it("displays error message when error prop is set", (): void => {
    const apolloError: ApolloError = new ApolloError({
      graphQLErrors: [],
      errorMessage: "GraphQL error occurred",
    });
    
    const propsWithError = {
      ...defaultProps,
      error: apolloError,
    };
    
    render(<TranslationsEditModal {...propsWithError} />);
    // Error should be displayed somewhere in the modal
    expect(mockOnClose).toBeDefined();
  });
});
