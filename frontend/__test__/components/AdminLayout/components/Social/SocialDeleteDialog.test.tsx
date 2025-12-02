import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import SocialDeleteDialog from "@/components/AdminLayout/components/Social/SocialDeleteDialog";
import {
  GetSocialsListQuery,
} from "@/types/graphql";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminSocialDeleteTitle: "Delete Social",
      messageAdminSocialDeleteDescription: "Are you sure you want to delete this social?",
      messageAdminSocialDeleteConfirm: "Confirm",
      messageAdminSocialDeleteCancel: "Cancel",
      messageAdminSocialDeleteSuccess: "Social deleted successfully",
      messageAdminSocialDeleteError: "Failed to delete social",
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

const mockDeleteSocialMutation: jest.Mock = jest.fn();
jest.mock("@/types/graphql", () => ({
  __esModule: true,
  useDeleteSocialMutation: jest.fn(() => [mockDeleteSocialMutation, {}]),
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

describe("SocialDeleteDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowAlert.mockClear();
    mockDeleteSocialMutation.mockClear();
  });

  test("should return null when socialId is null", () => {
    const { container } = render(
      <SocialDeleteDialog
        socialId={null}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("should render confirm dialog with correct title and description", () => {
    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(screen.getByTestId("dialog-title")).toHaveTextContent("Delete Social");
    expect(screen.getByTestId("dialog-description")).toHaveTextContent(
      "Are you sure you want to delete this social?"
    );
  });

  test("should render confirm and cancel buttons", () => {
    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(screen.getByTestId("confirm-button")).toHaveTextContent("Confirm");
    expect(screen.getByTestId("cancel-button")).toHaveTextContent("Cancel");
  });

  test("should call onCancel when cancel button is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={mockOnClose}
        onRefresh={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should call mutation when confirm button is clicked", async () => {
    mockDeleteSocialMutation.mockResolvedValue({
      data: {
        deleteSocial: {
          code: 200,
          message: "Deleted",
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockDeleteSocialMutation).toHaveBeenCalledWith({
        variables: { id: 1 },
      });
    });
  });

  test("should show success message on successful deletion", async () => {
    mockDeleteSocialMutation.mockResolvedValue({
      data: {
        deleteSocial: {
          code: 200,
          message: "Deleted",
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social deleted successfully");
    });
  });

  test("should show error message on failed deletion", async () => {
    mockDeleteSocialMutation.mockResolvedValue({
      data: {
        deleteSocial: {
          code: 400,
          message: "Error",
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to delete social");
    });
  });

  test("should call onClose after deletion", async () => {
    mockDeleteSocialMutation.mockResolvedValue({
      data: {
        deleteSocial: {
          code: 200,
        },
      },
    });

    const mockOnClose = jest.fn();
    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={mockOnClose}
        onRefresh={mockRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("should call refetch after successful deletion", async () => {
    mockDeleteSocialMutation.mockResolvedValue({
      data: {
        deleteSocial: {
          code: 200,
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
