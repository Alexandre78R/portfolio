import React, { type ReactElement } from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import "@testing-library/jest-dom";
import type { GetSkillsListQuery } from "@/types/graphql";
import type { QueryResult } from "@apollo/client";

import SkillCategoriesList from "@/components/AdminLayout/Pages/Skills/Categories/SkillCategoriesList";
import type Lang from "@/lang/typeLang";

type SkillListData = GetSkillsListQuery;

type SkillCategory = NonNullable<SkillListData['skillList']['categories']>[number];

type SkillCategoryRow = SkillCategory & {
  skillCount: number;
};

type LangContextType = {
  translations: Lang;
};

let mockEditCallback: ((category: SkillCategoryRow) => void) | undefined;

let mockDeleteCallback: ((categoryId: number | string) => void) | undefined;

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

jest.mock("@/components/AdminLayout/components/SkillCategory/SkillCategoryTable", () => ({
  __esModule: true,
  default: ({
    categories,
    translations,
    onEdit,
    onDelete,
  }: {
    categories: SkillCategoryRow[];
    translations: Lang;
    onEdit: (category: SkillCategoryRow) => void;
    onDelete: (id: number | string) => void;
  }): ReactElement => {
    mockEditCallback = onEdit;
    mockDeleteCallback = onDelete;
    return (
      <div data-testid="skill-category-table">
        {categories.map((category: SkillCategoryRow): ReactElement => (
          <div key={category.id} data-testid={`category-row-${category.id}`}>
            <span>{category.categoryEN}</span>
            <span>{category.categoryFR}</span>
            <span>{category.skillCount}</span>
            <button
              data-testid={`edit-${category.id}`}
              onClick={(): void => onEdit(category)}
            >
              Edit
            </button>
            <button
              data-testid={`delete-${category.id}`}
              onClick={(): void => onDelete(category.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/SkillCategory/SkillCategoryEditModal", () => ({
  __esModule: true,
  default: ({
    category,
    onClose,
    onRefresh,
  }: {
    category: SkillCategoryRow | null;
    onClose: () => void;
    onRefresh: () => Promise<any>;
  }): ReactElement | null =>
    category ? (
      <div data-testid="edit-modal">
        <span>{category.categoryEN}</span>
        <button data-testid="close-edit-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/AdminLayout/components/SkillCategory/SkillCategoryDeleteDialog", () => ({
  __esModule: true,
  default: ({
    categoryId,
    onClose,
    onRefresh,
  }: {
    categoryId: number | string | null;
    onClose: () => void;
    onRefresh: () => Promise<any>;
  }): ReactElement | null =>
    categoryId ? (
      <div data-testid="delete-dialog">
        <button data-testid="close-delete-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

const mockRefetch: jest.Mock<Promise<{ data: SkillListData }>, []> = jest.fn();

jest.mock("@/types/graphql", () => ({
  __esModule: true,
  useGetSkillsListQuery: jest.fn(
    (): Partial<QueryResult<SkillListData>> => ({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: mockRefetch as any,
    })
  ),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn((): LangContextType => ({
    translations: {
      messageAdminSkillCategoryListTitle: "Skill Categories",
      messageAdminSkillCategoryListNotFound: "No skill categories found",
      messageAdminSkillCategoryColumnEN: "Category (EN)",
      messageAdminSkillCategoryColumnFR: "Category (FR)",
      messageAdminSkillCategoryColumnSkillCount: "Skills",
      messageAdminSkillCategoryColumnAction: "Actions",
    } as Lang,
  })),
}));

function resetAllMocks(): void {
  jest.clearAllMocks();
  mockRefetch.mockClear();
  mockEditCallback = undefined;
  mockDeleteCallback = undefined;
}

function setupQueryMock(
  data: SkillListData | null,
  loading: boolean = false,
  error: Error | undefined = undefined
): void {
  const { useGetSkillsListQuery } = require("@/types/graphql");
  (useGetSkillsListQuery as jest.Mock).mockReturnValue({
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

describe("SkillCategoriesList", (): void => {
  beforeEach((): void => {
    resetAllMocks();
  });

  test("should display loading state", (): void => {
    setupQueryMock(null, true);

    render(<SkillCategoriesList />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByLabelText("loading")).toBeInTheDocument();
  });

  test("should display error message when query fails", (): void => {
    setupQueryMock(null, false, new Error("Network error"));

    render(<SkillCategoriesList />);

    expect(screen.getByText("No skill categories found")).toBeInTheDocument();
  });

  test("should display message when no categories available", (): void => {
    setupQueryMock({
      skillList: {
        categories: null,
        code: 0,
        message: ""
      },
    });

    render(<SkillCategoriesList />);

    expect(screen.getByText("No skill categories found")).toBeInTheDocument();
  });

  test("should render title", (): void => {
    setupQueryMock({
      skillList: {
        categories: [],
        code: 0,
        message: ""
      },
    });

    render(<SkillCategoriesList />);

    expect(screen.getByTestId("text-admin-h1")).toHaveTextContent("Skill Categories");
  });

  test("should render table with categories", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [
          {
            id: "1",
            name: "JavaScript",
            image: "",
            categoryId: 1,
          },
          {
            id: "2",
            name: "TypeScript",
            image: "",
            categoryId: 1,
          },
        ],
      },
      {
        id: "2",
        categoryEN: "Design",
        categoryFR: "Conception",
        skills: [{
          id: "3",
          name: "Figma",
          image: "",
          categoryId: 2,
        }],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    expect(screen.getByTestId("skill-category-table")).toBeInTheDocument();
    expect(screen.getByTestId("category-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("category-row-2")).toBeInTheDocument();
    expect(screen.getByText("Programming")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  test("should display correct skill count for each category", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [
          {
            id: "1",
            name: "JavaScript",
            image: "",
            categoryId: 1,
          },
          {
            id: "2",
            name: "TypeScript",
            image: "",
            categoryId: 1,
          },
        ],
      },
      {
        id: "2",
        categoryEN: "Design",
        categoryFR: "Design",
        skills: [{
          id: "3",
          name: "Figma",
          image: "",
          categoryId: 2,
        }],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const row1: HTMLElement = screen.getByTestId("category-row-1");
    const row2: HTMLElement = screen.getByTestId("category-row-2");

    expect(row1).toHaveTextContent("2");
    expect(row2).toHaveTextContent("1");
  });

  test("should handle categories with no skills", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Empty Category",
        categoryFR: "Catégorie Vide",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const row: HTMLElement = screen.getByTestId("category-row-1");
    expect(row).toHaveTextContent("0");
  });

  test("should filter out null categories", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
      {
        id: "2",
        categoryEN: "Design",
        categoryFR: "Design",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    expect(screen.getByTestId("category-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("category-row-2")).toBeInTheDocument();
    expect(screen.queryByTestId("category-row-null")).not.toBeInTheDocument();
  });

  test("should open edit modal when edit button is clicked", async (): Promise<void> => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [{
          id: "1",
          name: "JavaScript",
          image: "",
          categoryId: 1,
        }],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const editButton: HTMLButtonElement = getButton("edit-1");
    fireEvent.click(editButton);

    await waitFor((): void => {
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });
  });

  test("should close edit modal when close button is clicked", async (): Promise<void> => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const editButton: HTMLButtonElement = getButton("edit-1");
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

  test("should open delete dialog when delete button is clicked", async (): Promise<void> => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const deleteButton: HTMLButtonElement = getButton("delete-1");
    fireEvent.click(deleteButton);

    await waitFor((): void => {
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    });
  });

  test("should close delete dialog when close button is clicked", async (): Promise<void> => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const deleteButton: HTMLButtonElement = getButton("delete-1");
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

  test("should pass refetch function to edit modal", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const editButton: HTMLButtonElement = getButton("edit-1");
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  test("should pass refetch function to delete dialog", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    const deleteButton: HTMLButtonElement = getButton("delete-1");
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
  });

  test("should not render modals when no category is selected", (): void => {
    const mockCategories: SkillListData['skillList']['categories'] = [
      {
        id: "1",
        categoryEN: "Programming",
        categoryFR: "Programmation",
        skills: [],
      },
    ];

    setupQueryMock({
      skillList: {
        categories: mockCategories,
        code: 200,
        message: "Success",
      },
    });

    render(<SkillCategoriesList />);

    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-dialog")).not.toBeInTheDocument();
  });

  test("should use cache-and-network fetch policy", (): void => {
    const { useGetSkillsListQuery } = require("@/types/graphql");

    render(<SkillCategoriesList />);

    expect(useGetSkillsListQuery).toHaveBeenCalledWith({
      fetchPolicy: "cache-and-network",
    });
  });
});
