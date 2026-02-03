import React, { type ReactElement, type ChangeEvent } from "react";
import { 
  render, 
  screen, 
  fireEvent, 
  waitFor,
} from '@testing-library/react';
import "@testing-library/jest-dom";
import type { GetSkillsListQuery, CreateProjectMutation, CreateProjectMutationVariables } from "@/types/graphql";
import { useCreateProjectAdmin, useUploadProjectMediaAdmin, useListSkillsAdmin } from "@/utils/hooks";

import ProjectCreate from "@/components/AdminLayout/Pages/Projects/ProjectCreate";
import type Lang from "@/lang/typeLang";

type SkillListData = GetSkillsListQuery;

type CreateProjectMutationResponse = {
  data: CreateProjectMutation;
};

const mockCreateProjectMutationFn: jest.Mock<
  Promise<CreateProjectMutationResponse>,
  [{ variables: CreateProjectMutationVariables }]
> = jest.fn();


let mockGetSkillsListQueryData: SkillListData = {
  listSkillCategories: {
    categories: [
      {
        id: "1",
        categoryFR: "Frontend",
        categoryEN: "Frontend",
        skills: [
          { id: "1", name: "React", image: "react.png", categoryId: 1 },
          { id: "2", name: "Vue.js", image: "vue.png", categoryId: 1 },
        ],
      },
      {
        id: "2",
        categoryFR: "Backend",
        categoryEN: "Backend",
        skills: [
          { id: "3", name: "Node.js", image: "nodejs.png", categoryId: 2 },
          { id: "4", name: "Python", image: "python.png", categoryId: 2 },
        ],
      },
    ],
    code: 200,
    message: "Success",
  },
};

const mockShowAlert: jest.Mock<void, ["success" | "error", string]> = jest.fn();

type AuthFormLayoutProps = {
  children: React.ReactNode;
};

type InputFieldProps = {
  id: string;
  name?: string;
  value: unknown;
  onChange: unknown;
};

type InputMultiSelectProps = {
  id: string;
  value: unknown;
  onChange: unknown;
};

type InputSelectProps = {
  id: string;
  name?: string;
  value: unknown;
  onChange: unknown;
};

type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
};


jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useCreateProjectAdmin: jest.fn(),
  useUploadProjectMediaAdmin: jest.fn(),
  useListSkillsAdmin: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  useGetSkillsListQuery: jest.fn(
    (): { data: SkillListData; loading: boolean } => ({
      data: mockGetSkillsListQueryData,
      loading: false,
    })
  ),
}));

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ children }: AuthFormLayoutProps): ReactElement => (
    <div data-testid="auth-form-layout">{children}</div>
  ),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({ id, name, value, onChange }: InputFieldProps): ReactElement => (
    <input
      data-testid={`input-${id}`}
      name={name || id}
      value={value as string | number}
      onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
    />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputMultiSelect", () => ({
  __esModule: true,
  default: ({ id, value, onChange }: InputMultiSelectProps): ReactElement => {
    const handleClick = (): void => {
      if (typeof onChange === "function") {
        onChange([1, 2]);
      }
    };
    return (
      <div data-testid={`multiselect-${id}`} onClick={handleClick}>
        <span>
          {Array.isArray(value) ? value.length : 0}
          {" skills selected"}
        </span>
      </div>
    );
  },
}));

