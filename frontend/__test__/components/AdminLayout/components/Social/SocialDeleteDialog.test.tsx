import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@test-utils";
import "@testing-library/jest-dom";

import SocialDeleteDialog from "@/components/AdminLayout/components/Social/SocialDeleteDialog";
import {
  DeleteSocialDocument,
  DeleteSocialMutation,
  DeleteSocialMutationVariables,
} from "@/types/graphql";
import type { MockedResponse } from "@apollo/client/testing";
import Lang from "@/lang/typeLang";

type AlertType = "success" | "error";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface MutationResult {
  code?: number;
  message?: string;
}

type RefreshHandler = () => Promise<void>;
type CloseHandler = () => void;

const translationsMock = {
  messageAdminSocialDeleteTitle: "Delete Social",
  messageAdminSocialDeleteDescription: "Are you sure you want to delete this social?",
  messageAdminSocialDeleteConfirm: "Confirm",
  messageAdminSocialDeleteCancel: "Cancel",
  messageAdminSocialDeleteSuccess: "Social deleted successfully",
  messageAdminSocialDeleteError: "Failed to delete social",
} as Lang;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: translationsMock,
  })),
}));

const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showAlert: mockShowAlert,
  })),
}));

jest.mock("@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: jest.fn((props: ConfirmDialogProps): ReactElement => (
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

const createMocks = (
  mutationResult: MutationResult = { code: 200, message: "Deleted" }
): MockedResponse<DeleteSocialMutation, DeleteSocialMutationVariables>[] => [
  {
    request: {
      query: DeleteSocialDocument,
      variables: {
        id: 1,
      },
    },
    result: {
      data: {
        deleteSocial: {
          __typename: "SocialResponse",
          code: mutationResult.code ?? 200,
          message: mutationResult.message ?? "Deleted",
        },
      },
    },
  },
];

describe("SocialDeleteDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowAlert.mockClear();
  });

  test("should return null when socialId is null", () => {
    const { container }: ReturnType<typeof render> = render(
      <SocialDeleteDialog
        socialId={null}
        onClose={jest.fn() as CloseHandler}
        onRefresh={jest.fn() as RefreshHandler}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("should render the confirm dialog title and description", () => {
    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn() as CloseHandler}
        onRefresh={jest.fn() as RefreshHandler}
      />,
      { mocks: createMocks() }
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
        onClose={jest.fn() as CloseHandler}
        onRefresh={jest.fn() as RefreshHandler}
      />,
      { mocks: createMocks() }
    );

    expect(screen.getByTestId("confirm-button")).toHaveTextContent("Confirm");
    expect(screen.getByTestId("cancel-button")).toHaveTextContent("Cancel");
  });

  test("should call onClose when cancel button is clicked", () => {
    const mockOnClose: jest.Mock<void, []> = jest.fn();
    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={mockOnClose}
        onRefresh={jest.fn() as RefreshHandler}
      />,
      { mocks: createMocks() }
    );

    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should show a success message on successful deletion", async () => {
    const mockRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn() as CloseHandler}
        onRefresh={mockRefresh}
      />,
      { mocks: createMocks({ code: 200, message: "Deleted" }) }
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social deleted successfully");
    });
  });

  test("should show an error message on failed deletion", async () => {
    const mockRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn() as CloseHandler}
        onRefresh={mockRefresh}
      />,
      { mocks: createMocks({ code: 400, message: "Error" }) }
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to delete social");
    });
  });

  test("should call onClose after deletion", async () => {
    const mockOnClose: jest.Mock<void, []> = jest.fn();
    const mockRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={mockOnClose}
        onRefresh={mockRefresh}
      />,
      { mocks: createMocks({ code: 200 }) }
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("should call onRefresh after successful deletion", async () => {
    const mockRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialDeleteDialog
        socialId={1}
        onClose={jest.fn() as CloseHandler}
        onRefresh={mockRefresh}
      />,
      { mocks: createMocks({ code: 200 }) }
    );

    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
