import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import SkillCategoryEditModal from "@/components/AdminLayout/components/SkillCategory/SkillCategoryEditModal";
import Lang from "@/lang/typeLang";
// import type { Skill as SkillCategory } from "@/store/slices/skillsSlice";
interface Skill {
  id: string;
  name: string;
}

interface SkillCategory {
  id: number;
  categoryEN: string;
  categoryFR: string;
  skills?: Skill[];
  skillCount: number;
}

interface UpdateCategoryResponse {
  data: {
    updateSkillCategory: {
      code: number;
      message: string;
    };
  };
}

interface SkillCategoryByIdData {
  skillCategory: SkillCategory;
}

interface LangContextType {
  translations: Lang;
}

jest.mock("@/components/ModalCustom/ModalCustom", (): object => ({
  __esModule: true,
  default: (props: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
  }): ReactElement | null =>
    props.open ? (
      <div data-testid="modal">{props.children}</div>
    ) : null,
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", (): object => ({
  __esModule: true,
  default: (props: { children: React.ReactNode }): ReactElement => (
    <h2 data-testid="text-admin">{props.children}</h2>
  ),
}));

jest.mock("@/components/InputField/InputField", (): object => ({
  __esModule: true,
  default: (props: {
    id: string;
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }): ReactElement => (
    <input
      data-testid={`input-${props.id}`}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
    />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputMultiSelect", (): object => ({
  __esModule: true,
  default: (props: {
    id: string;
    label: string;
    value: any;
    options: any[];
    onChange: (selected: Array<string | number>) => void;
    onSearch?: (term: string) => Promise<any[]>;
  }): ReactElement => (
    <div data-testid={`multi-select-${props.id}`}>
      {props.options.map((opt: any) => (
        <input key={opt.value} type="checkbox" value={opt.value} />
      ))}
    </div>
  ),
}));

jest.mock("@/components/Button/Button", (): object => ({
  __esModule: true,
  default: (props: { text: string; onClick?: () => void }): ReactElement => (
    <button data-testid="btn-action" onClick={props.onClick}>
      {props.text}
    </button>
  ),
}));

jest.mock("@/components/Loading/Loading", (): object => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

const mockUpdateCategoryMutation: jest.Mock<
  Promise<UpdateCategoryResponse>,
  [any]
> = jest.fn();

const mockGetCategoryByIdQuery: jest.Mock<any, []> = jest.fn();

const mockGetSkillsListQuery: jest.Mock<any, []> = jest.fn();

const mockSearchSkillsLazyQuery: jest.Mock<any, any[]> = jest.fn();

jest.mock("@/types/graphql", (): object => ({
  useUpdateSkillCategoryMutation: (): [typeof mockUpdateCategoryMutation] => [
    mockUpdateCategoryMutation,
  ],
  useGetSkillCategoryByIdQuery: (): any => mockGetCategoryByIdQuery(),
  useGetSkillsListQuery: (): any => mockGetSkillsListQuery(),
  useSearchSkillsLazyQuery: (): [typeof mockSearchSkillsLazyQuery, any] => [
    mockSearchSkillsLazyQuery,
    { data: null, loading: false },
  ],
}));

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn((): LangContextType => ({
    translations: {
      messageAdminSkillCategoryEditTitle: "Edit Category",
      messageAdminSkillCategoryInputEN: "Category Name (EN)",
      messageAdminSkillCategoryInputFR: "Category Name (FR)",
      messageAdminSkillCategorySelectSkills: "Skills",
      messageAdminSkillCategoryEditConfirm: "Save",
      messageAdminSkillCategoryEditCancel: "Cancel",
      messageAdminSkillCategoryEditSuccess: "Updated",
      messageAdminSkillCategoryEditError: "Error",
    } as unknown as Lang,
  })),
}));

jest.mock("@/components/ToastCustom/CustomToast", (): object => ({
  __esModule: true,
  default: (): { showAlert: jest.Mock<void, ["success" | "error", string]> } => ({
    showAlert: jest.fn(),
  }),
}));

function getInputElement(id: string): HTMLInputElement {
  const element: HTMLElement | null = screen.queryByTestId(`input-${id}`);
  if (!element || !(element instanceof HTMLInputElement)) {
    throw new Error(`Input field with id '${id}' not found`);
  }
  return element;
}

function getActionButton(): HTMLButtonElement {
  const buttons: HTMLElement[] = screen.getAllByTestId("btn-action");
  const element: HTMLElement | undefined = buttons[buttons.length - 1];
  if (!element || !(element instanceof HTMLButtonElement)) {
    throw new Error("Action button not found");
  }
  return element;
}

describe("SkillCategoryEditModal", (): void => {
  const mockCategory: SkillCategory = {
    id: 1,
    categoryEN: "Frontend",
    categoryFR: "Frontal",
    skills: [
      { id: "1", name: "React" },
      { id: "2", name: "TypeScript" },
    ],
    skillCount: 2,
  };

  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(
    async (): Promise<void> => undefined
  );

  beforeEach((): void => {
    jest.clearAllMocks();
    mockUpdateCategoryMutation.mockResolvedValue({
      data: { updateSkillCategory: { code: 200, message: "Updated" } },
    });
    mockGetCategoryByIdQuery.mockReturnValue({
      data: {
        skillCategoryById: {
          categories: [
            {
              id: mockCategory.id,
              categoryEN: mockCategory.categoryEN,
              categoryFR: mockCategory.categoryFR,
              skills: mockCategory.skills,
            },
          ],
        },
      },
      loading: false,
    });
    mockGetSkillsListQuery.mockReturnValue({
      data: {
        skillList: {
          categories: [
            {
              id: "1",
              categoryEN: "Frontend",
              categoryFR: "Frontend",
              skills: mockCategory.skills,
            },
          ],
        },
      },
      loading: false,
    });
  });

  it("should not render when category is null", (): void => {
    render(
      <SkillCategoryEditModal
        category={null}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render modal when category is provided", (): void => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should populate form with category data", async (): Promise<void> => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const enInput: HTMLInputElement = await screen.findByTestId("input-categoryEN") as HTMLInputElement;
    const frInput: HTMLInputElement = await screen.findByTestId("input-categoryFR") as HTMLInputElement;
    expect(enInput).toHaveValue("Frontend");
    expect(frInput).toHaveValue("Frontal");
  });

  it("should display edit title", async (): Promise<void> => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const title: HTMLElement = await screen.findByTestId("text-admin");
    expect(title).toHaveTextContent("Edit Category");
  });

  it("should render skills multiselect", async (): Promise<void> => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const multiSelect: HTMLElement = await screen.findByTestId("multi-select-skillIds");
    expect(multiSelect).toBeInTheDocument();
  });

  it("should allow editing EN field", async (): Promise<void> => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("input-categoryEN");
    const enInput: HTMLInputElement = getInputElement("categoryEN");
    fireEvent.change(enInput, { target: { value: "Updated" } });

    expect(enInput.value).toBe("Updated");
  });

  it("should allow editing FR field", async (): Promise<void> => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("input-categoryFR");
    const frInput: HTMLInputElement = getInputElement("categoryFR");
    fireEvent.change(frInput, { target: { value: "Mis à jour" } });

    expect(frInput.value).toBe("Mis à jour");
  });

  it("should call mutation on save", async (): Promise<void> => {
    render(
      <SkillCategoryEditModal
        category={mockCategory}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("text-admin");
    const saveButton: HTMLButtonElement = getActionButton();
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockUpdateCategoryMutation).toHaveBeenCalled();
    });
  });
});