jest.mock("@/components/AdminLayout/components/Input/InputSelect", () => ({
  __esModule: true,
  default: ({ id, name, value, onChange }: InputSelectProps): ReactElement => (
    <select
      data-testid={`select-${id}`}
      name={name || id}
      value={value as string | number}
      onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
    />
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({ text, onClick, type }: ButtonProps): ReactElement => (
    <button
      data-testid="submit-btn"
      onClick={onClick}
      type={type || "button"}
    >
      {text}
    </button>
  ),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: (): { showAlert: jest.Mock<void, ["success" | "error", string]> } => ({
    showAlert: mockShowAlert,
  }),
}));

interface LangContextValue {
  translations: Lang;
}

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): LangContextValue => ({
    translations: {
      messageAdminProjectCreateTitle: "Create Project",
      messageAdminProjectInputTitle: "Title",
      messageAdminProjectInputDescriptionFR: "Description FR",
      messageAdminProjectInputDescriptionEN: "Description EN",
      messageAdminProjectInputTypeDisplay: "Type Display",
      messageAdminProjectInputContentDisplay: "Content Display",
      messageAdminProjectInputGithub: "GitHub URL",
      messageAdminProjectInputSkills: "Skills",
      messageAdminProjectCreateSuccess: "Project created successfully",
      messageAdminProjectCreateError: "Error creating project",
      messageAdminProjectCreateErrorSkills: "Please select at least one skill",
    } as Lang,
  }),
}));

