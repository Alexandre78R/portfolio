import React from "react";
import { 
  render, 
  screen, 
  waitFor, 
  fireEvent 
} from '@testing-library/react';
import "@testing-library/jest-dom";

import EducationList from "@/components/AdminLayout/Pages/Educations/EducationsList";
import { useGetEducationsListQuery } from "@/types/graphql";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import type { EducationRow } from "@/components/AdminLayout/components/Education/EducationTable";

type MockQueryResult = {
  data?: {
    educationList?: {
      educations: Array<{
        __typename?: string;
        id: string;
        school: string;
        location: string;
        titleFR: string;
        titleEN?: string;
        diplomaLevelFR: string;
        diplomaLevelEN?: string;
        year: number;
        month?: number | null;
        typeFR: string;
        typeEN?: string;
      } | null> | null;
    };
  };
  loading: boolean;
  error?: Error | null;
  refetch: jest.Mock<void, []>;
};

let mockEditCallback: jest.Mock<void, [education: EducationRow]> | undefined;
let mockDeleteCallback: jest.Mock<void, [educationId: number]> | undefined;

jest.mock("@/components/Loading/LoadingCustom", () => () => (
  <div data-testid="loading" aria-label="loading">Loading...</div>
));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ 
    children, 
    type 
  }: { 
    children: React.ReactNode; 
    type?: string; 
  }): React.ReactElement => (
    <h1 data-testid={`text-admin-${type}`} role="heading">
      {children}
    </h1>
  ),
}));

jest.mock("@/components/AdminLayout/components/Education/EducationTable", () => ({
  __esModule: true,
  default: ({ 
    educations, 
    translations, 
    onEdit, 
    onDelete 
  }: { 
    educations: EducationRow[]; 
    translations: Lang; 
    onEdit: (education: EducationRow) => void;
    onDelete: (id: number) => void;
  }): React.ReactElement => {
    mockEditCallback = onEdit as jest.Mock<void, [EducationRow]>;
    mockDeleteCallback = onDelete as jest.Mock<void, [number]>;

    return (
      <div data-testid="education-table" role="table">
        <div data-testid="table-data" role="rowgroup">
          <button
            data-testid="mock-edit-btn"
            type="button"
            onClick={() => mockEditCallback?.(educations[0])}
            aria-label="Edit first education"
          >
            Edit First
          </button>
          <button
            data-testid="mock-delete-btn"
            type="button"
            onClick={() => mockDeleteCallback?.(Number(educations[0]?.id))}
            aria-label="Delete first education"
          >
            Delete First
          </button>
        </div>
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Education/EducationDeleteDialog", () => ({
  __esModule: true,
  default: ({ 
    educationId, 
    onClose, 
    onRefresh 
  }: { 
    educationId: number | null;
    onClose: () => void;
    onRefresh: () => void;
  }): React.ReactElement | null => {
    if (!educationId) return null;
    return (
      <div 
        data-testid="delete-dialog" 
        data-education-id={String(educationId)}
        role="dialog"
        aria-modal="true"
      >
        Delete Dialog: {educationId}
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Education/EducationEditModal", () => ({
  __esModule: true,
  default: ({ 
    education, 
    onClose, 
    onRefresh 
  }: { 
    education: EducationRow | null;
    onClose: () => void;
    onRefresh: () => void;
  }): React.ReactElement | null => {
    if (!education) return null;
    return (
      <div 
        data-testid="edit-modal" 
        data-education-id={String(education.id)}
        role="dialog"
        aria-modal="true"
      >
        Edit Modal: {education.school}
      </div>
    );
  },
}));

jest.mock("@/types/graphql", () => ({
  useGetEducationsListQuery: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

const translationsMock: Lang = {
  messageAdminEducationListTitle: "Education List",
  messageAdminEducationListNotFound: "No educations found",
  messageAdminEducationColumnSchool: "School",
} as Lang;

const mockEducationGraphQLData: MockQueryResult["data"] = {
  educationList: {
    educations: [
      {
        __typename: "Education",
        id: "1",
        school: "University Paris",
        location: "Paris",
        titleFR: "Master Informatique",
        titleEN: "Master CS",
        diplomaLevelFR: "Master 2",
        diplomaLevelEN: "Master's",
        year: 2023,
        month: 6,
        typeFR: "Diplôme",
        typeEN: "Degree",
      },
    ],
  },
};

describe("EducationList Component", () => {
  beforeEach((): void => {
    jest.clearAllMocks();
    mockEditCallback = undefined;
    mockDeleteCallback = undefined;

    (useLang as jest.MockedFunction<typeof useLang>).mockReturnValue({
      translations: translationsMock,
      lang: "en",
      setLang: jest.fn(),
      listLang: ["en", "fr"],
    } as LangContextType);
  });

  it("displays loading state correctly", (): void => {
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<EducationList />);
    const loadingElement: HTMLElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("displays error state with proper message", (): void => {
    const mockError: Error = new Error("API Error");
    
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<EducationList />);
    const errorMessageElement: HTMLElement = screen.getByText("No educations found");
    expect(errorMessageElement).toBeInTheDocument();
  });

  it("displays no data state correctly", (): void => {
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: { educationList: { educations: null } },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<EducationList />);
    const noDataMessageElement: HTMLElement = screen.getByText("No educations found");
    expect(noDataMessageElement).toBeInTheDocument();
  });

  it("renders education list successfully with title and table", (): void => {
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: mockEducationGraphQLData,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<EducationList />);

    const titleElement: HTMLElement = screen.getByTestId("text-admin-h1");
    const tableElement: HTMLElement = screen.getByTestId("education-table");

    expect(titleElement).toHaveTextContent("Education List");
    expect(tableElement).toBeInTheDocument();
  });

  it("passes transformed data correctly to EducationTable", (): void => {
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: mockEducationGraphQLData,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<EducationList />);
    const tableDataElement: HTMLElement = screen.getByTestId("table-data");
    expect(tableDataElement).toBeInTheDocument();
  });

  it("opens edit modal when edit button is clicked", async (): Promise<void> => {
    const mockRefetchCallback: jest.Mock<void, []> = jest.fn();
    
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: mockEducationGraphQLData,
      loading: false,
      error: undefined,
      refetch: mockRefetchCallback,
    } as MockQueryResult);

    render(<EducationList />);

    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();

    const editButtonElement: HTMLButtonElement = screen.getByTestId("mock-edit-btn") as HTMLButtonElement;
    fireEvent.click(editButtonElement);

    await waitFor((): void => {
      const editModalElement: HTMLElement = screen.getByTestId("edit-modal");
      expect(editModalElement).toBeInTheDocument();
      expect(editModalElement).toHaveTextContent("University Paris");
    });
  });

  it("opens delete dialog when delete button is clicked", async (): Promise<void> => {
    const mockRefetchCallback: jest.Mock<void, []> = jest.fn();
    
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({
      data: mockEducationGraphQLData,
      loading: false,
      error: undefined,
      refetch: mockRefetchCallback,
    } as MockQueryResult);

    render(<EducationList />);

    expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();

    const deleteButtonElement: HTMLButtonElement = screen.getByTestId("mock-delete-btn") as HTMLButtonElement;
    fireEvent.click(deleteButtonElement);

    await waitFor((): void => {
      const deleteDialogElement: HTMLElement = screen.getByTestId("delete-dialog");
      expect(deleteDialogElement).toBeInTheDocument();
      expect(deleteDialogElement).toHaveAttribute("data-education-id", "1");
    });
  });
});
