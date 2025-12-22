import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@test-utils';
import "@testing-library/jest-dom";
import UserDeleteDialog from "@/components/AdminLayout/components/User/UserDeleteDialog";
import { useLang } from "@/context/Lang/LangContext";
import { DeleteUserDocument } from "@/types/graphql";
import type Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

const mockShowAlert: jest.Mock<(type: "success" | "error", message: string) => void> = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

jest.mock(
  "@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog",
  () => ({
    __esModule: true,
    default: jest.fn(
      (props: {
        open: boolean;
        title: string;
        description: string;
        confirmLabel: string;
        cancelLabel: string;
        onConfirm: () => void;
        onCancel: () => void;
        confirmDisabled?: boolean;
      }): ReactElement => (
        <div data-testid="confirm-dialog">
          <button data-testid="confirm-button" onClick={props.onConfirm}>
            {props.confirmLabel}
          </button>
          <button data-testid="cancel-button" onClick={props.onCancel}>
            {props.cancelLabel}
          </button>
          <span data-testid="dialog-title">{props.title}</span>
          <span data-testid="dialog-description">{props.description}</span>
        </div>
      )
    ),
  })
);

const createMocks = (mutationResult: any = { code: 200 }) => [
  {
    request: {
      query: DeleteUserDocument,
      variables: {
        id: 1,
      },
    },
    result: {
      data: {
        deleteUser: mutationResult,
      },
    },
  },
];

describe("UserDeleteDialog Component", (): void => {
  const mockOnClose: jest.Mock<() => void> = jest.fn();
  const mockOnRefresh: jest.Mock<
    Promise<void>,
    []
  > = jest.fn().mockResolvedValue(undefined);

  const translations: Lang = {
    messageAdminUserDeleteTitle: "Delete User",
    messageAdminUserDeleteDescription: "Are you sure you want to delete this user?",
    messageAdminUserDeleteConfirm: "Delete",
    messageAdminUserDeleteCancel: "Cancel",
    messageAdminUserDeleteSuccess: "User deleted successfully",
    messageAdminUserDeleteError: "Failed to delete user",
  } as Lang;

  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations });
  });

  test("renders null if userId is null", (): void => {
    const { container } = render(
      <UserDeleteDialog userId={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders ConfirmDialog with correct texts", (): void => {
    render(<UserDeleteDialog userId="1" onClose={mockOnClose} onRefresh={mockOnRefresh} />, { mocks: createMocks() });

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      translations.messageAdminUserDeleteTitle
    );
    expect(screen.getByTestId("dialog-description")).toHaveTextContent(
      translations.messageAdminUserDeleteDescription
    );
    expect(screen.getByTestId("confirm-button")).toHaveTextContent(
      translations.messageAdminUserDeleteConfirm
    );
    expect(screen.getByTestId("cancel-button")).toHaveTextContent(
      translations.messageAdminUserDeleteCancel
    );
  });

  test("calls deleteUserMutation and shows success toast on confirm", async (): Promise<void> => {
    render(<UserDeleteDialog userId="1" onClose={mockOnClose} onRefresh={mockOnRefresh} />, { mocks: createMocks({ code: 200 }) });
    const confirmButton: HTMLButtonElement = screen.getByTestId("confirm-button") as HTMLButtonElement;
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translations.messageAdminUserDeleteSuccess
      );
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("shows error toast if server returns error", async (): Promise<void> => {
    render(<UserDeleteDialog userId="1" onClose={mockOnClose} onRefresh={mockOnRefresh} />, { mocks: createMocks({ code: 500 }) });
    const confirmButton: HTMLButtonElement = screen.getByTestId("confirm-button") as HTMLButtonElement;
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        translations.messageAdminUserDeleteError
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls onClose when cancel button is clicked", (): void => {
    render(<UserDeleteDialog userId="1" onClose={mockOnClose} onRefresh={mockOnRefresh} />, { mocks: createMocks() });
    const cancelButton: HTMLButtonElement = screen.getByTestId("cancel-button") as HTMLButtonElement;
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
