import { render, screen, fireEvent, waitFor } from '@test-utils';
import "@testing-library/jest-dom";
import { useMutation } from "@apollo/client";
import SignaturesCreate from "@/components/AdminLayout/Pages/Signatures/SignaturesCreate";
import type Lang from "@/lang/typeLang";

interface MockInputFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
}

interface MockContextValue {
  translations: Lang;
}

interface MockShowAlertParams {
  type: string;
  message: string;
}

const mockShowAlert: jest.Mock<void, [MockShowAlertParams]> = jest.fn();

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => {
  return {
    __esModule: true,
    default: ({
      title,
      children,
    }: {
      title: string;
      children: React.ReactNode;
    }): JSX.Element => (
      <div data-testid="auth-form-layout">
        <div data-testid="form-title">{title}</div>
        <div data-testid="form-content">{children}</div>
      </div>
    ),
  };
});

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <h2 data-testid="text-admin">{children}</h2>
    ),
  };
});

jest.mock("@/components/InputField/InputField", () => {
  return {
    __esModule: true,
    default: ({
      id,
      label,
      name,
      value,
      onChange,
      type = "text",
    }: MockInputFieldProps): JSX.Element => (
      <div data-testid={`input-${id}`}>
        <label htmlFor={id}>{label}</label>
        {type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            data-testid={`input-field-${id}`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            data-testid={`input-field-${id}`}
          />
        )}
      </div>
    ),
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

jest.mock("@/components/Button/Button", () => {
  return {
    __esModule: true,
    default: ({
      text,
      type = "button",
      onClick,
      disable = false,
    }: {
      text: string;
      type?: string;
      onClick?: () => void;
      disable?: boolean;
    }): JSX.Element => (
      <button
        type={type as "button" | "submit" | "reset"}
        onClick={onClick}
        disabled={disable}
        data-testid={`button-${text}`}
      >
        {text}
      </button>
    ),
  };
});

jest.mock("@/components/Loading/LoadingCustom", () => {
  return {
    __esModule: true,
    default: (): JSX.Element => (
      <div data-testid="loading">Loading...</div>
    ),
  };
});

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useMutation: jest.fn(),
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

jest.mock("@/context/Lang/LangContext", () => {
  const translationsMock: Lang = {
    messageAdminSignatureListTitle: "Signatures",
    messageAdminSignatureListNotFound: "No signatures found",
    messageAdminSignatureCreateTitle: "Create Signature",
    messageAdminSignatureInputName: "Name",
    messageAdminSignatureInputDescription: "Description",
    messageAdminSignatureInputNamePlaceholder: "Enter name",
    messageAdminSignatureInputDescriptionPlaceholder: "Enter description",
    messageAdminSignatureButtonCreate: "Create",
    messageAdminSignatureCreateConfirm: "Create",
    messageAdminSignatureCreateLoading: "Creating...",
    messageAdminSignatureCreateSuccess: "Created successfully",
    messageAdminSignatureCreateError: "Creation failed",
    messageAdminSignatureColumnName: "Name",
    messageAdminSignatureColumnDescription: "Description",
    messageAdminSignatureColumnAction: "Action",
    messageAdminSignatureEditTitle: "Edit Signature",
    messageAdminSignatureEditSuccess: "Updated successfully",
    messageAdminSignatureEditError: "Update failed",
    messageAdminSignatureDeleteTitle: "Delete Signature",
    messageAdminSignatureDeleteSuccess: "Deleted successfully",
    messageAdminSignatureDeleteError: "Delete failed",
    messageAdminSignatureDeleteConfirm: "Are you sure?",
    messageErrorServerOff: "Server error",
  } as Lang;

  return {
    useLang: jest.fn((): MockContextValue => ({
      translations: translationsMock,
    })),
  };
});

describe("SignaturesCreate", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();

    (useMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          createSignature: {
            code: 201,
            message: "Created successfully",
            signature: { id: 1, name: "Test", description: "Test" },
          },
        },
      }),
      { loading: false, error: null, data: null },
    ]);
  });

  it("should render form layout", (): void => {
    render(<SignaturesCreate />);
    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
  });

  it("should render form title", (): void => {
    render(<SignaturesCreate />);
    expect(screen.getByTestId("form-title")).toBeInTheDocument();
  });

  it("should render name input field", (): void => {
    render(<SignaturesCreate />);
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("should render description input field", (): void => {
    render(<SignaturesCreate />);
    expect(screen.getByTestId("html-editor")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("should render create button", (): void => {
    render(<SignaturesCreate />);
    expect(screen.getByTestId("button-Create")).toBeInTheDocument();
  });

  it("should update name input value", (): void => {
    render(<SignaturesCreate />);
    const nameInput: HTMLInputElement = screen.getByTestId(
      "input-field-name"
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Test Signature" } });
    expect(nameInput.value).toBe("Test Signature");
  });

  it("should update description input value", (): void => {
    render(<SignaturesCreate />);
    const descInput: HTMLTextAreaElement = screen.getByTestId(
      "html-editor-textarea"
    ) as HTMLTextAreaElement;

    fireEvent.change(descInput, { target: { value: "Test Description" } });
    expect(descInput.value).toBe("Test Description");
  });

  it("should submit form with values", async (): Promise<void> => {
    render(<SignaturesCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId(
      "input-field-name"
    ) as HTMLInputElement;
    const descInput: HTMLTextAreaElement = screen.getByTestId(
      "html-editor-textarea"
    ) as HTMLTextAreaElement;
    const button: HTMLButtonElement = screen.getByTestId(
      "button-Create"
    ) as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "New Signature" } });
    fireEvent.change(descInput, { target: { value: "New Description" } });
    fireEvent.click(button);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalled();
    });
  });

  it("should clear form after successful submission", async (): Promise<void> => {
    render(<SignaturesCreate />);

    const nameInput: HTMLInputElement = screen.getByTestId(
      "input-field-name"
    ) as HTMLInputElement;
    const descInput: HTMLTextAreaElement = screen.getByTestId(
      "html-editor-textarea"
    ) as HTMLTextAreaElement;
    const button: HTMLButtonElement = screen.getByTestId(
      "button-Create"
    ) as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "Test" } });
    fireEvent.change(descInput, { target: { value: "Test" } });

    expect(nameInput.value).toBe("Test");
    expect(descInput.value).toBe("Test");

    fireEvent.click(button);

    await waitFor((): void => {
      expect(nameInput.value).toBe("");
      expect(descInput.value).toBe("");
    });
  });

  it("should disable button while loading", (): void => {
    // Mock useMutation to return loading state
    (useMutation as jest.Mock).mockReturnValueOnce([
      jest.fn().mockResolvedValue({
        data: {
          createSignature: {
            code: 201,
            message: "Created successfully",
            signature: { id: 1, name: "Test", description: "Test" },
          },
        },
      }),
      { loading: true, error: null, data: null },
    ]);

    render(<SignaturesCreate />);

    const button: HTMLButtonElement = screen.getByTestId(
      "button-Creating..."
    ) as HTMLButtonElement;

    expect(button).toBeDisabled();
  });

  it("should render HtmlEditor for description", (): void => {
    render(<SignaturesCreate />);
    
    expect(screen.getByTestId("html-editor")).toBeInTheDocument();
    expect(screen.getByTestId("html-editor-textarea")).toBeInTheDocument();
  });

  it("should update description with HTML content", (): void => {
    render(<SignaturesCreate />);
    
    const descInput: HTMLTextAreaElement = screen.getByTestId(
      "html-editor-textarea"
    ) as HTMLTextAreaElement;

    const htmlContent: string = "<p>Test with <strong>HTML</strong></p>";
    fireEvent.change(descInput, { target: { value: htmlContent } });
    
    expect(descInput.value).toBe(htmlContent);
  });
});
