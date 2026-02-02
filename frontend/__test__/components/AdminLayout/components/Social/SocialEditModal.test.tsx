import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

const mockUpdateSocialMutation: jest.Mock = jest.fn();
const mockGetSocialByIdQuery: jest.Mock = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useUpdateSocialAdmin: jest.fn<[typeof mockUpdateSocialMutation], []>(),
}));

jest.mock("@/types/graphql", () => ({
  ...jest.requireActual("@/types/graphql"),
  useGetSocialByIdQuery: jest.fn(() => mockGetSocialByIdQuery()),
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
    onChange: (e: unknown) => void;
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
    
    const { useUpdateSocialAdmin } = require("@/utils/hooks");
    (useUpdateSocialAdmin as jest.Mock).mockReturnValue([mockUpdateSocialMutation]);
    
    mockGetSocialByIdQuery.mockReturnValue({
      data: {
        getSocialById: {
          code: 200,
          message: "Success",
          social: {
            id: String(mockSocialData.id),
            title: mockSocialData.title,
            url: mockSocialData.url,
            tab: mockSocialData.tab,
          },
        },
      },
      loading: false,
    });
    
    mockUpdateSocialMutation.mockResolvedValue({
      data: { updateSocial: { code: 200, message: "Updated" } },
    });
  });

  test("should return null when social is null", () => {
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
    mockGetSocialByIdQuery.mockReturnValue({ data: null, loading: true });
    
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
    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor(() => {
      const titleInput: HTMLInputElement = screen.getByTestId("input-field-title") as HTMLInputElement;
      const urlInput: HTMLInputElement = screen.getByTestId("input-field-url") as HTMLInputElement;
      const tabInput: HTMLInputElement = screen.getByTestId("input-field-tab") as HTMLInputElement;

      expect(titleInput.value).toBe("GitHub");
      expect(urlInput.value).toBe("https://github.com/user");
      expect(tabInput.value).toBe("1");
    });
  });

  test("should show success message on successful update", async () => {
    const mockRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);
    const mockOnClose: jest.Mock<void, []> = jest.fn();

    render(
      <SocialEditModal
        social={mockSocialData}
        onClose={mockOnClose}
        onRefresh={mockRefresh}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("input-field-title")).toBeInTheDocument();
    });

    const submitButton: HTMLButtonElement = screen.getByTestId("button-Save Changes") as HTMLButtonElement;
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social updated successfully");
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("should show error message on failed update", async () => {
    const mockRefresh: jest.Mock<Promise<void>, []> = jest.fn().mockResolvedValue(undefined);

    mockUpdateSocialMutation.mockResolvedValueOnce({
      data: { updateSocial: { code: 400, message: "Update failed" } },
    });

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

    const submitButton: HTMLButtonElement = screen.getByTestId("button-Save Changes") as HTMLButtonElement;
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Update failed");
    });
  });
});
