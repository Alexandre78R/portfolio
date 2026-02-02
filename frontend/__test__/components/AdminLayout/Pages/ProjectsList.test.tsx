import React, { type ReactElement, type ChangeEvent } from "react";
import { 
  render, 
  screen, 
  fireEvent, 
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import type { GetSkillsListQuery, CreateProjectMutation, CreateProjectMutationVariables } from "@/types/graphql";
import { useCreateProjectAdmin } from "@/utils/hooks";

import ProjectCreate from "@/components/AdminLayout/Pages/Projects/ProjectCreate";
import type Lang from "@/lang/typeLang";

type SkillsListData = GetSkillsListQuery;

type CreateProjectMutationResponse = {
  data: CreateProjectMutation;
};

const mockCreateProjectMutationFn: jest.Mock<
  Promise<CreateProjectMutationResponse>,
  [{ variables: CreateProjectMutationVariables }]
> = jest.fn();

const mockShowAlert: jest.Mock<void, ["success" | "error", string]> = jest.fn();

let mockGetSkillsListQueryData: SkillsListData = {
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

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useCreateProjectAdmin: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  useGetSkillsListQuery: jest.fn(
    (): { data: SkillsListData; loading: boolean } => ({
      data: mockGetSkillsListQueryData,
      loading: false,
    })
  ),
}));

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): ReactElement => (
    <div data-testid="auth-form-layout">{children}</div>
  ),
}));

type InputFieldProps = {
  id: string;
  name?: string;
  value: unknown;
  onChange: unknown;
};

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

type InputMultiSelectProps = {
  id: string;
  value: unknown;
  onChange: unknown;
};

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

type InputSelectProps = {
  id: string;
  name?: string;
  value: unknown;
  onChange: unknown;
};

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

type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

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

const translationsMock = {
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
  messageErrorServerOff: "Server error",
  messageAdminProjectCreateLoading: "Creating...",
  messageAdminProjectCreateConfirm: "Create",
} as Lang;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: translationsMock,
  }),
}));

