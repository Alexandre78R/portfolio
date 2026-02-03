import React, { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMeEditModal from "@/components/AdminLayout/components/AboutMe/AboutMeEditModal";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import { type FetchResult } from "@apollo/client";
import type { AlertType } from "@/components/ToastCustom/CustomToast";
import { 
  UpdateAboutMeMutationVariables,
  GetAboutMeByIdQuery,
  useGetAboutMeByIdQuery,
  UpdateAboutMeMutation,
} from "@/types/graphql";

type MockModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

type MockHtmlEditorProps = {
  content: string;
  onChange: (value: string) => void;
};

type MockInputBooleanProps = {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type MockButtonProps = {
  text: string;
  onClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: (props: MockModalProps): ReactElement | null =>
    props.open ? <div data-testid="modal">{props.children}</div> : null,
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: (props: { children: React.ReactNode }): ReactElement => <h2>{props.children}</h2>,
}));

jest.mock("@/components/AdminLayout/components/Editor/HtmlEditor", () => ({
  __esModule: true,
  default: (props: MockHtmlEditorProps): ReactElement => (
    <input
      data-testid="html-editor"
      value={props.content}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.onChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputBoolean", () => ({
  __esModule: true,
  default: (props: MockInputBooleanProps): ReactElement => (
    <input
      data-testid="input-boolean"
      type="checkbox"
      checked={props.value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => props.onChange(e)}
    />
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: (props: MockButtonProps): ReactElement => (
    <button type={props.type} onClick={props.onClick}>
      {props.text}
    </button>
  ),
}));

const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: (): { showAlert: typeof mockShowAlert } => ({ showAlert: mockShowAlert }),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading" />,
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn<LangContextType, []>(),
}));

const mockQueryFn: jest.Mock<any, any> = jest.fn();

const mockUpdateAboutMeMutation: jest.Mock<
  Promise<FetchResult<UpdateAboutMeMutation>>,
  [{ variables: UpdateAboutMeMutationVariables }]
> = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useUpdateAboutMeAdmin: jest.fn(() => [mockUpdateAboutMeMutation, { loading: false }]),
}));

jest.mock("@/types/graphql", () => ({
  ...jest.requireActual("@/types/graphql"),
  useGetAboutMeByIdQuery: jest.fn((options?: any) =>
    mockQueryFn(options || {})
  ),
}));

describe("AboutMeEditModal", (): void => {
  const translationsMock = {
    messageAdminAboutMeEditTitle: "Edit About Me",
    messageAdminAboutMeInputTitleFR: "Title FR",
    messageAdminAboutMeInputTitleEN: "Title EN",
    messageAdminAboutMeInputDescFR: "Description FR",
    messageAdminAboutMeInputDescEN: "Description EN",
    messageAdminAboutMeInputVisible: "Visible",
    messageAdminAboutMeEditConfirm: "Save",
    messageAdminAboutMeEditCancel: "Cancel",
    messageAdminAboutMeCreateLoading: "Loading",
    messageAdminAboutMeEditSuccess: "Updated successfully",
    messageAdminAboutMeEditError: "Update failed",
  } as unknown as Lang;

  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(async (): Promise<void> => undefined);
  const mockRefetch: jest.Mock<any, any> = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
    
    const { useUpdateAboutMeAdmin } = require("@/utils/hooks");
    (useUpdateAboutMeAdmin as jest.Mock).mockReturnValue([mockUpdateAboutMeMutation, { loading: false }]);
    mockQueryFn.mockReturnValue({
      data: {
        getAboutMeById: {
          aboutMe: {
            id: "1",
            titleEN: "Title EN",
            titleFR: "Title FR",
            descriptionEN: "Description EN",
            descriptionFR: "Description FR",
            isVisible: true,
          },
          code: 200,
          message: "Success",
        },
      },
      loading: false,
      refetch: mockRefetch,
    });
  });

  it("should not render when aboutMeId is null", (): void => {
    const { container } = render(
      <AboutMeEditModal aboutMeId={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should show loading state when data is being fetched", (): void => {
    mockQueryFn.mockReturnValue({
      loading: true,
      refetch: mockRefetch,
    });

    render(<AboutMeEditModal aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const loadingElement: HTMLElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should render form with fetched data", (): void => {
    render(<AboutMeEditModal aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const titleElement: HTMLElement = screen.getByText("Edit About Me");
    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    const inputBoolean: HTMLInputElement = screen.getByTestId("input-boolean") as HTMLInputElement;

    expect(titleElement).toBeInTheDocument();
    expect(htmlEditors).toHaveLength(4);
    expect(htmlEditors[0]).toHaveValue("Title FR");
    expect(htmlEditors[1]).toHaveValue("Title EN");
    expect(htmlEditors[2]).toHaveValue("Description FR");
    expect(htmlEditors[3]).toHaveValue("Description EN");
    expect(inputBoolean.checked).toBe(true);
  });

  it("should submit update mutation with correct data", async (): Promise<void> => {
    mockUpdateAboutMeMutation.mockResolvedValueOnce({
      data: {
        updateAboutMe: {
          aboutMe: {
            id: "1",
            titleEN: "Updated Title EN",
            titleFR: "Updated Title FR",
            descriptionEN: "Updated Description EN",
            descriptionFR: "Updated Description FR",
            isVisible: false,
          },
          code: 200,
          message: "Success",
        },
      },
    });

    render(<AboutMeEditModal aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const htmlEditors: HTMLElement[] = screen.getAllByTestId("html-editor");
    fireEvent.change(htmlEditors[0], { target: { value: "Updated Title FR" } });
    fireEvent.change(htmlEditors[1], { target: { value: "Updated Title EN" } });

    const saveButton: HTMLElement = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockUpdateAboutMeMutation).toHaveBeenCalledTimes(1);
      expect(mockUpdateAboutMeMutation).toHaveBeenCalledWith({
        data: {
          id: 1,
          titleFR: "Updated Title FR",
          titleEN: "Updated Title EN",
          descriptionFR: "Description FR",
          descriptionEN: "Description EN",
          isVisible: true,
        },
      });
    });
  });

  it("should call onRefresh and onClose on successful update", async (): Promise<void> => {
    mockUpdateAboutMeMutation.mockResolvedValueOnce({
      data: {
        updateAboutMe: {
          aboutMe: {
            id: "1",
            titleEN: "Title EN",
            titleFR: "Title FR",
            descriptionEN: "Description EN",
            descriptionFR: "Description FR",
            isVisible: true,
          },
          code: 200,
          message: "Success",
        },
      },
    });

    render(<AboutMeEditModal aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const saveButton: HTMLElement = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should show error toast on failed update", async (): Promise<void> => {
    mockUpdateAboutMeMutation.mockClear();
    mockUpdateAboutMeMutation.mockResolvedValueOnce({
      data: {
        updateAboutMe: {
          aboutMe: null,
          code: 500,
          message: "Server error",
        },
      },
    });

    render(<AboutMeEditModal aboutMeId={1} onClose={mockOnClose} onRefresh={mockOnRefresh} />);

    const saveButton: HTMLElement = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Update failed");
    });
  });
});
