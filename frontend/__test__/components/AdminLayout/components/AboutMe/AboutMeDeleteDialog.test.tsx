import React, { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMeDeleteDialog from "@/components/AdminLayout/components/AboutMe/AboutMeDeleteDialog";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import type { AlertType } from "@/components/ToastCustom/CustomToast";
import { DeleteAboutMeMutation } from "@/types/graphql";
import { FetchResult } from "@apollo/client";

type MockConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

jest.mock("@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: (props: MockConfirmDialogProps): ReactElement | null =>
    props.open ? (
      <div data-testid="confirm-dialog">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        <button data-testid="confirm" onClick={props.onConfirm}>
          {props.confirmLabel}
        </button>
        <button data-testid="cancel" onClick={props.onCancel}>
          {props.cancelLabel}
        </button>
      </div>
    ) : null,
}));

const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: (): { showAlert: typeof mockShowAlert } => ({
    showAlert: mockShowAlert,
  }),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn<LangContextType, []>(),
}));

const mockDeleteAboutMeMutation: jest.Mock<
  Promise<FetchResult<DeleteAboutMeMutation>>,
  [{ variables: { id: number } }]
> = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useDeleteAboutMeAdmin: jest.fn(() => [mockDeleteAboutMeMutation]),
}));

describe("AboutMeDeleteDialog", (): void => {
  const translationsMock: Lang = {
    messageAdminAboutMeDeleteTitle: "Delete About Me",
    messageAdminAboutMeDeleteDescription: "Confirm deletion",
    messageAdminAboutMeDeleteConfirm: "Delete",
    messageAdminAboutMeDeleteCancel: "Cancel",
    messageAdminAboutMeDeleteSuccess: "Deleted successfully",
    messageAdminAboutMeDeleteError: "Deletion failed",
  } as Lang;

  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(async (): Promise<void> => undefined);

  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
    (mockDeleteAboutMeMutation as jest.Mock).mockClear();
    
    const { useDeleteAboutMeAdmin } = require("@/utils/hooks");
    (useDeleteAboutMeAdmin as jest.Mock).mockReturnValue([mockDeleteAboutMeMutation]);
  });

  it("should not render when aboutMeId is null", (): void => {
    const { container } = render(
      <AboutMeDeleteDialog aboutMeId={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render dialog with correct translations when aboutMeId is provided", (): void => {
    render(
      <AboutMeDeleteDialog aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const titleElement: HTMLElement = screen.getByText("Delete About Me");
    const descriptionElement: HTMLElement = screen.getByText("Confirm deletion");
    const confirmButton: HTMLElement = screen.getByTestId("confirm");
    const cancelButton: HTMLElement = screen.getByTestId("cancel");

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent("Delete");
    expect(cancelButton).toHaveTextContent("Cancel");
  });

  it("should call onClose when cancel button is clicked", (): void => {
    render(
      <AboutMeDeleteDialog aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const cancelButton: HTMLElement = screen.getByTestId("cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call mutation with correct variables when confirm is clicked", async (): Promise<void> => {
    const testId: number = 42;
    mockDeleteAboutMeMutation.mockResolvedValueOnce({
      data: {
        deleteAboutMe: {
          code: 200,
          message: "Success",
        },
      },
    });

    render(
      <AboutMeDeleteDialog aboutMeId={testId} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockDeleteAboutMeMutation).toHaveBeenCalledTimes(1);
      expect(mockDeleteAboutMeMutation).toHaveBeenCalledWith({ id: testId });
    });
  });

  it("should call onRefresh and onClose on successful deletion", async (): Promise<void> => {
    mockDeleteAboutMeMutation.mockResolvedValueOnce({
      data: {
        deleteAboutMe: {
          code: 200,
          message: "Success",
        },
      },
    });

    render(
      <AboutMeDeleteDialog aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should show error toast when deletion fails with non-200 code", async (): Promise<void> => {
    mockDeleteAboutMeMutation.mockResolvedValueOnce({
      data: {
        deleteAboutMe: {
          code: 409,
          message: "Cannot delete visible item",
        },
      },
    });

    render(
      <AboutMeDeleteDialog aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Cannot delete visible item");
    });
  });

  it("should show error toast when mutation throws an error", async (): Promise<void> => {
    const mockError: Error = new Error("Network error");
    mockDeleteAboutMeMutation.mockRejectedValueOnce(mockError);

    render(
      <AboutMeDeleteDialog aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Deletion failed");
    });
  });
});
