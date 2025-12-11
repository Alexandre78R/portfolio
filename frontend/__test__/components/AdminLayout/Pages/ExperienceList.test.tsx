import React from "react";
import { 
  render, 
  screen, 
  waitFor, 
  fireEvent 
} from '@testing-library/react';
import "@testing-library/jest-dom";
import { useLang, type LangContextType } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";
import type { ExperienceRow } from "@/components/AdminLayout/components/Experience/ExperienceTable";
import ExperienceList from "@/components/AdminLayout/Pages/Experiences/ExperiencesList";
import { useGetExperiencesListQuery } from "@/types/graphql"; 

interface MockQueryResult {
  data?: {
    experienceList?: {
      experiences: Array<{
        __typename?: string;
        id: string;
        jobEN: string;
        jobFR: string;
        business: string;
        employmentContractEN: string;
        employmentContractFR: string;
        startDateEN: string;
        startDateFR: string;
        endDateEN: string;
        endDateFR: string;
        month?: number | null;
        typeEN: string;
        typeFR: string;
      } | null> | null;
    };
  };
  loading: boolean;
  error?: Error | null;
  refetch: jest.Mock<void, []>;
}

let mockEditCallback: jest.Mock<void, [experience: ExperienceRow]> | undefined;
let mockDeleteCallback: jest.Mock<void, [experienceId: number]> | undefined;

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

jest.mock("@/components/AdminLayout/components/Experience/ExperienceTable", () => ({
  __esModule: true,
  default: ({ 
    experiences, 
    translations, 
    onEdit, 
    onDelete 
  }: { 
    experiences: ExperienceRow[]; 
    translations: Lang; 
    onEdit: (experience: ExperienceRow) => void;
    onDelete: (id: number) => void;
  }): React.ReactElement => {
    mockEditCallback = onEdit as jest.Mock<void, [ExperienceRow]>;
    mockDeleteCallback = onDelete as jest.Mock<void, [number]>;

    return (
      <div data-testid="experience-table" role="table">
        <div data-testid="table-data" role="rowgroup">
          <button
            data-testid="mock-edit-btn"
            type="button"
            onClick={() => mockEditCallback?.(experiences[0])}
            aria-label="Edit first experience"
          >
            Edit First
          </button>
          <button
            data-testid="mock-delete-btn"
            type="button"
            onClick={() => mockDeleteCallback?.(Number(experiences[0]?.id))}
            aria-label="Delete first experience"
          >
            Delete First
          </button>
        </div>
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Experience/ExperienceDeleteDialog", () => ({
  __esModule: true,
  default: ({ 
    experienceId, 
    onClose, 
    onRefresh 
  }: { 
    experienceId: number | null;
    onClose: () => void;
    onRefresh: () => Promise<void>;
  }): React.ReactElement | null => {
    if (!experienceId) return null;
    return (
      <div 
        data-testid="delete-dialog" 
        data-experience-id={String(experienceId)}
        role="dialog"
        aria-modal="true"
      >
        Delete Dialog: {experienceId}
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Experience/ExperienceEditModal", () => ({
  __esModule: true,
  default: ({ 
    experience, 
    onClose, 
    onRefresh 
  }: { 
    experience: ExperienceRow | null;
    onClose: () => void;
    onRefresh: () => Promise<void>;
  }): React.ReactElement | null => {
    if (!experience) return null;
    return (
      <div 
        data-testid="edit-modal" 
        data-experience-id={String(experience.id)}
        role="dialog"
        aria-modal="true"
      >
        Edit Modal: {experience.jobFR}
      </div>
    );
  },
}));

jest.mock("@/types/graphql", () => ({
  useGetExperiencesListQuery: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

const translationsMock: Lang = {
  messageAdminExperienceListTitle: "Experience List",
} as Lang;

const mockExperienceGraphQLData: MockQueryResult["data"] = {
  experienceList: {
    experiences: [
      {
        __typename: "Experience",
        id: "1",
        jobEN: "Software Engineer",
        jobFR: "Ingénieur Logiciel",
        business: "TechCorp",
        employmentContractEN: "Full-time",
        employmentContractFR: "Temps plein",
        startDateEN: "2023-06-01",
        startDateFR: "01/06/2023",
        endDateEN: "",
        endDateFR: "",
        month: 6,
        typeEN: "Permanent",
        typeFR: "CDI",
      },
    ],
  },
};

describe("ExperienceList Component", () => {
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
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<ExperienceList />);
    const loadingElement: HTMLElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("displays experience list successfully with title and table", (): void => {
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({
      data: mockExperienceGraphQLData,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<ExperienceList />);

    const titleElement: HTMLElement = screen.getByTestId("text-admin-h1");
    const tableElement: HTMLElement = screen.getByTestId("experience-table");

    expect(titleElement).toHaveTextContent("Experience List");
    expect(tableElement).toBeInTheDocument();
  });

  it("passes transformed data correctly to ExperienceTable", (): void => {
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({
      data: mockExperienceGraphQLData,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<ExperienceList />);
    const tableDataElement: HTMLElement = screen.getByTestId("table-data");
    expect(tableDataElement).toBeInTheDocument();
  });

  it("opens edit modal when edit button is clicked", async (): Promise<void> => {
    const mockRefetchCallback: jest.Mock<void, []> = jest.fn();
    
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({
      data: mockExperienceGraphQLData,
      loading: false,
      error: undefined,
      refetch: mockRefetchCallback,
    } as MockQueryResult);

    render(<ExperienceList />);

    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();

    const editButtonElement: HTMLButtonElement = screen.getByTestId("mock-edit-btn") as HTMLButtonElement;
    fireEvent.click(editButtonElement);

    await waitFor((): void => {
      const editModalElement: HTMLElement = screen.getByTestId("edit-modal");
      expect(editModalElement).toBeInTheDocument();
      expect(editModalElement).toHaveTextContent("Ingénieur Logiciel");
    });
  });

  it("opens delete dialog when delete button is clicked", async (): Promise<void> => {
    const mockRefetchCallback: jest.Mock<void, []> = jest.fn();
    
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({
      data: mockExperienceGraphQLData,
      loading: false,
      error: undefined,
      refetch: mockRefetchCallback,
    } as MockQueryResult);

    render(<ExperienceList />);

    expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();

    const deleteButtonElement: HTMLButtonElement = screen.getByTestId("mock-delete-btn") as HTMLButtonElement;
    fireEvent.click(deleteButtonElement);

    await waitFor((): void => {
      const deleteDialogElement: HTMLElement = screen.getByTestId("delete-dialog");
      expect(deleteDialogElement).toBeInTheDocument();
      expect(deleteDialogElement).toHaveAttribute("data-experience-id", "1");
    });
  });

  it("handles empty experiences list", (): void => {
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({
      data: { experienceList: { experiences: [] } },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as MockQueryResult);

    render(<ExperienceList />);

    const tableElement: HTMLElement = screen.getByTestId("experience-table");
    expect(tableElement).toBeInTheDocument();
  });
});
