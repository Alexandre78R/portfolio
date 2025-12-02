import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import SocialEditModal from "@/components/AdminLayout/components/Social/SocialEditModal";
import type { SocialRow } from "@/components/AdminLayout/components/Social/SocialTable";
import type Lang from "@/lang/typeLang";

const translationsMock: Lang = {
  messageAdminSocialEditTitle: "Edit Social",
  messageAdminSocialEditSuccess: "Social updated successfully",
  messageAdminSocialEditError: "Update failed",
  messageAdminSocialEditCancel: "Cancel",
  messageAdminSocialEditConfirm: "Save Changes",
  messageAdminSocialInputTitle: "Title",
  messageAdminSocialInputUrl: "URL",
  messageAdminSocialInputTab: "Tab Position",
} as Lang;

const mockSocialData: SocialRow = {
  id: 1,
  title: "GitHub",
  url: "https://github.com/user",
  tab: 1,
};

const mockShowAlert: jest.Mock<void, ["success" | "error", string]> = jest.fn();

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: translationsMock,
  })),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

const mockUpdateMutation: jest.Mock<any, any[]> = jest.fn();
const mockUseGetSocialQuery: jest.Mock = jest.fn();

jest.mock("@/types/graphql", () => ({
  __esModule: true,
  useUpdateSocialMutation: jest.fn(() => [mockUpdateMutation, {}] as const),
  useGetSocialByIdQuery: jest.fn(() => mockUseGetSocialQuery()),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: ({ 
    open, 
    onClose, 
    children 
  }: { 
    open: boolean; 
    onClose: () => void; 
    children: React.ReactNode; 
  }): ReactElement | null => open ? (
    <div data-testid="modal-custom" onClick={onClose}>
      {children}
    </div>
  ) : null,
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="text-admin">{children}</h2>
  ),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({
    id,
    label,
    name,
    value,
    onChange,
    type = "text",
  }: {
    id: string;
    label: string;
    name: string;
    value: string | number;
    onChange: (e: any) => void;
    type?: string;
  }): ReactElement => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        data-testid={`input-field-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
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
  }): ReactElement => (
    <button
      type={type as "button" | "submit"}
      onClick={onClick}
      disabled={disable}
      data-testid={`button-${text}`}
    >
      {text}
    </button>
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

describe("SocialEditModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowAlert.mockClear();
    mockUpdateMutation.mockClear();
    mockUseGetSocialQuery.mockClear();
  });

  test("should return null when social is null", () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: null,
      loading: false,
    });

    const { container } = render(
      <SocialEditModal
        social={null}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("should display loading state", () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: { socialById: mockSocialData },
      loading: true,
    });

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("should display modal with form when data is loaded", async () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: {
        socialById: mockSocialData,
      },
      loading: false,
    });

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("modal-custom")).toBeInTheDocument();
      expect(screen.getByText("Edit Social")).toBeInTheDocument();
    });
  });

  test("should populate form fields with social data", async () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: {
        socialById: mockSocialData,
      },
      loading: false,
    });

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor(() => {
      const titleInput = screen.getByTestId("input-field-title") as HTMLInputElement;
      const urlInput = screen.getByTestId("input-field-url") as HTMLInputElement;
      const tabInput = screen.getByTestId("input-field-tab") as HTMLInputElement;

      expect(titleInput.value).toBe("GitHub");
      expect(urlInput.value).toBe("https://github.com/user");
      expect(tabInput.value).toBe("1");
    });
  });

  test("should call mutation on form submit", async () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: {
        socialById: mockSocialData,
      },
      loading: false,
    });

    mockUpdateMutation.mockResolvedValue({
      data: {
        updateSocial: {
          code: 200,
          message: "Updated",
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("input-field-title")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("button-Save Changes");
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalled();
    });
  });

  test("should show success message on successful update", async () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: {
        socialById: mockSocialData,
      },
      loading: false,
    });

    mockUpdateMutation.mockResolvedValue({
      data: {
        updateSocial: {
          code: 200,
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("input-field-title")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("button-Save Changes");
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social updated successfully");
    });
  });

  test("should show error message on failed update", async () => {
    mockUseGetSocialQuery.mockReturnValue({
      data: {
        socialById: mockSocialData,
      },
      loading: false,
    });

    mockUpdateMutation.mockResolvedValue({
      data: {
        updateSocial: {
          code: 400,
        },
      },
    });

    const mockRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={mockRefresh}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("input-field-title")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("button-Save Changes");
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Update failed");
    });
  });
});
