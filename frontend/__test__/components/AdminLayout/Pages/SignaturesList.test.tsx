import { render, screen, fireEvent } from "@test-utils";
import "@testing-library/jest-dom";
import { useQuery } from "@apollo/client";

import SignaturesList from "@/components/AdminLayout/Pages/Signatures/SignaturesList";
import type Lang from "@/lang/typeLang";
import type { SignatureRow } from "@/components/AdminLayout/components/Signature/SignatureTable";

interface MockContextValue {
  translations: Lang;
}

let mockEditCallback: ((signature: SignatureRow) => void) | undefined;
let mockDeleteCallback: ((signatureId: number) => void) | undefined;

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useQuery: jest.fn(),
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

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => {
  return {
    __esModule: true,
    default: ({
      children,
      type = "h2",
    }: {
      children: React.ReactNode;
      type?: string;
    }): JSX.Element => {
      const Tag = type as "h1" | "h2" | "h3";
      return <Tag data-testid={`text-admin-${type}`}>{children}</Tag>;
    },
  };
});

jest.mock("@/components/AdminLayout/components/Signature/SignatureTable", () => {
  return {
    __esModule: true,
    default: ({
      signatures,
      translations,
      onEdit,
      onDelete,
    }: {
      signatures: SignatureRow[];
      translations: Lang;
      onEdit: (signature: SignatureRow) => void;
      onDelete: (id: number) => void;
    }): JSX.Element => {
      mockEditCallback = onEdit;
      mockDeleteCallback = onDelete;
      return (
        <div data-testid="signature-table">
          {signatures.map((signature: SignatureRow) => (
            <div key={signature.id} data-testid={`signature-row-${signature.id}`}>
              <span>{signature.name}</span>
              <button
                data-testid={`edit-${signature.id}`}
                onClick={(): void => onEdit(signature)}
              >
                Edit
              </button>
              <button
                data-testid={`delete-${signature.id}`}
                onClick={(): void => onDelete(signature.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      );
    },
  };
});

jest.mock("@/components/AdminLayout/components/Signature/SignatureEditModal", () => {
  return {
    __esModule: true,
    default: ({
      signature,
      onClose,
    }: {
      signature: SignatureRow | null;
      onClose: () => void;
    }): JSX.Element | null =>
      signature ? (
        <div data-testid="edit-modal">
          <span>{signature.name}</span>
          <button data-testid="close-edit-modal" onClick={onClose}>
            Close
          </button>
        </div>
      ) : null,
  };
});

jest.mock("@/components/AdminLayout/components/Signature/SignatureDeleteDialog", () => {
    return {
      __esModule: true,
      default: ({
        signatureId,
        onClose,
      }: {
        signatureId: number | null;
        onClose: () => void;
      }): JSX.Element | null =>
        signatureId ? (
          <div data-testid="delete-dialog">
            <button data-testid="close-delete-dialog" onClick={onClose}>
              Close
            </button>
          </div>
        ) : null,
    };
  }
);

jest.mock("@/context/Lang/LangContext", () => {
  const translationsMock: Lang = {
    file: "test",
    titleHTML: "Test",
    titleHTMLNotFound: "Not Found",
    titleHTMLUnauthorizedAccess: "Unauthorized",
    descHTML: "Description",
    welcome: "Welcome",
    theme1: "Theme 1",
    theme2: "Theme 2",
    theme3: "Theme 3",
    lang1: "FR",
    lang2: "EN",
    navbarTitle: "Navbar",
    navbarButtonAbout: "About",
    navbarButtonSkill: "Skills",
    navbarButtonProject: "Projects",
    navbarButtonTerminal: "Terminal",
    navbarButtonCareer: "Career",
    navbarButtonContact: "Contact",
    navbarButtonLogout: "Logout",
    headerTitle: "Header",
    nameCategoryAboutMe: "About",
    titleAboutMe: "About Me",
    descriptionAboutMe1: "Desc 1",
    descriptionAboutMe2: "Desc 2",
    descriptionAboutMe3: "Desc 3",
    nameCategorySkills: "Skills",
    skillCegory1: "Category 1",
    nameCategoryProjects: "Projects",
    buttonSeeMore: "See More",
    buttonSeeLess: "See Less",
    footerTitle: "Footer",
    footerAdmin: "Admin",
    footerNetworks: "Networks",
    footerContact: "Contact",
    footerCopyright: "Copyright",
    terminalWelcomeMessage: "Welcome",
    terminalWelcomeMessageHelp: "Help",
    terminalHelpTabAction: "Tab",
    terminalHelpTabDesc: "Tab Description",
    terminalHelpArrowUpAction: "Arrow Up",
    terminalHelpArrowUpTabDesc: "Arrow Up Description",
    terminalHelpArrowDownAction: "Arrow Down",
    terminalHelpArrowDownTabDesc: "Arrow Down Description",
    terminalHelpCtrlAction: "Ctrl",
    terminalHelpCtrlTabDesc: "Ctrl Description",
    terminalWhoamiNotArg: "Not Arg",
    terminalWhoamiMaxOneArg: "Max One Arg",
    terminalWhoamiChoiceNotExiste: "Choice Not Exist",
    buttonPaginationPrevious: "Previous",
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
    messageAdminSignatureDeleteSuccess: "Deleted successfully",
    messageAdminSignatureDeleteError: "Delete failed",
    messageAdminSignatureDeleteConfirm: "Are you sure?",
  } as Lang;

  return {
    useLang: jest.fn((): MockContextValue => ({
      translations: translationsMock,
    })),
  };
});

describe("SignaturesList", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: [] } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("should render loading state", (): void => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should render title", (): void => {
    render(<SignaturesList />);
    expect(screen.getByTestId("text-admin-h1")).toBeInTheDocument();
  });

  it("should render table with signatures", (): void => {
    const mockSignatures: SignatureRow[] = [
      { id: 1, name: "Sig 1", description: "Desc 1" },
      { id: 2, name: "Sig 2", description: "Desc 2" },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: mockSignatures } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    expect(screen.getByTestId("signature-table")).toBeInTheDocument();
    expect(screen.getByText("Sig 1")).toBeInTheDocument();
    expect(screen.getByText("Sig 2")).toBeInTheDocument();
  });

  it("should open edit modal when edit is clicked", (): void => {
    const mockSignatures: SignatureRow[] = [
      { id: 1, name: "Sig 1", description: "Desc 1" },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: mockSignatures } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    const editButton: HTMLElement = screen.getByTestId("edit-1");
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  it("should open delete dialog when delete is clicked", (): void => {
    const mockSignatures: SignatureRow[] = [
      { id: 1, name: "Sig 1", description: "Desc 1" },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: mockSignatures } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    const deleteButton: HTMLElement = screen.getByTestId("delete-1");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
  });

  it("should close edit modal when close button is clicked", (): void => {
    const mockSignatures: SignatureRow[] = [
      { id: 1, name: "Sig 1", description: "Desc 1" },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: mockSignatures } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    const editButton: HTMLElement = screen.getByTestId("edit-1");
    fireEvent.click(editButton);
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();

    const closeButton: HTMLElement = screen.getByTestId("close-edit-modal");
    fireEvent.click(closeButton);
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  it("should close delete dialog when close button is clicked", (): void => {
    const mockSignatures: SignatureRow[] = [
      { id: 1, name: "Sig 1", description: "Desc 1" },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: mockSignatures } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    const deleteButton: HTMLElement = screen.getByTestId("delete-1");
    fireEvent.click(deleteButton);
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

    const closeButton: HTMLElement = screen.getByTestId("close-delete-dialog");
    fireEvent.click(closeButton);
    expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();
  });

  it("should handle error state", (): void => {
    const error: Error = new Error("Failed to fetch signatures");

    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    expect(screen.queryByTestId("signature-table")).not.toBeInTheDocument();
  });

  it("should render multiple signatures in table", (): void => {
    const mockSignatures: SignatureRow[] = [
      { id: 1, name: "Signature 1", description: "Description 1" },
      { id: 2, name: "Signature 2", description: "Description 2" },
      { id: 3, name: "Signature 3", description: "Description 3" },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { listAllSignatures: { signatures: mockSignatures } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<SignaturesList />);
    expect(screen.getByTestId("signature-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("signature-row-2")).toBeInTheDocument();
    expect(screen.getByTestId("signature-row-3")).toBeInTheDocument();
  });
});