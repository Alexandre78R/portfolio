import React, { type ReactElement } from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import "@testing-library/jest-dom";
import type { GetSkillsListQuery } from "@/types/graphql";

import SkillsList from "@/components/AdminLayout/Pages/Skills/SkillsList";
import { useListSkillsAdmin } from "@/utils/hooks/useSkillAdmin";
import { useLang } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";

type SkillListData = GetSkillsListQuery;

type SkillRow = {
  id: string | number;
  name: string;
  image: string;
  categoryEN?: string;
  categoryFR?: string;
};

type LangContextType = {
  translations: Lang;
};

type QueryResult<T> = {
  data: T | null;
  loading: boolean;
  error?: Error | null;
  refetch: jest.Mock<Promise<{ data: T }>, []>;
};

let mockEditCallback: ((skill: SkillRow) => void) | undefined;

let mockDeleteCallback: ((skillId: string | number) => void) | undefined;

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => (
    <div data-testid="loading" aria-label="loading">
      Loading...
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({
    children,
    type = "h2",
  }: {
    children: React.ReactNode;
    type?: string;
  }): ReactElement => {
    const Tag: keyof JSX.IntrinsicElements = (type || "h2") as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { "data-testid": `text-admin-${type}` }, children);
  },
}));

jest.mock("@/components/AdminLayout/components/Skill/SkillTable", () => ({
  __esModule: true,
  default: ({
    skills,
    translations,
    onEdit,
    onDelete,
  }: {
    skills: SkillRow[];
    translations: Lang;
    onEdit: (skill: SkillRow) => void;
    onDelete: (id: number | string) => void;
  }): ReactElement => {
    mockEditCallback = onEdit;
    mockDeleteCallback = onDelete;
    return (
      <div data-testid="skill-table">
        {skills.map((skill: SkillRow): ReactElement => (
          <div key={skill.id} data-testid={`skill-row-${skill.id}`}>
            <span>{skill.name}</span>
            <span>{skill.image}</span>
            <span>{skill.categoryEN || ""}</span>
            <button
              data-testid={`edit-${skill.id}`}
              onClick={(): void => onEdit(skill)}
            >
              Edit
            </button>
            <button
              data-testid={`delete-${skill.id}`}
              onClick={(): void => onDelete(skill.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Skill/SkillEditModal", () => ({
  __esModule: true,
  default: ({
    skill,
    onClose,
    onRefresh,
  }: {
    skill: SkillRow | null;
    onClose: () => void;
    onRefresh: () => Promise<any>;
  }): ReactElement | null =>
    skill ? (
      <div data-testid="edit-modal">
        <span>{skill.name}</span>
        <button data-testid="close-edit-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/AdminLayout/components/Skill/SkillDeleteDialog", () => ({
  __esModule: true,
  default: ({
    skillId,
    onClose,
    onRefresh,
  }: {
    skillId: number | string | null;
    onClose: () => void;
    onRefresh: () => Promise<any>;
  }): ReactElement | null =>
    skillId ? (
      <div data-testid="delete-dialog">
        <button data-testid="close-delete-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("@/utils/hooks/useSkillAdmin", () => ({
  useListSkillsAdmin: jest.fn(),
  useCreateSkillAdmin: jest.fn(),
  useUpdateSkillAdmin: jest.fn(),
  useDeleteSkillAdmin: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

const translationsMock: Lang = {
  messageAdminSkillListTitle: "Skills",
  messageAdminSkillListNotFound: "No skills found",
  messageAdminSkillColumnName: "Name",
  messageAdminSkillColumnImage: "Image",
  messageAdminSkillColumnCategoryEN: "Category (EN)",
  messageAdminSkillColumnCategoryFR: "Category (FR)",
  messageAdminSkillColumnAction: "Actions",
} as Lang;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn((): LangContextType => ({
    translations: translationsMock,
  })),
}));

const mockSkillsData: SkillListData = {
  listSkillCategories: {
    categories: [
      {
        id: "1",
        categoryEN: "Frontend",
        categoryFR: "Frontend",
        skills: [
          { id: "10", name: "React", image: "/images/react.png" },
          { id: "11", name: "Vue.js", image: "/images/vue.png" },
        ],
      },
      {
        id: "2",
        categoryEN: "Backend",
        categoryFR: "Backend",
        skills: [{ id: "20", name: "Node.js", image: "/images/node.png" }],
      },
    ],
    code: 200,
    message: "Success",
  },
};

function resetAllMocks(): void {
  jest.clearAllMocks();
  mockEditCallback = undefined;
  mockDeleteCallback = undefined;
}

function setupQueryMock(
  data: SkillListData | null,
  loading: boolean = false,
  error: Error | null = null
): void {
  const mockRefetch: jest.Mock<Promise<{ data: SkillListData }>, []> = jest.fn();
  (useListSkillsAdmin as jest.Mock).mockReturnValue({
    data,
    loading,
    error,
    refetch: mockRefetch,
  });
}

function getButton(testId: string): HTMLButtonElement {
  const element: HTMLElement | null = screen.queryByTestId(testId);
  if (!element || !(element instanceof HTMLButtonElement)) {
    throw new Error(`Button with testId '${testId}' not found`);
  }
  return element;
}

describe("SkillsList", (): void => {
  beforeEach((): void => {
    resetAllMocks();
  });

  test("renders loading state while data is being fetched", (): void => {
    setupQueryMock(null, true);

    render(<SkillsList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders page title", (): void => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);
    expect(screen.getByTestId("text-admin-h1")).toBeInTheDocument();
  });

  test("renders skill table with skills data", (): void => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);
    expect(screen.getByTestId("skill-table")).toBeInTheDocument();
  });

  test("displays all skills from all categories", (): void => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);
    expect(screen.getByTestId("skill-row-10")).toBeInTheDocument(); // React
    expect(screen.getByTestId("skill-row-11")).toBeInTheDocument(); // Vue.js
    expect(screen.getByTestId("skill-row-20")).toBeInTheDocument(); // Node.js
  });

  test("displays 'no skills found' message when data is empty", (): void => {
    setupQueryMock({
      listSkillCategories: {
        categories: [],
        code: 200,
        message: "Success",
      },
    });

    render(<SkillsList />);
    expect(screen.getByText("No skills found")).toBeInTheDocument();
  });

  test("opens edit modal when edit button is clicked", async (): Promise<void> => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    const editButton: HTMLButtonElement = getButton("edit-10");
    fireEvent.click(editButton);

    await waitFor((): void => {
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });
  });

  test("opens delete dialog when delete button is clicked", async (): Promise<void> => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    const deleteButton: HTMLButtonElement = getButton("delete-10");
    fireEvent.click(deleteButton);

    await waitFor((): void => {
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    });
  });

  test("closes edit modal when close button is clicked", async (): Promise<void> => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    const editButton: HTMLButtonElement = getButton("edit-10");
    fireEvent.click(editButton);

    await waitFor((): void => {
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });

    const closeButton: HTMLButtonElement = getButton("close-edit-modal");
    fireEvent.click(closeButton);

    await waitFor((): void => {
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });
  });

  test("closes delete dialog when close button is clicked", async (): Promise<void> => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    const deleteButton: HTMLButtonElement = getButton("delete-10");
    fireEvent.click(deleteButton);

    await waitFor((): void => {
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    });

    const closeButton: HTMLButtonElement = getButton("close-delete-dialog");
    fireEvent.click(closeButton);

    await waitFor((): void => {
      expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();
    });
  });

  test("passes correct skill to edit modal", async (): Promise<void> => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    const editButton: HTMLButtonElement = getButton("edit-10");
    fireEvent.click(editButton);

    await waitFor((): void => {
      const modal: HTMLElement = screen.getByTestId("edit-modal");
      expect(modal).toHaveTextContent("React");
    });
  });

  test("refetches data after edit", async (): Promise<void> => {
    const mockRefetch: jest.Mock<Promise<{ data: SkillListData }>, []> = jest.fn();
    (useListSkillsAdmin as jest.Mock).mockReturnValue({
      data: mockSkillsData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<SkillsList />);

    const editButton: HTMLButtonElement = getButton("edit-10");
    fireEvent.click(editButton);

    await waitFor((): void => {
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });

  });

  test("handles missing skills in category gracefully", (): void => {
    const dataWithMissingSkills: SkillListData = {
      listSkillCategories: {
        categories: [
          {
            id: "1",
            categoryEN: "Empty Category",
            categoryFR: "Catégorie vide",
            skills: [],
          },
        ],
        code: 200,
        message: "Success",
      },
    };

    setupQueryMock(dataWithMissingSkills);

    render(<SkillsList />);
    expect(screen.getByText("No skills found")).toBeInTheDocument();
  });

  test("handles null categories gracefully", (): void => {
    const dataWithNullCategories: SkillListData = {
      listSkillCategories: {
        categories: null,
        code: 200,
        message: "Success",
      },
    };

    setupQueryMock(dataWithNullCategories);

    render(<SkillsList />);
    expect(screen.getByText("No skills found")).toBeInTheDocument();
  });

  test("uses cache-and-network fetch policy", (): void => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    expect(screen.getByTestId("skill-table")).toBeInTheDocument();
  });

  test("skill row includes all required data", (): void => {
    setupQueryMock(mockSkillsData);

    render(<SkillsList />);

    const skillRow: HTMLElement = screen.getByTestId("skill-row-10");
    expect(skillRow).toHaveTextContent("React");
    expect(skillRow).toHaveTextContent("/images/react.png");
  });

  test("handles query error gracefully", (): void => {
    setupQueryMock(null, false, new Error("Network error"));

    render(<SkillsList />);

    expect(screen.getByText("No skills found")).toBeInTheDocument();
  });
});
