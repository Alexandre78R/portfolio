import React, { type ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMeList from "@/components/AdminLayout/Pages/AboutMe/AboutMeList";
import type { AboutMeRow } from "@/components/AdminLayout/components/AboutMe/AboutMeTable";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import { type ApolloError, type ApolloQueryResult } from "@apollo/client";
import type { ListAboutMeQuery } from "@/types/graphql";
import { useListAboutMeAdmin } from "@/utils/hooks/useAboutMeAdmin";

type MockTextAdminProps = {
  children: React.ReactNode;
};

type MockAboutMeTableProps = {
  aboutMes: AboutMeRow[];
  onEdit: (row: AboutMeRow) => void;
  onDelete: (id: number) => void;
  translations: Lang;
};

type MockDialogProps = {
  aboutMeId: number | null;
  onClose?: () => void;
  onRefresh?: () => Promise<void>;
};

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: MockTextAdminProps): ReactElement => (
    <h1 data-testid="text-admin">{children}</h1>
  ),
}));

let capturedOnEdit: ((aboutMe: AboutMeRow) => void) | undefined;
let capturedOnDelete: ((id: number) => void) | undefined;

jest.mock("@/components/AdminLayout/components/AboutMe/AboutMeTable", () => ({
  __esModule: true,
  default: ({ aboutMes, onEdit, onDelete }: MockAboutMeTableProps): ReactElement => {
    capturedOnEdit = onEdit;
    capturedOnDelete = onDelete;
    return (
      <div data-testid="aboutme-table">
        <button
          data-testid="edit-btn"
          onClick={(): void => capturedOnEdit?.(aboutMes[0])}
        >
          Edit
        </button>
        <button
          data-testid="delete-btn"
          onClick={(): void => capturedOnDelete?.(aboutMes[0].id)}
        >
          Delete
        </button>
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/AboutMe/AboutMeDeleteDialog", () => ({
  __esModule: true,
  default: ({ aboutMeId }: MockDialogProps): ReactElement | null =>
    aboutMeId ? <div data-testid="delete-dialog" data-id={aboutMeId} /> : null,
}));

jest.mock("@/components/AdminLayout/components/AboutMe/AboutMeEditModal", () => ({
  __esModule: true,
  default: ({ aboutMeId }: MockDialogProps): ReactElement | null =>
    aboutMeId ? <div data-testid="edit-modal" data-id={aboutMeId} /> : null,
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn<LangContextType, []>(),
}));

const mockRefetch: jest.Mock<Promise<ApolloQueryResult<ListAboutMeQuery>>, []> = jest.fn();

jest.mock("@/utils/hooks/useAboutMeAdmin", () => ({
  useListAboutMeAdmin: jest.fn<
    {
      loading: boolean;
      data?: ListAboutMeQuery;
      error?: ApolloError;
      refetch: typeof mockRefetch;
    },
    []
  >(),
}));

describe("AboutMeList Page", (): void => {
  const translationsMock: Lang = {
    messageAdminAboutMeListTitle: "About Me List",
    messageAdminAboutMeListNotFound: "No About Me entries found",
  } as Lang;

  const mockAboutMes: AboutMeRow[] = [
    {
      id: 1,
      titleEN: "Title EN",
      titleFR: "Title FR",
      descriptionEN: "Description EN",
      descriptionFR: "Description FR",
      isVisible: false,
    },
  ];

  beforeEach((): void => {
    jest.clearAllMocks();
    (useLang as jest.Mock).mockReturnValue({ translations: translationsMock });
  });

  it("should render loading state when data is being fetched", (): void => {
    (useListAboutMeAdmin as jest.Mock).mockReturnValue({
      loading: true,
      data: null,
      error: null,
      refetch: mockRefetch,
    });

    render(<AboutMeList />);

    const loadingElement: HTMLElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should render empty state when no data is available", (): void => {
    (useListAboutMeAdmin as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listAboutMe: { aboutMes: null, code: 200, message: "No data" } },
      refetch: mockRefetch,
    });

    render(<AboutMeList />);

    const emptyMessage: HTMLElement = screen.getByText("No About Me entries found");
    expect(emptyMessage).toBeInTheDocument();
  });

  it("should render list with about me entries", (): void => {
    (useListAboutMeAdmin as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listAboutMe: { aboutMes: mockAboutMes, code: 200, message: "Success" } },
      refetch: mockRefetch,
    });

    render(<AboutMeList />);

    const tableElement: HTMLElement = screen.getByTestId("aboutme-table");
    expect(tableElement).toBeInTheDocument();
  });

  it("should open edit modal when edit button is clicked", (): void => {
    (useListAboutMeAdmin as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listAboutMe: { aboutMes: mockAboutMes, code: 200, message: "Success" } },
      refetch: mockRefetch,
    });

    render(<AboutMeList />);

    const editButton: HTMLElement = screen.getByTestId("edit-btn");
    fireEvent.click(editButton);

    const editModal: HTMLElement = screen.getByTestId("edit-modal");
    expect(editModal).toBeInTheDocument();
    expect(editModal).toHaveAttribute("data-id", "1");
  });

  it("should open delete dialog when delete button is clicked", (): void => {
    (useListAboutMeAdmin as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listAboutMe: { aboutMes: mockAboutMes, code: 200, message: "Success" } },
      refetch: mockRefetch,
    });

    render(<AboutMeList />);

    const deleteButton: HTMLElement = screen.getByTestId("delete-btn");
    fireEvent.click(deleteButton);

    const deleteDialog: HTMLElement = screen.getByTestId("delete-dialog");
    expect(deleteDialog).toBeInTheDocument();
    expect(deleteDialog).toHaveAttribute("data-id", "1");
  });

  it("should render page title", (): void => {
    (useListAboutMeAdmin as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { listAboutMe: { aboutMes: mockAboutMes, code: 200, message: "Success" } },
      refetch: mockRefetch,
    });

    render(<AboutMeList />);

    const titleElement: HTMLElement = screen.getByText("About Me List");
    expect(titleElement).toBeInTheDocument();
  });
});
