import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExperienceDeleteDialog from "@/components/AdminLayout/components/Experience/ExperienceDeleteDialog";
import {
  GetExperiencesListQuery,
} from "@/types/graphql";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminExperienceDeleteTitle: "Delete Experience",
      messageAdminExperienceDeleteDescription: "Are you sure you want to delete this experience?",
      messageAdminExperienceDeleteConfirm: "Confirm",
      messageAdminExperienceDeleteCancel: "Cancel",
      messageAdminExperienceDeleteSuccess: "Experience deleted successfully",
      messageAdminExperienceDeleteError: "Failed to delete experience",
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

const mockDeleteExperienceMutation: jest.Mock = jest.fn();
jest.mock("@/types/graphql", () => ({
  __esModule: true,
  useDeleteExperienceMutation: jest.fn(() => [mockDeleteExperienceMutation, {}]),
}));

jest.mock("@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: jest.fn((props: any): ReactElement => (
    <div data-testid="confirm-dialog">
      <span data-testid="dialog-title">{props.title}</span>
      <span data-testid="dialog-description">{props.description}</span>
      <button data-testid="confirm-button" onClick={props.onConfirm}>
        {props.confirmLabel}
      </button>
      <button data-testid="cancel-button" onClick={props.onCancel}>
        {props.cancelLabel}
      </button>
    </div>
  )),
}));

describe("ExperienceDeleteDialog Component", (): void => {
  const mockOnClose: jest.Mock = jest.fn();
  const mockOnRefresh: jest.Mock<
    Promise<void | import("@apollo/client").ApolloQueryResult<GetExperiencesListQuery>>,
    []
  > = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  test("renders nothing if experienceId is null", (): void => {
    const { container } = render(
      <ExperienceDeleteDialog
        experienceId={null}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const dialog: HTMLElement | null = container.firstChild as HTMLElement | null;
    expect(dialog).toBeNull();
  });

  test("renders confirm dialog correctly when experienceId is provided", (): void => {
    render(
      <ExperienceDeleteDialog
        experienceId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmDialog: HTMLElement = screen.getByTestId("confirm-dialog");
    expect(confirmDialog).toBeInTheDocument();

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    const cancelButton: HTMLElement = screen.getByTestId("cancel-button");
    const title: HTMLElement = screen.getByTestId("dialog-title");
    const description: HTMLElement = screen.getByTestId("dialog-description");

    expect(confirmButton).toHaveTextContent("Confirm");
    expect(cancelButton).toHaveTextContent("Cancel");
    expect(title).toHaveTextContent("Delete Experience");
    expect(description).toHaveTextContent(
      "Are you sure you want to delete this experience?"
    );
  });

  test("calls delete mutation and handles success correctly", async (): Promise<void> => {
    mockDeleteExperienceMutation.mockResolvedValue({
      data: { deleteExperience: { code: 200 } },
    });
    mockOnRefresh.mockResolvedValue(undefined);

    render(
      <ExperienceDeleteDialog
        experienceId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteExperienceMutation).toHaveBeenCalledWith({
        variables: { id: 42 },
      });
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Experience deleted successfully"
      );
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls delete mutation and handles non-200 code as error", async (): Promise<void> => {
    mockDeleteExperienceMutation.mockResolvedValue({
      data: { deleteExperience: { code: 500 } },
    });

    render(
      <ExperienceDeleteDialog
        experienceId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteExperienceMutation).toHaveBeenCalledWith({
        variables: { id: 42 },
      });
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        "Failed to delete experience"
      );
      expect(mockOnRefresh).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles mutation throwing an exception", async (): Promise<void> => {
    mockDeleteExperienceMutation.mockRejectedValue(new Error("Network error"));

    render(
      <ExperienceDeleteDialog
        experienceId={99}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteExperienceMutation).toHaveBeenCalledWith({
        variables: { id: 99 },
      });
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        "Failed to delete experience"
      );
      expect(mockOnRefresh).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls onClose when cancel button is clicked", (): void => {
    render(
      <ExperienceDeleteDialog
        experienceId={5}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const cancelButton: HTMLElement = screen.getByTestId("cancel-button");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
