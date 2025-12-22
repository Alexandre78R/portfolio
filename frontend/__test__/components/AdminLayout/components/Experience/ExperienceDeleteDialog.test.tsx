import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@test-utils';
import "@testing-library/jest-dom";
import ExperienceDeleteDialog from "@/components/AdminLayout/components/Experience/ExperienceDeleteDialog";
import {
  type GetExperiencesListQuery,
  DeleteExperienceDocument,
} from "@/types/graphql";
import type Lang from "@/lang/typeLang";

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

const createMocks = (mutationResult: any = { code: 200 }) => [
  {
    request: {
      query: DeleteExperienceDocument,
      variables: {
        id: 42,
      },
    },
    result: {
      data: {
        deleteExperience: mutationResult,
      },
    },
  },
];

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
      />,
      { mocks: createMocks() }
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
    mockOnRefresh.mockResolvedValue(undefined);

    render(
      <ExperienceDeleteDialog
        experienceId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />,
      { mocks: createMocks({ code: 200 }) }
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Experience deleted successfully"
      );
      expect(mockOnRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls delete mutation and handles non-200 code as error", async (): Promise<void> => {
    render(
      <ExperienceDeleteDialog
        experienceId={42}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />,
      { mocks: createMocks({ code: 500 }) }
    );

    const confirmButton: HTMLElement = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);

    await waitFor((): void => {
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
      />,
      { mocks: createMocks() }
    );

    const cancelButton: HTMLElement = screen.getByTestId("cancel-button");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
