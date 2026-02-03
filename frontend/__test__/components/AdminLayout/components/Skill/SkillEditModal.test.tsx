import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import SkillEditModal from "@/components/AdminLayout/components/Skill/SkillEditModal";
import Lang from "@/lang/typeLang";

interface SkillRowData {
  id: number;
  name: string;
  image: string;
  categoryEN: string;
  categoryFR: string;
}

interface UpdateSkillResponse {
  data: {
    updateSkill: {
      code: number;
      message: string;
    };
  };
}

interface SkillsListData {
  listSkillCategories: {
    categories: Array<{
      id: number;
      categoryEN: string;
      categoryFR: string;
      skills?: Array<{ id: number }>;
    }>;
  };
}

interface LangContextType {
  translations: Lang;
}

interface InputFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface InputSelectProps {
  id: string;
  label: string;
  value: number | string;
  name: string;
  options: Array<{ value: number | string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

jest.mock("@/components/ModalCustom/ModalCustom", (): object => ({
  __esModule: true,
  default: (props: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
  }): ReactElement | null =>
    props.open ? <div data-testid="modal">{props.children}</div> : null,
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", (): object => ({
  __esModule: true,
  default: (props: { children: React.ReactNode }): ReactElement => (
    <h2 data-testid="text-admin">{props.children}</h2>
  ),
}));

jest.mock("@/components/InputField/InputField", (): object => ({
  __esModule: true,
  default: (props: InputFieldProps): ReactElement => (
    <input
      data-testid={`input-${props.id}`}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
    />
  ),
}));

jest.mock("@/components/AdminLayout/components/Input/InputSelect", (): object => ({
  __esModule: true,
  default: (props: InputSelectProps): ReactElement => (
    <select
      data-testid={`select-${props.id}`}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options.map(
        (opt: { value: number | string; label: string }): ReactElement => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  ),
}));

jest.mock("@/components/ToastCustom/CustomToast", (): object => ({
  __esModule: true,
  default: (): { showAlert: jest.Mock<void, ["success" | "error", string]> } => ({
    showAlert: jest.fn(),
  }),
}));

jest.mock("@/components/Button/Button", (): object => ({
  __esModule: true,
  default: (props: {
    text: string;
    onClick?: () => void;
  }): ReactElement => (
    <button data-testid="btn-action" onClick={props.onClick}>
      {props.text}
    </button>
  ),
}));

jest.mock("@/components/Loading/Loading", (): object => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

const mockUpdateSkillMutation: jest.Mock<
  Promise<UpdateSkillResponse>,
  [any]
> = jest.fn();

const mockGetSkillsList: jest.Mock<SkillsListData, []> = jest.fn();

jest.mock("@/utils/hooks", (): object => ({
  ...jest.requireActual("@/utils/hooks"),
  useUpdateSkillAdmin: jest.fn<[typeof mockUpdateSkillMutation], []>(),
}));

jest.mock("@/types/graphql", (): object => ({
  ...jest.requireActual("@/types/graphql"),
  useGetSkillsListQuery: (): { data: SkillsListData; loading: boolean } => ({
    data: mockGetSkillsList(),
    loading: false,
  }),
}));

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn((): LangContextType => ({
    translations: {
      editSkill: "Edit Skill",
      skillName: "Skill Name",
      category: "Category",
      image: "Image",
      save: "Save",
      cancel: "Cancel",
    } as unknown as Lang,
  })),
}));

const mockSkill: SkillRowData = {
  id: 1,
  name: "React",
  image: "react.png",
  categoryEN: "Frontend",
  categoryFR: "Frontend",
};

const mockSkillsListData: SkillsListData = {
  listSkillCategories: {
    categories: [
      {
        id: 10,
        categoryEN: "Frontend",
        categoryFR: "Frontend",
        skills: [{ id: 1 }],
      },
    ],
  },
};


function getInputElement(id: string): HTMLInputElement {
  const element: HTMLElement | null = screen.queryByTestId(`input-${id}`);
  if (!element || !(element instanceof HTMLInputElement)) {
    throw new Error(`Input with testId 'input-${id}' not found`);
  }
  return element;
}

function getActionButton(): HTMLButtonElement {
  const buttons: HTMLElement[] = screen.getAllByTestId("btn-action");
  const button: HTMLElement | undefined = buttons[buttons.length - 1];
  if (!button || !(button instanceof HTMLButtonElement)) {
    throw new Error("Action button not found");
  }
  return button;
}

describe("SkillEditModal", (): void => {
  const mockOnClose: jest.Mock<void, []> = jest.fn();
  const mockOnRefresh: jest.Mock<Promise<void>, []> = jest.fn(
    async (): Promise<void> => undefined
  );

  beforeEach((): void => {
    jest.clearAllMocks();
    mockUpdateSkillMutation.mockResolvedValue({
      data: { updateSkill: { code: 200, message: "Updated" } },
    });
    mockGetSkillsList.mockReturnValue(mockSkillsListData);
    
    const { useUpdateSkillAdmin } = require("@/utils/hooks");
    (useUpdateSkillAdmin as jest.Mock).mockReturnValue([mockUpdateSkillMutation]);
  });

  it("should not render when skill is null", (): void => {
    const { container }: { container: HTMLElement } = render(
      <SkillEditModal skill={null} onClose={mockOnClose} onRefresh={mockOnRefresh} />
    );

    expect(container.querySelector("[data-testid='modal']")).not.toBeInTheDocument();
  });

  it("should render modal when skill is provided", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    const title: HTMLElement = await screen.findByTestId("text-admin");
    expect(title).toHaveTextContent("Edit Skill");
  });

  it("should populate form with skill data", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const nameInput: HTMLInputElement = await screen.findByTestId("input-name") as HTMLInputElement;
    const imageInput: HTMLInputElement = await screen.findByTestId("input-image") as HTMLInputElement;
    expect(nameInput).toHaveValue("React");
    expect(imageInput).toHaveValue("react.png");
  });

  it("should populate category field", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    const select: HTMLElement = await screen.findByTestId("select-categoryId");
    expect(select).toBeInTheDocument();
  });

  it("should allow editing name field", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("input-name");
    const nameInput: HTMLInputElement = getInputElement("name");
    fireEvent.change(nameInput, { target: { value: "Vue" } });

    expect(nameInput.value).toBe("Vue");
  });

  it("should allow editing image field", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("input-image");
    const imageInput: HTMLInputElement = getInputElement("image");
    fireEvent.change(imageInput, { target: { value: "vue.png" } });

    expect(imageInput.value).toBe("vue.png");
  });

  it("should call mutation on save", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("text-admin");
    const saveButton: HTMLButtonElement = getActionButton();
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockUpdateSkillMutation).toHaveBeenCalled();
    });
  });

  it("should call onRefresh after successful update", async (): Promise<void> => {
    render(
      <SkillEditModal
        skill={mockSkill}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
      />
    );

    await screen.findByTestId("text-admin");
    const saveButton: HTMLButtonElement = getActionButton();
    fireEvent.click(saveButton);

    await waitFor((): void => {
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });
});

