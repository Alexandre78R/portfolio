import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectDeleteDialog from "@/components/AdminLayout/components/Project/ProjectDeleteDialog";
import Lang from "@/lang/typeLang";
import { DeleteProjectMutation } from "@/types/graphql";
import { FetchResult } from "@apollo/client";

jest.mock("@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", (): object => ({
  __esModule: true,
  default: (props: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmDisabled?: boolean;
  }): React.ReactElement => (
    <div data-testid="confirm-dialog">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <button data-testid="confirm-btn" onClick={props.onConfirm} disabled={props.confirmDisabled}>
        {props.confirmLabel}
      </button>
      <button data-testid="cancel-btn" onClick={props.onCancel}>
        {props.cancelLabel}
      </button>
    </div>
  ),
}));

jest.mock("@/components/ToastCustom/CustomToast", (): object => ({
  __esModule: true,
  default: (): object => ({
    showAlert: jest.fn(),
  }),
}));

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminProjectDeleteTitle: "Delete Project",
      messageAdminProjectDeleteDescription: "Are you sure?",
      messageAdminProjectDeleteConfirm: "Delete",
      messageAdminProjectDeleteCancel: "Cancel",
      messageAdminProjectDeleteSuccess: "Deleted",
      messageAdminProjectDeleteError: "Error",
    } as unknown as Lang,
  })),
}));

const mockDeleteProjectMutation: jest.Mock<
  Promise<FetchResult<DeleteProjectMutation>>,
  [{ variables: { id: number } }]
> = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useDeleteProjectAdmin: jest.fn<[typeof mockDeleteProjectMutation], []>(),
}));

describe("ProjectDeleteDialog", (): void => {
  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(async () => undefined);

  beforeEach((): void => {
    jest.clearAllMocks();
    mockDeleteProjectMutation.mockClear();
    mockDeleteProjectMutation.mockResolvedValue({
      data: { deleteProject: { code: 200, message: "Deleted" } },
    });
    
    const { useDeleteProjectAdmin } = require("@/utils/hooks");
    (useDeleteProjectAdmin as jest.Mock).mockReturnValue([mockDeleteProjectMutation]);
  });

  it("should not render when projectId is null", (): void => {
    const { container }: { container: HTMLElement } = render(
      <ProjectDeleteDialog
        projectId={null}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render dialog when projectId is provided", (): void => {
    render(
      <ProjectDeleteDialog
        projectId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
  });

  it("should display title and description", (): void => {
    render(
      <ProjectDeleteDialog
        projectId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText("Delete Project")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("should call onClose when cancel button clicked", (): void => {
    render(
      <ProjectDeleteDialog
        projectId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const cancelBtn: HTMLElement = screen.getByTestId("cancel-btn");
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call mutation on confirm", async (): Promise<void> => {
    render(
      <ProjectDeleteDialog
        projectId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLElement = screen.getByTestId("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockDeleteProjectMutation).toHaveBeenCalled();
    });
  });

  it("should call onRefresh after successful deletion", async (): Promise<void> => {
    render(
      <ProjectDeleteDialog
        projectId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLElement = screen.getByTestId("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it("should handle delete errors gracefully", async (): Promise<void> => {
    mockDeleteProjectMutation.mockResolvedValueOnce({
      data: { deleteProject: { code: 400, message: "Error" } },
    });

    render(
      <ProjectDeleteDialog
        projectId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLElement = screen.getByTestId("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
