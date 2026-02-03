import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@test-utils';
import "@testing-library/jest-dom";

import EducationDeleteDialog from "@/components/AdminLayout/components/Education/EducationDeleteDialog";
import { DeleteEducationMutation } from "@/types/graphql";
import Lang from "@/lang/typeLang";
import { FetchResult } from "@apollo/client";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminEducationDeleteTitle: "Delete Education",
      messageAdminEducationDeleteDescription: "Are you sure you want to delete this education?",
      messageAdminEducationDeleteConfirm: "Confirm",
      messageAdminEducationDeleteCancel: "Cancel",
      messageAdminEducationDeleteSuccess: "Education deleted successfully",
      messageAdminEducationDeleteError: "Failed to delete education",
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

jest.mock("@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: jest.fn((props: any): ReactElement => (
    <div data-testid="confirm-dialog">
      <span data-testid="dialog-title">{props.title}</span>
      <span data-testid="dialog-description">{props.description}</span>
      <button 
        data-testid="confirm-button" 
        onClick={props.onConfirm}
        disabled={props.confirmDisabled}
      >
        {props.confirmLabel}
      </button>
      <button data-testid="cancel-button" onClick={props.onCancel}>
        {props.cancelLabel}
      </button>
    </div>
  )),
}));

const mockDeleteEducationMutation: jest.Mock<
  Promise<FetchResult<DeleteEducationMutation>>,
  [{ variables: { id: number } }]
> = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useDeleteEducationAdmin: jest.fn<[typeof mockDeleteEducationMutation], []>(),
}));

describe("EducationDeleteDialog Component", (): void => {
  const mockOnClose: jest.Mock = jest.fn();
  const mockOnRefresh: jest.Mock<
    Promise<void>,
    []
  > = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    (mockDeleteEducationMutation as jest.Mock).mockClear();
    
    const { useDeleteEducationAdmin } = require("@/utils/hooks");
    (useDeleteEducationAdmin as jest.Mock).mockReturnValue([mockDeleteEducationMutation]);
  });

  test("renders nothing if educationId is null", (): void => {
    const { container } = render(
      <EducationDeleteDialog
        educationId={null}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const dialog: HTMLElement | null = container.firstChild as HTMLElement | null;
    expect(dialog).toBeNull();
  });

  test("renders confirm dialog correctly when educationId is provided", (): void => {
    render(
      <EducationDeleteDialog
        educationId={42}
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
    expect(title).toHaveTextContent("Delete Education");
    expect(description).toHaveTextContent(
      "Are you sure you want to delete this education?"
    );
  });

  test("calls delete mutation and handles success correctly", async (): Promise<void> => {
    mockDeleteEducationMutation.mockResolvedValueOnce({
      data: {
        deleteEducation: {
          code: 200,
          message: "Success",
        },
      },
    });

    render(
      <EducationDeleteDialog
        educationId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Education deleted successfully"
      );
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls delete mutation and handles non-200 code as error", async (): Promise<void> => {
    mockDeleteEducationMutation.mockResolvedValueOnce({
      data: {
        deleteEducation: {
          code: 500,
          message: "Error",
        },
      },
    });

    render(
      <EducationDeleteDialog
        educationId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        "Failed to delete education"
      );
      expect(mockOnRefresh).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls onClose when cancel button is clicked", (): void => {
    render(
      <EducationDeleteDialog
        educationId={5}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const cancelButton: HTMLElement = screen.getByTestId("cancel-button");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
