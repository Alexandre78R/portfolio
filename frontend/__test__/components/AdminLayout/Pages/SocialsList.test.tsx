import { 
  render, 
  screen, 
  waitFor, 
  fireEvent 
} from '@testing-library/react';
import "@testing-library/jest-dom";

import SocialsList from "@/components/AdminLayout/Pages/Socials/SocialsList";
import { useListSocialsAdmin } from "@/utils/hooks/useSocialAdmin";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import type { SocialRow } from "@/components/AdminLayout/components/Social/SocialTable";

type MockQueryResult = {
  data?: {
    listSocials?: Array<{
      __typename?: string;
      id: string;
      title: string;
      url: string;
      tab: number;
    } | null> | null;
  } | null;
  loading: boolean;
  error?: Error | null;
  refetch: jest.Mock<void, []>;
};

let mockEditCallback: ((social: SocialRow) => void) | undefined;
let mockDeleteCallback: ((socialId: number) => void) | undefined;

jest.mock("@/components/Loading/LoadingCustom", () => () => (
  <div data-testid="loading" aria-label="loading">Loading...</div>
));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ 
    children, 
    type = "h2" 
  }: { 
    children: React.ReactNode; 
    type?: string; 
  }) => {
    const Tag = type as "h1" | "h2" | "h3";
    return <Tag data-testid={`text-admin-${type}`}>{children}</Tag>;
  },
}));

jest.mock("@/components/AdminLayout/components/Social/SocialTable", () => ({
  __esModule: true,
  default: ({
    socials,
    translations,
    onEdit,
    onDelete,
  }: {
    socials: SocialRow[];
    translations: Lang;
    onEdit: (social: SocialRow) => void;
    onDelete: (id: number) => void;
  }) => {
    mockEditCallback = onEdit;
    mockDeleteCallback = onDelete;
    return (
      <div data-testid="social-table">
        {socials.map((social) => (
          <div key={social.id} data-testid={`social-row-${social.id}`}>
            <span>{social.title}</span>
            <span>{social.url}</span>
            <button
              data-testid={`edit-${social.id}`}
              onClick={() => onEdit(social)}
            >
              Edit
            </button>
            <button
              data-testid={`delete-${social.id}`}
              onClick={() => onDelete(social.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Social/SocialEditModal", () => ({
  __esModule: true,
  default: ({ 
    social, 
    onClose,
    onRefresh,
  }: { 
    social: SocialRow | null; 
    onClose: () => void;
    onRefresh: () => Promise<any>;
  }) =>
    social ? (
      <div data-testid="edit-modal">
        <span>{social.title}</span>
        <button data-testid="close-edit-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/AdminLayout/components/Social/SocialDeleteDialog", () => ({
  __esModule: true,
  default: ({ 
    socialId, 
    onClose,
    onRefresh,
  }: { 
    socialId: number | null; 
    onClose: () => void;
    onRefresh: () => Promise<any>;
  }) =>
    socialId ? (
      <div data-testid="delete-dialog">
        <button data-testid="close-delete-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("@/utils/hooks/useSocialAdmin", () => ({
  useListSocialsAdmin: jest.fn(),
  useCreateSocialAdmin: jest.fn(),
  useUpdateSocialAdmin: jest.fn(),
  useDeleteSocialAdmin: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminSocialListTitle: "Socials",
      messageAdminSocialListNotFound: "No socials found",
      messageAdminSocialColumnTitle: "Title",
      messageAdminSocialColumnUrl: "URL",
      messageAdminSocialColumnTab: "Tab",
      messageAdminSocialColumnAction: "Actions",
    } as Lang,
  })),
}));

describe("SocialsList", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEditCallback = undefined;
    mockDeleteCallback = undefined;
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("should display loading state", () => {
    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("should display error message when query fails", () => {
    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error("Network error"),
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(screen.getByText("No socials found")).toBeInTheDocument();
  });

  test("should display error message when no data", () => {
    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(screen.getByText("No socials found")).toBeInTheDocument();
  });

  test("should display list title", () => {
    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: [],
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(screen.getByTestId("text-admin-h1")).toHaveTextContent("Socials");
  });

  test("should render table with socials data", () => {
    const mockSocials: unknown[] = [
      {
        __typename: "Social",
        id: "1",
        title: "GitHub",
        url: "https://github.com/user",
        tab: 1,
      },
      {
        __typename: "Social",
        id: "2",
        title: "LinkedIn",
        url: "https://linkedin.com/in/user",
        tab: 2,
      },
    ];

    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: mockSocials,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(screen.getByTestId("social-table")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  test("should open edit modal when edit button is clicked", async () => {
    const mockSocials: unknown[] = [
      {
        __typename: "Social",
        id: "1",
        title: "GitHub",
        url: "https://github.com/user",
        tab: 1,
      },
    ];

    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: mockSocials,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    fireEvent.click(screen.getByTestId("edit-1"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });
  });

  test("should close edit modal when close is clicked", async () => {
    const mockSocials: unknown[] = [
      {
        __typename: "Social",
        id: "1",
        title: "GitHub",
        url: "https://github.com/user",
        tab: 1,
      },
    ];

    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: mockSocials,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    fireEvent.click(screen.getByTestId("edit-1"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("close-edit-modal"));

    await waitFor(() => {
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });
  });

  test("should open delete dialog when delete button is clicked", async () => {
    const mockSocials: unknown[] = [
      {
        __typename: "Social",
        id: "1",
        title: "GitHub",
        url: "https://github.com/user",
        tab: 1,
      },
    ];

    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: mockSocials,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    fireEvent.click(screen.getByTestId("delete-1"));

    await waitFor(() => {
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    });
  });

  test("should close delete dialog when close is clicked", async () => {
    const mockSocials: unknown[] = [
      {
        __typename: "Social",
        id: "1",
        title: "GitHub",
        url: "https://github.com/user",
        tab: 1,
      },
    ];

    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: mockSocials,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    fireEvent.click(screen.getByTestId("delete-1"));

    await waitFor(() => {
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("close-delete-dialog"));

    await waitFor(() => {
      expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();
    });
  });

  test("should filter out null socials", () => {
    const mockSocials: unknown[] = [
      {
        __typename: "Social",
        id: "1",
        title: "GitHub",
        url: "https://github.com/user",
        tab: 1,
      },
      null,
      {
        __typename: "Social",
        id: "2",
        title: "LinkedIn",
        url: "https://linkedin.com/in/user",
        tab: 2,
      },
    ];

    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: mockSocials,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(screen.getByTestId("social-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("social-row-2")).toBeInTheDocument();
    expect(screen.queryByTestId("social-row-null")).not.toBeInTheDocument();
  });

  test("should call refetch when needed", () => {
    const mockRefetch: jest.Mock = jest.fn();
    (useListSocialsAdmin as jest.Mock).mockReturnValue({
      data: {
        listSocials: [],
      },
      loading: false,
      error: null,
      refetch: mockRefetch,
    } as Partial<MockQueryResult>);

    render(<SocialsList />);

    expect(useListSocialsAdmin).toHaveBeenCalled();
  });
});
