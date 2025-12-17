import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkillCategoryDeleteDialog from "@/components/AdminLayout/components/SkillCategory/SkillCategoryDeleteDialog";
import Lang from "@/lang/typeLang";
import { useDeleteSkillCategoryMutation } from "@/types/graphql";

interface DeleteCategoryResponse {
  data: {
    deleteCategory: {
      code: number;
      message: string;
    };
  };
}

interface LangContextType {
  translations: Lang;
}

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
  }): ReactElement => (
    <div data-testid="confirm-dialog">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <button
        data-testid="confirm-btn"
        onClick={props.onConfirm}
        disabled={props.confirmDisabled}
      >
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

const mockDeleteCategoryMutation: jest.Mock<
  Promise<DeleteCategoryResponse>,
  [any]
> = jest.fn();

jest.mock("@/types/graphql", (): object => ({
  useDeleteSkillCategoryMutation: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn((): LangContextType => ({
    translations: {
      messageAdminSkillCategoryDeleteTitle: "Delete Category",
      messageAdminSkillCategoryDeleteDescription: "Are you sure?",
      messageAdminSkillCategoryDeleteConfirm: "Delete",
      messageAdminSkillCategoryDeleteCancel: "Cancel",
      messageAdminSkillCategoryDeleteSuccess: "Deleted",
      messageAdminSkillCategoryDeleteError: "Error",
    } as unknown as Lang,
  })),
}));

function getButton(testId: string): HTMLButtonElement {
  const element: HTMLElement | null = screen.queryByTestId(testId);
  if (!element || !(element instanceof HTMLButtonElement)) {
    throw new Error(`Button with testId '${testId}' not found`);
  }
  return element;
}

describe("SkillCategoryDeleteDialog", (): void => {
  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(
    async (): Promise<void> => undefined
  );

  beforeEach((): void => {
    jest.clearAllMocks();
    mockDeleteCategoryMutation.mockResolvedValue({
      data: { deleteCategory: { code: 200, message: "Deleted" } },
    });
    (useDeleteSkillCategoryMutation as jest.Mock).mockReturnValue([
      mockDeleteCategoryMutation,
    ]);
  });

  it("should not render when categoryId is null", (): void => {
    const { container }: { container: HTMLElement } = render(
      <SkillCategoryDeleteDialog
        categoryId={null}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render dialog when categoryId is provided", (): void => {
    render(
      <SkillCategoryDeleteDialog
        categoryId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
  });

  it("should call onClose when cancel button clicked", (): void => {
    render(
      <SkillCategoryDeleteDialog
        categoryId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const cancelBtn: HTMLButtonElement = getButton("cancel-btn");
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call mutation on confirm", async (): Promise<void> => {
    render(
      <SkillCategoryDeleteDialog
        categoryId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLButtonElement = getButton("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockDeleteCategoryMutation).toHaveBeenCalled();
    });
  });

  it("should call onRefresh after successful deletion", async (): Promise<void> => {
    render(
      <SkillCategoryDeleteDialog
        categoryId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLButtonElement = getButton("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });
});
