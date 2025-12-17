import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkillDeleteDialog from "@/components/AdminLayout/components/Skill/SkillDeleteDialog";
import Lang from "@/lang/typeLang";
import { useLang } from "@/context/Lang/LangContext";
import { useDeleteSkillMutation } from "@/types/graphql";
// import { SubItemResponse } from "@/types/graphql";
interface DeleteSkillResponse {
  data: {
    deleteSkill: {
      code: number;
      message?: string;
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

const mockDeleteSkillMutation: jest.Mock<Promise<DeleteSkillResponse>, [any]> =
  jest.fn();

jest.mock("@/types/graphql", (): object => ({
  useDeleteSkillMutation: jest.fn(),
}));

const mockTranslations: Lang = {
  messageAdminSkillDeleteTitle: "Delete Skill",
  messageAdminSkillDeleteDescription: "Are you sure?",
  messageAdminSkillDeleteConfirm: "Delete",
  messageAdminSkillDeleteCancel: "Cancel",
  messageAdminSkillDeleteSuccess: "Deleted",
  messageAdminSkillDeleteError: "Error",
} as Lang;

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn(),
}));

function getButton(testId: string): HTMLButtonElement {
  const element: HTMLElement | null = screen.queryByTestId(testId);
  if (!element || !(element instanceof HTMLButtonElement)) {
    throw new Error(`Button with testId '${testId}' not found`);
  }
  return element;
}

describe("SkillDeleteDialog", (): void => {
  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(
    async (): Promise<void> => undefined
  );

  beforeEach((): void => {
    jest.clearAllMocks();
    const mockedUseLang: jest.MockedFunction<() => LangContextType> =
      useLang as unknown as jest.MockedFunction<() => LangContextType>;
    mockedUseLang.mockReturnValue({
      translations: mockTranslations as unknown as Lang,
    });
    mockDeleteSkillMutation.mockResolvedValue({
      data: { deleteSkill: { code: 200 } },
    });
    (useDeleteSkillMutation as jest.Mock).mockReturnValue([
      mockDeleteSkillMutation,
    ]);
  });

  it("should not render when skillId is null", (): void => {
    const { container }: { container: HTMLElement } = render(
      <SkillDeleteDialog
        skillId={null}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render dialog when skillId is provided", (): void => {
    render(
      <SkillDeleteDialog
        skillId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
  });

  it("should display title and description", (): void => {
    render(
      <SkillDeleteDialog
        skillId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText("Delete Skill")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("should call onClose when cancel button clicked", (): void => {
    render(
      <SkillDeleteDialog
        skillId={1}
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
      <SkillDeleteDialog
        skillId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLButtonElement = getButton("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockDeleteSkillMutation).toHaveBeenCalled();
    });
  });

  it("should call onRefresh after successful deletion", async (): Promise<void> => {
    render(
      <SkillDeleteDialog
        skillId={1}
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

  it("should handle delete errors gracefully", async (): Promise<void> => {
    mockDeleteSkillMutation.mockResolvedValueOnce({
      data: { deleteSkill: { code: 400, message: "Error" } },
    });

    render(
      <SkillDeleteDialog
        skillId={1}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const confirmBtn: HTMLButtonElement = getButton("confirm-btn");
    fireEvent.click(confirmBtn);

    await waitFor((): void => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
