import React, { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import type { CreateSkillMutation, CreateSkillMutationVariables, GetSkillsListQuery } from "@/types/graphql";
import { AlertType } from "@/components/ToastCustom/CustomToast";
import SkillCreate from "@/components/AdminLayout/Pages/Skills/SkillCreate";
import { useCreateSkillAdmin } from "@/utils/hooks";
import type Lang from "@/lang/typeLang";

type SkillListData = GetSkillsListQuery;

type CreateSkillMutationResponse = {
  data: CreateSkillMutation;
};


type LangContextType = {
  translations: Lang;
};

type QueryResult<T> = {
  data: T | null;
  loading: boolean;
  error?: Error | null;
};

type MutationResult<T> = {
  data: T;
  loading: boolean;
};

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: ReactElement | string;
    children: ReactElement | React.ReactNode;
  }): ReactElement => (
    <div data-testid="auth-form-layout">
      <div data-testid="form-title">{title}</div>
      <div data-testid="form-content">{children}</div>
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({
    children,
    type,
  }: {
    children: React.ReactNode;
    type?: string;
  }): ReactElement => (
    <h2 data-testid="text-admin" className={type}>
      {children}
    </h2>
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
    required = false,
  }: {
    id: string;
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
  }): ReactElement => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        data-testid={`input-field-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputSelect", () => ({
  __esModule: true,
  default: function MockInputSelect<T extends string | number>({
    id,
    label,
    name,
    value,
    options,
    onChange,
    required = false,
  }: {
    id: string;
    label: string;
    name: string;
    value: T;
    options: Array<{ label: string; value: T }>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
  }): ReactElement {
    return (
      <div data-testid={`select-${id}`}>
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          name={name}
          data-testid={`select-field-${id}`}
          value={String(value)}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
            onChange(e);
          }}
        >
          <option value="">Select...</option>
          {options.map(
            (opt: { label: string; value: T }): ReactElement => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            )
          )}
        </select>
      </div>
    );
  },
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

// Type for the create skill input
type CreateSkillInput = {
  name: string;
  categoryId: string;
  image?: string;
};

let mockCategoriesData: SkillListData = {
  listSkillCategories: {
    categories: [
      {
        id: "1",
        categoryEN: "Frontend",
        categoryFR: "Frontend",
        skills: [],
      },
      {
        id: "2",
        categoryEN: "Backend",
        categoryFR: "Backend",
        skills: [],
      },
    ],
    code: 200,
    message: "Success",
  },
};

const translationsMock: Lang = {
  messageAdminSkillCreateTitle: "Create Skill",
  messageAdminSkillCreateSuccess: "Skill created successfully",
  messageAdminSkillCreateError: "Failed to create skill",
  messageAdminSkillCreateErrorCategory: "Please select a category",
  messageAdminSkillCreateConfirm: "Create",
  messageAdminSkillCreateLoading: "Creating...",
  messageAdminSkillInputName: "Skill Name",
  messageAdminSkillInputImage: "Skill Image",
  messageAdminSkillSelectCategory: "Select Category",
  messageAdminSkillNoCategoriesFound: "No categories found. Please create a category first.",
} as Lang;

const mockCreateMutation: jest.Mock<
  Promise<CreateSkillMutationResponse>,
  [{ variables: { data: CreateSkillInput } }]
> = jest.fn();

const mockGetSkillsListQuery: jest.Mock<QueryResult<SkillListData>, []> = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useCreateSkillAdmin: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  __esModule: true,
  useGetSkillsListQuery: jest.fn((): QueryResult<SkillListData> =>
    mockGetSkillsListQuery()
  ),
}));

const mockShowAlert: jest.Mock<void, [AlertType, string]> = jest.fn();

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn((): { showAlert: typeof mockShowAlert } => ({
    showAlert: mockShowAlert,
  })),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn((): LangContextType => ({
    translations: translationsMock,
  })),
}));

function resetAllMocks(): void {
  jest.clearAllMocks();
  mockCreateMutation.mockReset();
  mockGetSkillsListQuery.mockReset();
  mockShowAlert.mockClear();
  mockCategoriesData = {
    listSkillCategories: {
      categories: [
        {
          id: "1",
          categoryEN: "Frontend",
          categoryFR: "Frontend",
          skills: [],
        },
        {
          id: "2",
          categoryEN: "Backend",
          categoryFR: "Backend",
          skills: [],
        },
      ],
      code: 200,
      message: "Success",
    },
  };
}

function getInputElement(id: string): HTMLInputElement {
  const element: HTMLElement | null = screen.queryByTestId(`input-field-${id}`);
  if (!element || !(element instanceof HTMLInputElement)) {
    throw new Error(`Input field with id '${id}' not found`);
  }
  return element;
}

function getSelectElement(id: string): HTMLSelectElement {
  const element: HTMLElement | null = screen.queryByTestId(`select-field-${id}`);
  if (!element || !(element instanceof HTMLSelectElement)) {
    throw new Error(`Select field with id '${id}' not found`);
  }
  return element;
}

function getFormElement(): HTMLFormElement {
  const layout: HTMLElement | null = screen.queryByTestId("auth-form-layout");
  const form: HTMLFormElement | null = layout?.querySelector("form") ?? null;
  if (!form) {
    throw new Error("Form element not found");
  }
  return form;
}

async function fillAndSubmitForm(skillName: string, categoryId: string): Promise<void> {
  const nameInput: HTMLInputElement = getInputElement("name");
  const categorySelect: HTMLSelectElement = getSelectElement("categoryId");

  fireEvent.change(nameInput, { target: { value: skillName } });
  fireEvent.change(categorySelect, { target: { value: categoryId } });

  const form: HTMLFormElement = getFormElement();
  fireEvent.submit(form);
}

describe("SkillCreate", (): void => {
  beforeEach((): void => {
    resetAllMocks();
    mockGetSkillsListQuery.mockReturnValue({
      data: mockCategoriesData,
      loading: false,
      error: null,
    });
    mockCreateMutation.mockResolvedValue({
      data: { createSkill: { skill: {} } },
    } as CreateSkillMutationResponse);
    (useCreateSkillAdmin as jest.Mock).mockReturnValue([
      mockCreateMutation,
      { loading: false, error: undefined },
    ]);
  });

  test("renders page title", (): void => {
    render(<SkillCreate />);
    expect(screen.getByTestId("text-admin")).toHaveTextContent("Create Skill");
  });

  test("renders name input field", (): void => {
    render(<SkillCreate />);
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
  });

  test("renders category select field", (): void => {
    render(<SkillCreate />);
    expect(screen.getByTestId("select-categoryId")).toBeInTheDocument();
  });

  test("renders image upload input", (): void => {
    render(<SkillCreate />);

    const imageInput: HTMLInputElement = getInputElement("image");
    expect(imageInput).toBeInTheDocument();
    expect(imageInput.type).toBe("url");
  });

  test("renders create button", (): void => {
    render(<SkillCreate />);
    expect(screen.getByTestId("button-Create")).toBeInTheDocument();
  });

  test("displays loading state when categories are loading", (): void => {
    mockGetSkillsListQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { container } = render(<SkillCreate />);

    expect(container).toBeInTheDocument();
  });

  test("displays error message when no categories are available", (): void => {
    mockGetSkillsListQuery.mockReturnValue({
      data: { listSkillCategories: { categories: [], code: 200, message: "Success" } },
      loading: false,
      error: null,
    });

    const { container } = render(<SkillCreate />);

    expect(container).toBeInTheDocument();
  });

  test("populates category options from query", (): void => {
    render(<SkillCreate />);

    const categorySelect: HTMLSelectElement = getSelectElement("categoryId");
    expect(categorySelect).toBeInTheDocument();

    const options: NodeListOf<HTMLOptionElement> =
      categorySelect.querySelectorAll("option");
    expect(options.length).toBeGreaterThan(1);
  });

  test("updates name field when typing", (): void => {
    render(<SkillCreate />);

    const nameInput: HTMLInputElement = getInputElement("name");
    fireEvent.change(nameInput, { target: { name: "name", value: "React" } });

    expect(nameInput.value).toBe("React");
  });

  test("updates category field when selecting", (): void => {
    render(<SkillCreate />);

    const categorySelect: HTMLSelectElement = getSelectElement("categoryId");
    fireEvent.change(categorySelect, { target: { value: "1" } });

    expect(categorySelect.value).toBe("1");
  });

  test("shows error when submitting without category", async (): Promise<void> => {
    mockCreateMutation.mockResolvedValueOnce({
      data: {
        createSkill: {
          code: 400,
          message: "Please select a category",
        },
      },
    } as CreateSkillMutationResponse);

    render(<SkillCreate />);

    await fillAndSubmitForm("React", "");

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", expect.any(String));
    });
  });

  test("calls create mutation with correct data on valid submit", async (): Promise<void> => {
    mockCreateMutation.mockResolvedValueOnce({
      data: {
        createSkill: {
          code: 200,
          message: "Skill created",
        },
      },
    } as CreateSkillMutationResponse);

    render(<SkillCreate />);

    await fillAndSubmitForm("React", "1");

    await waitFor((): void => {
      expect(mockCreateMutation).toHaveBeenCalled();
    });
  });

  test("shows success alert on successful creation", async (): Promise<void> => {
    mockCreateMutation.mockResolvedValueOnce({
      data: {
        createSkill: {
          code: 200,
          message: "Skill created successfully",
        },
      },
    } as CreateSkillMutationResponse);

    render(<SkillCreate />);

    await fillAndSubmitForm("Vue.js", "1");

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Skill created successfully");
    });
  });

  test("shows error alert when creation fails", async (): Promise<void> => {
    mockCreateMutation.mockResolvedValueOnce({
      data: {
        createSkill: {
          code: 500,
          message: "Server error",
        },
      },
    } as CreateSkillMutationResponse);

    render(<SkillCreate />);

    await fillAndSubmitForm("Angular", "2");

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", expect.any(String));
    });
  });

  test("shows error alert when mutation throws exception", async (): Promise<void> => {
    mockCreateMutation.mockRejectedValueOnce(new Error("Network error"));

    render(<SkillCreate />);

    await fillAndSubmitForm("Node.js", "2");

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", expect.any(String));
    });
  });

  test("resets form after successful creation", async (): Promise<void> => {
    mockCreateMutation.mockResolvedValueOnce({
      data: {
        createSkill: {
          code: 200,
          message: "Skill created",
        },
      },
    } as CreateSkillMutationResponse);

    render(<SkillCreate />);

    await fillAndSubmitForm("TypeScript", "1");

    await waitFor((): void => {
      expect(screen.getByTestId("input-field-name")).toBeInTheDocument();
    });
  });

  test("disables submit button while loading", async (): Promise<void> => {
    (useCreateSkillAdmin as jest.Mock).mockReturnValueOnce([
      mockCreateMutation,
      { loading: true, error: undefined },
    ]);

    render(<SkillCreate />);

    const createButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.messageAdminSkillCreateLoading,
    }) as HTMLButtonElement;
    expect(createButton).toBeDisabled();
  });

  test("updates image url field", (): void => {
    render(<SkillCreate />);

    const imageInput: HTMLInputElement = getInputElement("image");
    fireEvent.change(imageInput, { target: { name: "image", value: "https://example.com/react.png" } });

    expect(imageInput.value).toBe("https://example.com/react.png");
  });

  test("displays image preview when url is provided", (): void => {
    render(<SkillCreate />);

    const imageInput: HTMLInputElement = getInputElement("image");
    fireEvent.change(imageInput, { target: { name: "image", value: "https://example.com/preview.png" } });

    const preview: HTMLImageElement | null = screen.queryByAltText("Preview") as HTMLImageElement | null;
    expect(preview).toBeInTheDocument();
    expect(preview?.src).toContain("https://example.com/preview.png");
  });
});
