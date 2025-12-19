import React, { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@test-utils';
import "@testing-library/jest-dom";
import type { CreateSkillCategoryMutation, CreateSkillCategoryMutationVariables, GetSkillsListQuery } from "@/types/graphql";

import SkillCategoryCreate from "@/components/AdminLayout/Pages/Skills/Categories/SkillCategoryCreate";
import type Lang from "@/lang/typeLang";
import {
  GetSkillsListDocument,
  CreateSkillCategoryDocument,
} from "@/types/graphql";

type SkillListData = GetSkillsListQuery;

type CreateSkillCategoryMutationResponse = {
  data: CreateSkillCategoryMutation;
};


jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ title, children }: { title: ReactElement; children: ReactElement }) => (
    <div data-testid="auth-form-layout">
      <div data-testid="form-title">{title}</div>
      <div data-testid="form-content">{children}</div>
    </div>
  ),
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

jest.mock("@/components/AdminLayout/components/Input/InputMultiSelect", () => ({
  __esModule: true,
  default: function MockInputMultiSelect<T extends string | number>({
    id,
    label,
    value,
    options,
    onChange,
  }: {
    id: string;
    label: string;
    value: T[];
    options: Array<{ label: string; value: T }>;
    onChange: (selected: T[]) => void;
  }): ReactElement {
    return (
      <div data-testid={`multi-select-${id}`}>
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          multiple
          data-testid={`multi-select-field-${id}`}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
            const selected: T[] = Array.from(e.target.selectedOptions).map(
              (opt: HTMLOptionElement) => {
                const parsed: T | unknown = isNaN(Number(opt.value))
                  ? opt.value
                  : Number(opt.value);
                return parsed as T;
              }
            );
            onChange(selected);
          }}
          value={value.map(String)}
        >
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

const mockShowAlert = jest.fn();

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showAlert: mockShowAlert,
  })),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminSkillCategoryCreateTitle: "Create Skill Category",
      messageAdminSkillCategoryCreateConfirm: "Create",
      messageAdminSkillCategoryCreateLoading: "Creating...",
      messageAdminSkillCategoryCreateSuccess: "Skill category created successfully",
      messageAdminSkillCategoryCreateError: "Failed to create skill category",
      messageAdminSkillCategorySelectSkills: "Select skills (optional)",
      messageErrorServerOff: "Server error",
    } as Lang,
  })),
}));

const createMocks = (mutationResult: any = { code: 200, message: "Created" }) => [
  {
    request: {
      query: GetSkillsListDocument,
    },
    result: {
      data: {
        skillList: {
          categories: [
            {
              __typename: "SkillCategory",
              id: "1",
              categoryEN: "Programming",
              categoryFR: "Programmation",
              skills: [
                { __typename: "Skill", id: "1", name: "JavaScript", image: null, categoryId: "1" },
                { __typename: "Skill", id: "2", name: "TypeScript", image: null, categoryId: "1" },
              ],
            },
            {
              __typename: "SkillCategory",
              id: "2",
              categoryEN: "Design",
              categoryFR: "Design",
              skills: [
                { __typename: "Skill", id: "3", name: "Figma", image: null, categoryId: "2" },
                { __typename: "Skill", id: "4", name: "Photoshop", image: null, categoryId: "2" },
              ],
            },
          ],
          __typename: "SkillListResponse",
          code: 200,
          message: "Success",
        },
      },
    },
  },
  {
    request: {
      query: CreateSkillCategoryDocument,
      variables: {
        data: {
          categoryEN: "Programming",
          categoryFR: "Programmation",
        },
      },
    },
    result: {
      data: {
        createCategory: mutationResult,
      },
    },
  },
];


