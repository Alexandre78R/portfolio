import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import ProjectEditModal from "@/components/AdminLayout/components/Project/ProjectEditModal";
import Lang from "@/lang/typeLang";

export interface ProjectRow {
  id: number;
  title: string;
  descriptionFR: string;
  descriptionEN: string;
  typeDisplay: string;
  contentDisplay: string;
  github: string;
  skills: Array<{ id: string; name: string; image: string }>;
}

jest.mock("@/components/ModalCustom/ModalCustom", (): object => ({
  __esModule: true,
  default: (props: { children: React.ReactNode; open: boolean; onClose: () => void }): React.ReactElement | null =>
    props.open ? <div data-testid="modal">{props.children}</div> : null,
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", (): object => ({
  __esModule: true,
  default: (props: { children: React.ReactNode }): React.ReactElement =>
    <h2 data-testid="text-admin">{props.children}</h2>,
}));

jest.mock("@/components/InputField/InputField", (): object => ({
  __esModule: true,
  default: (props: { id: string; label: string; name?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }): React.ReactElement => (
    <input data-testid={`input-${props.id}`} name={props.name || props.id} value={props.value} onChange={props.onChange} />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputSelect", (): object => ({
  __esModule: true,
  default: (props: { id: string; label: string; name?: string; value: any; options: any[]; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }): React.ReactElement => (
    <select data-testid={`select-${props.id}`} name={props.name || props.id} value={props.value} onChange={props.onChange}>
      {props.options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputMultiSelect", (): object => ({
  __esModule: true,
  default: (props: { id: string; label: string; value: any; options: any[]; onChange?: (selected: number[]) => void }): React.ReactElement => (
    <div data-testid={`multiselect-${props.id}`}>
      {props.options.map((opt: any) => (
        <input key={opt.value} type="checkbox" value={opt.value} />
      ))}
    </div>
  ),
}));

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn(() => ({
    translations: {
      editProject: "Edit Project",
      projectTitle: "Project Title",
      descriptionFR: "Description (FR)",
      descriptionEN: "Description (EN)",
      typeDisplay: "Type Display",
      contentDisplay: "Content Display",
      github: "GitHub",
      skills: "Skills",
      save: "Save",
      cancel: "Cancel",
    } as unknown as Lang,
  })),
}));

jest.mock("@/components/ToastCustom/CustomToast", (): object => ({
  __esModule: true,
  default: (): { showAlert: jest.Mock<void, ["success" | "error", string]> } => ({
    showAlert: jest.fn(),
  }),
}));

jest.mock("@/components/Button/Button", (): object => ({
  __esModule: true,
  default: (props: { text: string; onClick?: () => void }): React.ReactElement =>
    <button data-testid="btn-action" onClick={props.onClick}>{props.text}</button>,
}));

jest.mock("@/components/Loading/Loading", (): object => ({
  __esModule: true,
  default: (): React.ReactElement => <div data-testid="loading">Loading...</div>,
}));

const mockUpdateProjectMutation: jest.Mock<Promise<any>, any[]> = jest.fn();

jest.mock("@/types/graphql", (): object => ({
  useUpdateProjectMutation: (): [jest.Mock<Promise<any>, any[]>, { loading: boolean }] => [
    mockUpdateProjectMutation,
    { loading: false },
  ],
  useGetSkillsListQuery: jest.fn(),
}));

describe("ProjectEditModal", (): void => {
  const mockProject: ProjectRow = {
    id: 1,
    title: "Test Project",
    descriptionFR: "Description FR",
    descriptionEN: "Description EN",
    typeDisplay: "image",
    contentDisplay: "full",
    github: "https://github.com/test",
    skills: [
      { id: "1", name: "React", image: "react.png" },
      { id: "2", name: "TypeScript", image: "ts.png" },
    ],
  };

  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(async () => undefined);

  beforeEach((): void => {
    jest.clearAllMocks();
    
    mockUpdateProjectMutation.mockResolvedValue({
      data: { updateProject: { code: 200, message: "Updated" } },
    });
    
    const { useGetSkillsListQuery } = require("@/types/graphql");
    (useGetSkillsListQuery as jest.Mock).mockReturnValue({
      data: {
        listSkillCategories: {
          categories: [],
          code: 200,
          message: "Success",
        },
      },
      loading: false,
    });
  });

  it("should not render when project is null", (): void => {
    render(
      <ProjectEditModal project={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render modal when project is provided", (): void => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("text-admin")).toHaveTextContent("Edit Project");
  });

  it("should populate form with project data", (): void => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByTestId("input-title")).toHaveValue("Test Project");
    expect(screen.getByTestId("input-descriptionFR")).toHaveValue("Description FR");
    expect(screen.getByTestId("input-descriptionEN")).toHaveValue("Description EN");
  });

  it("should populate all description fields", (): void => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByTestId("input-descriptionFR")).toHaveValue("Description FR");
    expect(screen.getByTestId("input-descriptionEN")).toHaveValue("Description EN");
  });

  it("should populate type and content display fields", (): void => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByTestId("select-typeDisplay")).toHaveValue("image");
    expect(screen.getByTestId("select-contentDisplay")).toHaveValue("full");
  });

  it("should populate github url", (): void => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByTestId("input-github")).toHaveValue("https://github.com/test");
  });

  it("should allow editing all fields", (): void => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const titleInput: HTMLInputElement = screen.getByTestId("input-title") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    expect(titleInput.value).toBe("Updated Title");
  });

  it("should call mutation on save", async (): Promise<void> => {
    render(
      <ProjectEditModal project={mockProject} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    const buttons: HTMLElement[] = screen.getAllByTestId("btn-action");
    const saveButton: HTMLElement = buttons[buttons.length - 1];
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockUpdateProjectMutation).toHaveBeenCalled();
    });
  });
});