describe("ProjectCreate", (): void => {
  const translationsMock: Lang = {
    messageAdminProjectCreateTitle: "Create Project",
    messageAdminProjectInputTitle: "Title",
    messageAdminProjectInputDescriptionFR: "Description FR",
    messageAdminProjectInputDescriptionEN: "Description EN",
    messageAdminProjectInputTypeDisplay: "Type Display",
    messageAdminProjectInputContentDisplay: "Content Display",
    messageAdminProjectInputGithub: "GitHub URL",
    messageAdminProjectInputSkills: "Skills",
    messageAdminProjectCreateSuccess: "Project created successfully",
    messageAdminProjectCreateError: "Error creating project",
  } as Lang;

  const resetMockData = (): void => {
    mockGetSkillsListQueryData = {
      listSkillCategories: {
        categories: [
          {
            id: "1",
            categoryFR: "Frontend",
            categoryEN: "Frontend",
            skills: [
              { id: "1", name: "React", image: "react.png", categoryId: 1 },
              { id: "2", name: "Vue.js", image: "vue.png", categoryId: 1 },
            ],
          },
          {
            id: "2",
            categoryFR: "Backend",
            categoryEN: "Backend",
            skills: [
              { id: "3", name: "Node.js", image: "nodejs.png", categoryId: 2 },
              { id: "4", name: "Python", image: "python.png", categoryId: 2 },
            ],
          },
        ],
        code: 200,
        message: "Success",
      },
    };
  };

  const clearAllMocks = (): void => {
    jest.clearAllMocks();
    mockCreateProjectMutationFn.mockReset();
    mockShowAlert.mockReset();
    resetMockData();
  };

  const getInputElement = (testId: string): HTMLInputElement => {
    const element: HTMLElement = screen.getByTestId(testId);
    if (!(element instanceof HTMLInputElement)) {
      throw new Error(`Element with testId "${testId}" is not an HTMLInputElement`);
    }
    return element;
  };

  const getMultiselectElement = (testId: string): HTMLElement => {
    const element: HTMLElement | null = screen.queryByTestId(testId);
    if (!element) {
      throw new Error(`Element with testId "${testId}" not found`);
    }
    return element;
  };

  beforeEach((): void => {
    clearAllMocks();
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);
    (useCreateProjectAdmin as jest.Mock).mockReturnValue([
      mockCreateProjectMutationFn,
      { loading: false, error: undefined },
    ]);
    (useUploadProjectMediaAdmin as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({ data: { uploadProjectMedia: { success: true } } }),
      { loading: false, error: undefined },
    ]);
    (useListSkillsAdmin as jest.Mock).mockReturnValue({
      data: mockGetSkillsListQueryData,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    });
  });

  test("renders create form", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
  });

  test("displays title input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("input-title")).toBeInTheDocument();
  });

  test("displays description FR input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("input-descriptionFR")).toBeInTheDocument();
  });

  test("displays description EN input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("input-descriptionEN")).toBeInTheDocument();
  });

  test("displays type display select field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("select-typeDisplay")).toBeInTheDocument();
  });

  test("displays content display select field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("select-contentDisplay")).toBeInTheDocument();
  });

  test("displays github URL input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("input-github")).toBeInTheDocument();
  });

  test("displays skills multi-select field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("multiselect-skillIds")).toBeInTheDocument();
  });

  test("displays submit button", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  test("updates form state on input change", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    expect(titleInput.value).toBe("New Project");
  });

  test("calls mutation on form submit", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: { id: "1", title: "New Project", descriptionFR: "Description FR", descriptionEN: "Description EN", typeDisplay: "grid", contentDisplay: "card", github: null, image: null, video: null, skills: [] } } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = getInputElement("input-descriptionFR");
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = getInputElement("input-descriptionEN");
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    const skillsMultiSelect: HTMLElement = getMultiselectElement("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
    });
  });

  test("validates form before submission", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const submitBtn: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        "Please select at least one skill"
      );
      expect(mockCreateProjectMutationFn).not.toHaveBeenCalled();
    });
  });

  test("handles creation success", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Project created successfully", project: { id: "1", title: "New Project", descriptionFR: "Description FR", descriptionEN: "Description EN", typeDisplay: "grid", contentDisplay: "card", github: null, image: null, video: null, skills: [] } } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = getInputElement("input-descriptionFR");
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = getInputElement("input-descriptionEN");
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    const skillsMultiSelect: HTMLElement = getMultiselectElement("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Project created successfully"
      );
    });
  });

  test("handles creation error", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 500, message: "Server error" } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = getInputElement("input-descriptionFR");
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = getInputElement("input-descriptionEN");
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    const skillsMultiSelect: HTMLElement = getMultiselectElement("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Server error");
    });
  });

  test("clears form after successful submission", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: { id: "1", title: "New Project", descriptionFR: "Description FR", descriptionEN: "Description EN", typeDisplay: "grid", contentDisplay: "card", github: null, image: null, video: null, skills: [] } } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = getInputElement("input-descriptionFR");
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = getInputElement("input-descriptionEN");
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    const skillsMultiSelect: HTMLElement = getMultiselectElement("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLElement = screen.getByTestId("submit-btn");
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
      expect(titleInput.value).toBe("");
    });
  });

  test("handles all form fields together", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    const frInput: HTMLInputElement = getInputElement("input-descriptionFR");
    const enInput: HTMLInputElement = getInputElement("input-descriptionEN");
    const githubInput: HTMLInputElement = getInputElement("input-github");

    fireEvent.change(titleInput, { target: { value: "Project" } });
    fireEvent.change(frInput, { target: { value: "Description FR" } });
    fireEvent.change(enInput, { target: { value: "Description EN" } });
    fireEvent.change(githubInput, { target: { value: "https://github.com/test" } });

    expect(titleInput.value).toBe("Project");
    expect(frInput.value).toBe("Description FR");
    expect(enInput.value).toBe("Description EN");
    expect(githubInput.value).toBe("https://github.com/test");
  });

  test("displays initial empty state", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");
    expect(titleInput.value).toBe("");
  });

  test("displays form title", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
  });

  test("handles rapid form changes", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = getInputElement("input-title");

    fireEvent.change(titleInput, { target: { value: "Project 1" } });
    fireEvent.change(titleInput, { target: { value: "Project 2" } });
    fireEvent.change(titleInput, { target: { value: "Project 3" } });

    expect(titleInput.value).toBe("Project 3");
  });

  test("handles optional github URL field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const githubInput: HTMLInputElement = getInputElement("input-github");
    expect(githubInput.value).toBe("");

    fireEvent.change(githubInput, { target: { value: "https://github.com/project" } });
    expect(githubInput.value).toBe("https://github.com/project");
  });

  test("requires skills field validation", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const multiSelectSkills: HTMLElement = getMultiselectElement("multiselect-skillIds");
    expect(multiSelectSkills).toBeInTheDocument();
    expect(multiSelectSkills).toHaveTextContent("0 skills selected");
  });
});
