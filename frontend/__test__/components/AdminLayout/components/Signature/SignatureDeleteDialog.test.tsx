import React from "react";
import { render, screen, fireEvent, waitFor } from "@test-utils";
import "@testing-library/jest-dom";
import { useMutation } from "@apollo/client";

import SignatureDeleteDialog from "@/components/AdminLayout/components/Signature/SignatureDeleteDialog";
import type { SignatureRow } from "@/components/AdminLayout/components/Signature/SignatureTable";
import type Lang from "@/lang/typeLang";
import type { AlertType } from "@/components/ToastCustom/CustomToast";

interface MockContextValue {
  translations: Lang;
}

const translationsMock: Lang = {
  messageAdminSignatureListTitle: "Signatures",
  messageAdminSignatureListNotFound: "No signatures found",
  messageAdminSignatureCreateTitle: "Create Signature",
  messageAdminSignatureInputName: "Name",
  messageAdminSignatureInputDescription: "Description",
  messageAdminSignatureButtonCreate: "Create",
  messageAdminSignatureCreateSuccess: "Created successfully",
  messageAdminSignatureCreateError: "Creation failed",
  messageAdminSignatureColumnName: "Name",
  messageAdminSignatureColumnDescription: "Description",
  messageAdminSignatureColumnAction: "Action",
  messageAdminSignatureEditTitle: "Edit Signature",
  messageAdminSignatureEditSuccess: "Updated successfully",
  messageAdminSignatureEditError: "Update failed",
  messageAdminSignatureDeleteTitle: "Delete Signature",
  messageAdminSignatureDeleteDescription: "Are you sure you want to delete this signature?",
  messageAdminSignatureDeleteConfirm: "Delete",
  messageAdminSignatureDeleteCancel: "Cancel",
  messageAdminSignatureDeleteSuccess: "Deleted successfully",
  messageAdminSignatureDeleteError: "Delete failed",
} as Lang;

const mockSignatureData: SignatureRow = {
  id: 1,
  name: "Test Signature",
  description: "Test Description",
};

const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useMutation: jest.fn(),
  };
});

jest.mock("@/context/Lang/LangContext", () => {
  return {
    useLang: jest.fn((): MockContextValue => ({
      translations: translationsMock,
    })),
  };
});

jest.mock("@/components/ToastCustom/CustomToast", () => {
  return {
    __esModule: true,
    default: jest.fn((): { showAlert: jest.Mock } => ({
      showAlert: mockShowAlert,
    })),
  };
});

describe("SignatureDeleteDialog", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();

    (useMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          deleteSignature: {
            code: 200,
            message: "Deleted successfully",
          },
        },
      }),
      { loading: false, error: null, data: null },
    ]);
  });

  it("should return null element when signature is null", (): void => {
    const { container } = render(
      <SignatureDeleteDialog
        signatureId={null}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render dialog title when signature is provided", (): void => {
    render(
      <SignatureDeleteDialog
        signatureId={mockSignatureData.id}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(
      screen.getByText(translationsMock.messageAdminSignatureDeleteTitle)
    ).toBeInTheDocument();
  });

  it("should render dialog description", (): void => {
    render(
      <SignatureDeleteDialog
        signatureId={mockSignatureData.id}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(
      screen.getByText(translationsMock.messageAdminSignatureDeleteDescription)
    ).toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", (): void => {
    const onCloseMock: jest.Mock<void, []> = jest.fn();

    render(
      <SignatureDeleteDialog
        signatureId={mockSignatureData.id}
        onClose={onCloseMock}
        onRefresh={jest.fn()}
      />
    );

    const cancelButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureDeleteCancel);
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should show success toast after deletion", async (): Promise<void> => {
    render(
      <SignatureDeleteDialog
        signatureId={mockSignatureData.id}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    const deleteButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureDeleteConfirm);
    fireEvent.click(deleteButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messageAdminSignatureDeleteSuccess
      );
    });
  });

  it("should show error toast on deletion failure", async (): Promise<void> => {
    (useMutation as jest.Mock).mockReturnValueOnce([
      jest.fn().mockRejectedValue(new Error("Delete failed")),
      { loading: false, error: null, data: null },
    ]);

    render(
      <SignatureDeleteDialog
        signatureId={mockSignatureData.id}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    const deleteButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureDeleteConfirm);
    fireEvent.click(deleteButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translationsMock.messageAdminSignatureDeleteError
      );
    });
  });

  it("should call onRefresh and onClose after successful deletion", async (): Promise<void> => {
    const onRefreshMock: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);
    const onCloseMock: jest.Mock<void, []> = jest.fn();

    render(
      <SignatureDeleteDialog
        signatureId={mockSignatureData.id}
        onClose={onCloseMock}
        onRefresh={onRefreshMock}
      />
    );

    const deleteButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureDeleteConfirm);
    fireEvent.click(deleteButton);

    await waitFor((): void => {
      expect(onRefreshMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
