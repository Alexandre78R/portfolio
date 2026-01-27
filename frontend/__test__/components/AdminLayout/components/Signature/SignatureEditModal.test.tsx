import React from "react";
import { render, screen, fireEvent, waitFor } from "@test-utils";
import "@testing-library/jest-dom";
import { useMutation, useQuery } from "@apollo/client";

import SignatureEditModal from "@/components/AdminLayout/components/Signature/SignatureEditModal";
import type { SignatureRow } from "@/components/AdminLayout/components/Signature/SignatureTable";
import type Lang from "@/lang/typeLang";
import type { AlertType } from "@/components/ToastCustom/CustomToast";

interface MockContextValue {
  translations: Lang;
}

interface SignatureQueryData {
  getSignatureById?: {
    signature?: {
      id: string;
      name: string;
      description: string;
    };
  };
}

const translationsMock: Lang = {
  messageAdminSignatureListTitle: "Signatures",
  messageAdminSignatureListNotFound: "No signatures found",
  messageAdminSignatureCreateTitle: "Create Signature",
  messageAdminSignatureInputName: "Name",
  messageAdminSignatureInputDescription: "Description",
  messageAdminSignatureInputNamePlaceholder: "Enter name",
  messageAdminSignatureInputDescriptionPlaceholder: "Enter description",
  messageAdminSignatureButtonCreate: "Create",
  messageAdminSignatureCreateSuccess: "Created successfully",
  messageAdminSignatureCreateError: "Creation failed",
  messageAdminSignatureCreateLoading: "Creating...",
  messageAdminSignatureColumnName: "Name",
  messageAdminSignatureColumnDescription: "Description",
  messageAdminSignatureColumnAction: "Action",
  messageAdminSignatureEditTitle: "Edit Signature",
  messageAdminSignatureEditCancel: "Cancel",
  messageAdminSignatureEditConfirm: "Save",
  messageAdminSignatureEditSuccess: "Updated successfully",
  messageAdminSignatureEditError: "Update failed",
  messageAdminSignatureDeleteTitle: "Delete Signature",
  messageAdminSignatureDeleteSuccess: "Deleted successfully",
  messageAdminSignatureDeleteError: "Delete failed",
  messageAdminSignatureDeleteConfirm: "Are you sure?",
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
    useQuery: jest.fn(),
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

jest.mock("@/components/AdminLayout/components/Editor/HtmlEditor", () => {
  return {
    __esModule: true,
    default: ({
      content,
      onChange,
      placeholder,
    }: {
      content: string;
      onChange: (content: string) => void;
      placeholder?: string;
    }): JSX.Element => (
      <div data-testid="html-editor">
        <textarea
          data-testid="html-editor-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    ),
  };
});

describe("SignatureEditModal", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();

    (useQuery as jest.Mock).mockReturnValue({
      data: {
        getSignatureById: {
          signature: {
            id: String(mockSignatureData.id),
            name: mockSignatureData.name,
            description: mockSignatureData.description,
          },
        },
      },
      loading: false,
      error: null,
    });

    (useMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          updateSignature: {
            code: 200,
            message: "Updated successfully",
            signature: mockSignatureData,
          },
        },
      }),
      { loading: false, error: null, data: null },
    ]);
  });

  it("should return null element when signature is null", (): void => {
    const { container } = render(
      <SignatureEditModal
        signature={null}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render modal title when signature is provided", async (): Promise<void> => {
    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      expect(
        screen.getByText(translationsMock.messageAdminSignatureEditTitle)
      ).toBeInTheDocument();
    });
  });

  it("should render form with signature name", async (): Promise<void> => {
    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      expect(screen.getByDisplayValue(mockSignatureData.name)).toBeInTheDocument();
    });
  });

  it("should render form with signature description", async (): Promise<void> => {
    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      expect(
        screen.getByDisplayValue(mockSignatureData.description)
      ).toBeInTheDocument();
    });
  });

  it("should call onClose when cancel button is clicked", async (): Promise<void> => {
    const onCloseMock: jest.Mock<void, []> = jest.fn();

    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={onCloseMock}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      expect(
        screen.getByText(translationsMock.messageAdminSignatureEditTitle)
      ).toBeInTheDocument();
    });

    const cancelButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureEditCancel);
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should show success toast on successful update", async (): Promise<void> => {
    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      expect(
        screen.getByText(translationsMock.messageAdminSignatureEditTitle)
      ).toBeInTheDocument();
    });

    const submitButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureEditConfirm);
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messageAdminSignatureEditSuccess
      );
    }, { timeout: 2000 });
  });

  it("should display loading state when querying data", (): void => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: undefined,
      loading: true,
      error: null,
    });

    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(screen.getByRole("presentation", { hidden: true })).toBeInTheDocument();
  });

  it("should call onRefresh after successful update", async (): Promise<void> => {
    const onRefreshMock: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={onRefreshMock}
      />
    );

    await waitFor((): void => {
      expect(
        screen.getByText(translationsMock.messageAdminSignatureEditTitle)
      ).toBeInTheDocument();
    });

    const submitButton: HTMLElement = screen.getByText(translationsMock.messageAdminSignatureEditConfirm);
    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(onRefreshMock).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it("should render HtmlEditor for description", async (): Promise<void> => {
    render(
      <SignatureEditModal
        signature={mockSignatureData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      expect(screen.getByTestId("html-editor")).toBeInTheDocument();
      expect(screen.getByTestId("html-editor-textarea")).toBeInTheDocument();
    });
  });

  it("should display HTML description content in editor", async (): Promise<void> => {
    const signatureWithHtml: SignatureRow = {
      id: 1,
      name: "Test",
      description: "<p>HTML <strong>content</strong></p>",
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: {
        getSignatureById: {
          signature: {
            id: String(signatureWithHtml.id),
            name: signatureWithHtml.name,
            description: signatureWithHtml.description,
          },
        },
      },
      loading: false,
      error: null,
    });

    render(
      <SignatureEditModal
        signature={signatureWithHtml}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor((): void => {
      const textarea: HTMLTextAreaElement = screen.getByTestId("html-editor-textarea") as HTMLTextAreaElement;
      expect(textarea.value).toContain("<strong>content</strong>");
    });
  });
});