describe("SkillCategoryCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowAlert.mockClear();
  });

  test("should render form layout", () => {
    render(<SkillCategoryCreate />, { mocks: createMocks() });
    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
    expect(screen.getByText("Create Skill Category")).toBeInTheDocument();
  });

  test("should render all input fields", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks() });
    
    await waitFor(() => {
      expect(screen.getByTestId("input-categoryEN")).toBeInTheDocument();
      expect(screen.getByTestId("input-categoryFR")).toBeInTheDocument();
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });
  });

  test("should render submit button", () => {
    render(<SkillCategoryCreate />, { mocks: createMocks() });
    expect(screen.getByTestId("button-Create")).toBeInTheDocument();
  });

  test("should update form fields on input change", () => {
    render(<SkillCategoryCreate />, { mocks: createMocks() });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });

    expect(categoryENInput.value).toBe("Programming");
    expect(categoryFRInput.value).toBe("Programmation");
  });

  test("should render skills from query data", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks() });

    await waitFor(() => {
      const multiSelect: HTMLSelectElement = screen.getByTestId("multi-select-field-skillIds") as HTMLSelectElement;
      const options = multiSelect.querySelectorAll("option");

      expect(options.length).toBe(4);
      expect(options[0].textContent).toBe("JavaScript");
      expect(options[1].textContent).toBe("TypeScript");
      expect(options[2].textContent).toBe("Figma");
      expect(options[3].textContent).toBe("Photoshop");
    });
  });

  test("should call mutation on form submit with correct data", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks({ code: 200, message: "Created" }) });

    await waitFor(() => {
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Skill category created successfully"
      );
    });
  });

  test("should call mutation with skillIds when skills are selected", async () => {
    const mocks = [
      ...createMocks({ code: 200, message: "Created" }),
      {
        request: {
          query: CreateSkillCategoryDocument,
          variables: {
            data: {
              categoryEN: "Programming",
              categoryFR: "Programmation",
              skillIds: [1, 2],
            },
          },
        },
        result: {
          data: {
            createCategory: { code: 200, message: "Created" },
          },
        },
      },
    ];

    render(<SkillCategoryCreate />, { mocks });

    await waitFor(() => {
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;
    const multiSelect: HTMLSelectElement = screen.getByTestId("multi-select-field-skillIds") as HTMLSelectElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });

    const options: NodeListOf<HTMLOptionElement> = multiSelect.querySelectorAll("option");
    (Array.from(options) as HTMLOptionElement[]).forEach(opt => {
      if (opt.value === "1" || opt.value === "2") {
        opt.selected = true;
      }
    });
    fireEvent.change(multiSelect);

    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalled();
    });
  });

  test("should show success message on successful creation", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks({ code: 200, message: "Created" }) });

    await waitFor(() => {
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Skill category created successfully"
      );
    });
  });

  test("should show error message on failed creation", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks({ code: 400, message: "Error occurred" }) });

    await waitFor(() => {
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Error occurred");
    });
  });

  test("should reset form after successful creation", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks({ code: 200, message: "Created" }) });

    await waitFor(() => {
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(categoryENInput.value).toBe("");
      expect(categoryFRInput.value).toBe("");
    });
  });

  test("should show loading indicator for skills", () => {
    render(<SkillCategoryCreate />, { mocks: createMocks() });
    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
  });

  test("should handle mutation error", async () => {
    render(<SkillCategoryCreate />, { mocks: createMocks({ code: 500, message: "Server error" }) });

    await waitFor(() => {
      expect(screen.getByTestId("multi-select-skillIds")).toBeInTheDocument();
    });

    const categoryENInput: HTMLInputElement = screen.getByTestId("input-field-categoryEN") as HTMLInputElement;
    const categoryFRInput: HTMLInputElement = screen.getByTestId("input-field-categoryFR") as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;

    fireEvent.change(categoryENInput, { target: { value: "Programming" } });
    fireEvent.change(categoryFRInput, { target: { value: "Programmation" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Server error");
    });
  });

  test("should not render multiselect when no skills available", () => {
    const emptyMocks = [
      {
        request: {
          query: GetSkillsListDocument,
        },
        result: {
          data: {
            skillList: {
              categories: [],
              __typename: "SkillListResponse",
              code: 200,
              message: "Success",
            },
          },
        },
      },
    ];

    render(<SkillCategoryCreate />, { mocks: emptyMocks });
    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
  });
});
