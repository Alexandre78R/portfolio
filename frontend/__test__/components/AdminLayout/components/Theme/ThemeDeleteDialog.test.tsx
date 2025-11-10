import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeDeleteDialog from "@/components/AdminLayout/components/Theme/ThemeDeleteDialog";
import { useLang } from "@/context/Lang/LangContext";
import { useDeleteThemeMutation, GetThemesListQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import ConfirmDialog from "../../../../../src/components/AdminLayout/components/ConfirmDialog/ConfirmDialog";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminThemeDeleteTitle: "Delete Theme",
      messageAdminThemeDeleteDescription: "Are you sure you want to delete this theme?",
      messageAdminThemeDeleteConfirm: "Confirm",
      messageAdminThemeDeleteCancel: "Cancel",
      messageAdminThemeDeleteSuccess: "Theme deleted successfully",
      messageAdminThemeDeleteError: "Failed to delete theme",
    } as Lang,
  })),
}));

const mockShowAlert: jest.Mock = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showAlert: mockShowAlert,
  })),
}));

const mockDeleteThemeMutation: jest.Mock = jest.fn();
jest.mock("@/types/graphql", () => ({
  useDeleteThemeMutation: jest.fn(() => [mockDeleteThemeMutation, {}]),
}));

jest.mock("../../../../../src/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: jest.fn((props: any) => (
    <div data-testid="confirm-dialog">
      {props.title}
      {props.description}
      <button data-testid="confirm-button" onClick={props.onConfirm}>Confirm</button>
      <button data-testid="cancel-button" onClick={props.onCancel}>Cancel</button>
    </div>
  )),
}));

describe("ThemeDeleteDialog Component", (): void => {
  const mockOnClose: jest.Mock = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void | import('@apollo/client').ApolloQueryResult<GetThemesListQuery>>, []> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  test("renders nothing if themeId is null", (): void => {
    const { container } = render(
        <ThemeDeleteDialog themeId={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const dialog: HTMLElement | null = container.firstChild as HTMLElement | null;

    expect(dialog).toBeNull();
  });

  test("renders confirm dialog correctly", (): void => {
    render(
      <ThemeDeleteDialog themeId="1" onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmDialog: HTMLElement = screen.getByTestId("confirm-dialog");
    expect(confirmDialog).toBeInTheDocument();

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    const cancelButton: HTMLElement = screen.getByTestId("cancel-button");
    expect(confirmButton).toHaveTextContent("Confirm");
    expect(cancelButton).toHaveTextContent("Cancel");
  });

  test("calls delete mutation and handles success correctly", async (): Promise<void> => {
    mockDeleteThemeMutation.mockResolvedValue({
      data: { deleteTheme: { code: 200 } },
    });

    render(
      <ThemeDeleteDialog themeId="42" onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteThemeMutation).toHaveBeenCalledWith({ variables: { id: 42 } });
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Theme deleted successfully");
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls delete mutation and handles error code", async (): Promise<void> => {
    mockDeleteThemeMutation.mockResolvedValue({
      data: { deleteTheme: { code: 500 } },
    });

    render(
      <ThemeDeleteDialog themeId="42" onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteThemeMutation).toHaveBeenCalledWith({ variables: { id: 42 } });
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to delete theme");
      expect(mockOnRefresh).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles mutation throwing an exception", async (): Promise<void> => {
    mockDeleteThemeMutation.mockRejectedValue(new Error("Network error"));

    render(
      <ThemeDeleteDialog themeId="99" onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteThemeMutation).toHaveBeenCalledWith({ variables: { id: 99 } });
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to delete theme");
      expect(mockOnRefresh).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls onClose when cancel button is clicked", (): void => {
    render(
      <ThemeDeleteDialog themeId="5" onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const cancelButton: HTMLElement = screen.getByTestId("cancel-button");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});