describe("ProjectCreate", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    mockCreateProjectMutationFn.mockReset();
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200 } },
    } as CreateProjectMutationResponse);
    mockShowAlert.mockReset();
    (useCreateProjectAdmin as jest.Mock).mockReturnValue({
      createProject: mockCreateProjectMutationFn,
      loading: false,
    });
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
  });

  test("should render create form", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const authFormLayout: HTMLElement = screen.getByTestId("auth-form-layout");
    expect(authFormLayout).toBeInTheDocument();
  });

  test("should display title input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLElement = screen.getByTestId("input-title");
    expect(titleInput).toBeInTheDocument();
  });

  test("should display description FR input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const descriptionFRInput: HTMLElement = screen.getByTestId("input-descriptionFR");
    expect(descriptionFRInput).toBeInTheDocument();
  });

  test("should display description EN input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const descriptionENInput: HTMLElement = screen.getByTestId("input-descriptionEN");
    expect(descriptionENInput).toBeInTheDocument();
  });

  test("should display type display select field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const typeDisplaySelect: HTMLElement = screen.getByTestId("select-typeDisplay");
    expect(typeDisplaySelect).toBeInTheDocument();
  });

  test("should display content display select field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const contentDisplaySelect: HTMLElement = screen.getByTestId("select-contentDisplay");
    expect(contentDisplaySelect).toBeInTheDocument();
  });

  test("should display github URL input field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const githubInput: HTMLElement = screen.getByTestId("input-github");
    expect(githubInput).toBeInTheDocument();
  });

  test("should display skills multi-select field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const skillsMultiSelect: HTMLElement = screen.getByTestId("multiselect-skillIds");
    expect(skillsMultiSelect).toBeInTheDocument();
  });

  test("should display submit button", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const submitButton: HTMLElement = screen.getByTestId("submit-btn");
    expect(submitButton).toBeInTheDocument();
  });

  test("should update form state on input change", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    expect(titleInput.value).toBe("New Project");
  });

  test("should call mutation on form submit with valid data", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Project created", project: { id: "1", title: "New Project", descriptionFR: "Description FR", descriptionEN: "Description EN", typeDisplay: "grid", contentDisplay: "card", github: null, image: null, video: null, skills: [] } } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    // Fill required fields
    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = screen.getByTestId("input-descriptionFR") as HTMLInputElement;
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = screen.getByTestId("input-descriptionEN") as HTMLInputElement;
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    // Select skills
    const skillsMultiSelect: HTMLElement = screen.getByTestId("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLButtonElement = screen.getByTestId("submit-btn") as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
    });
  });

  test("should validate form and show error when skills are missing", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const submitBtn: HTMLButtonElement = screen.getByTestId("submit-btn") as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "error",
        "Please select at least one skill"
      );
      expect(mockCreateProjectMutationFn).not.toHaveBeenCalled();
    });
  });

  test("should handle creation success correctly", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: { id: "1", title: "New Project", descriptionFR: "Description FR", descriptionEN: "Description EN", typeDisplay: "grid", contentDisplay: "card", github: null, image: null, video: null, skills: [] } } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = screen.getByTestId("input-descriptionFR") as HTMLInputElement;
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = screen.getByTestId("input-descriptionEN") as HTMLInputElement;
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    const skillsMultiSelect: HTMLElement = screen.getByTestId("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLButtonElement = screen.getByTestId("submit-btn") as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        "Project created successfully"
      );
    });
  });

  test("should handle creation error correctly", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 500, message: "Server error", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = screen.getByTestId("input-descriptionFR") as HTMLInputElement;
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = screen.getByTestId("input-descriptionEN") as HTMLInputElement;
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    // Select skills
    const skillsMultiSelect: HTMLElement = screen.getByTestId("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLButtonElement = screen.getByTestId("submit-btn") as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Server error");
    });
  });

  test("should clear form after successful submission", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: { id: "1", title: "New Project", descriptionFR: "Description FR", descriptionEN: "Description EN", typeDisplay: "grid", contentDisplay: "card", github: null, image: null, video: null, skills: [] } } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);
    
    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "New Project" } });

    const frInput: HTMLInputElement = screen.getByTestId("input-descriptionFR") as HTMLInputElement;
    fireEvent.change(frInput, { target: { value: "Description FR" } });

    const enInput: HTMLInputElement = screen.getByTestId("input-descriptionEN") as HTMLInputElement;
    fireEvent.change(enInput, { target: { value: "Description EN" } });

    // Select skills
    const skillsMultiSelect: HTMLElement = screen.getByTestId("multiselect-skillIds");
    fireEvent.click(skillsMultiSelect);

    const submitBtn: HTMLButtonElement = screen.getByTestId("submit-btn") as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor((): void => {
      expect(mockCreateProjectMutationFn).toHaveBeenCalled();
      expect(titleInput.value).toBe("");
    });
  });

  test("should handle all form fields together", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    const frInput: HTMLInputElement = screen.getByTestId("input-descriptionFR") as HTMLInputElement;
    const enInput: HTMLInputElement = screen.getByTestId("input-descriptionEN") as HTMLInputElement;
    const githubInput: HTMLInputElement = screen.getByTestId("input-github") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "Project" } });
    fireEvent.change(frInput, { target: { value: "Description FR" } });
    fireEvent.change(enInput, { target: { value: "Description EN" } });
    fireEvent.change(githubInput, { target: { value: "https://github.com/test" } });

    expect(titleInput.value).toBe("Project");
    expect(frInput.value).toBe("Description FR");
    expect(enInput.value).toBe("Description EN");
    expect(githubInput.value).toBe("https://github.com/test");
  });

  test("should display initial empty state", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    expect(titleInput.value).toBe("");
  });

  test("should display form title", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const authFormLayout: HTMLElement = screen.getByTestId("auth-form-layout");
    expect(authFormLayout).toBeInTheDocument();
  });

  test("should handle rapid form changes", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "Project 1" } });
    fireEvent.change(titleInput, { target: { value: "Project 2" } });
    fireEvent.change(titleInput, { target: { value: "Project 3" } });

    expect(titleInput.value).toBe("Project 3");
  });

  test("should handle optional github URL field", (): void => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const githubInput: HTMLInputElement = screen.getByTestId("input-github") as HTMLInputElement;
    expect(githubInput.value).toBe("");

    fireEvent.change(githubInput, { target: { value: "https://github.com/project" } });
    expect(githubInput.value).toBe("https://github.com/project");
  });

  test("should require skills field validation", async (): Promise<void> => {
    mockCreateProjectMutationFn.mockResolvedValue({
      data: { createProject: { code: 200, message: "Success", project: null } },
    } as CreateProjectMutationResponse);

    render(<ProjectCreate />);

    const multiSelectSkills: HTMLElement = screen.getByTestId("multiselect-skillIds");
    expect(multiSelectSkills).toBeInTheDocument();
    expect(multiSelectSkills).toHaveTextContent("0 skills selected");
  });
});
