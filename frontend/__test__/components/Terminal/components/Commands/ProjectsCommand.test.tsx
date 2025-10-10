import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsCommand from "@/components/Terminal/components/Commands/ProjectsCommand";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";
import { Project } from "@/components/Projects/typeProjects";
import Lang from "@/lang/typeLang";

// ---------- mocks ----------
jest.mock("next/dynamic", () => () => {
  const DynamicComponent: React.FC = (): React.ReactElement => (
    <div data-testid="react-player" />
  );
  DynamicComponent.displayName = "DynamicComponent";
  return DynamicComponent;
});

jest.mock("@/context/Lang/LangContext");
jest.mock("react-redux");

jest.mock("@/components/Button/Button", () => {
  const ButtonMock: React.FC<{ disable?: boolean; onClick?: () => void; text: string }> = (props) => (
    <button disabled={props.disable} onClick={props.onClick}>
      {props.text}
    </button>
  );
  ButtonMock.displayName = "ButtonCustom";
  return ButtonMock;
});

// ---------- mock data ----------
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Project One",
    description: "A".repeat(120),
    typeDisplay: "image",
    contentDisplay: "image.png",
    github: "https://github.com/test",
    skills: [
      { id: "1", name: "React", image: "/react.png" },
      { id: "2", name: "TS", image: "/ts.png" },
    ],
  },
  {
    id: "2",
    title: "Project Two",
    description: "Short description",
    typeDisplay: "image",
    contentDisplay: "image2.png",
    github: "",
    skills: [],
  },
];

describe("ProjectsCommand component", () => {
  beforeEach((): void => {
    jest.clearAllMocks();

    // Mock Lang context
    (useLang as jest.Mock).mockReturnValue({
      translations: {
        buttonSeeMore: "See more",
        buttonSeeLess: "See less",
        buttonPaginationNext: "Next",
        buttonPaginationPrevious: "Previous",
        navbarButtonSkill: "Skills",
      } as Lang,
    });

    const mockedUseSelector: jest.MockedFunction<typeof useSelector> = useSelector as jest.MockedFunction<typeof useSelector>;
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        projects: { dataProjects: mockProjects } as { dataProjects: Project[] },
      }),
    );

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders first project title", (): void => {
    render(<ProjectsCommand />);
    const projectTitle: HTMLElement = screen.getByText("Project One");
    expect(projectTitle).toBeInTheDocument();
  });

  it("shows truncated description and see more button", (): void => {
    render(<ProjectsCommand />);
    const truncatedDesc: HTMLElement = screen.getByText(/A{90}\.\.\./);
    const seeMoreBtn: HTMLElement = screen.getByText("See more");
    expect(truncatedDesc).toBeInTheDocument();
    expect(seeMoreBtn).toBeInTheDocument();
  });

  it("expands and collapses description text", (): void => {
    render(<ProjectsCommand />);
    const seeMoreBtn: HTMLElement = screen.getByText("See more");
    fireEvent.click(seeMoreBtn);
    const seeLessBtn: HTMLElement = screen.getByText("See less");
    expect(seeLessBtn).toBeInTheDocument();

    fireEvent.click(seeLessBtn);
    expect(screen.getByText("See more")).toBeInTheDocument();
  });

  it("navigates to next project with pagination", (): void => {
    render(<ProjectsCommand />);
    const nextBtn: HTMLElement = screen.getByText("Next");
    fireEvent.click(nextBtn);
    const secondProjectTitle: HTMLElement = screen.getByText("Project Two");
    expect(secondProjectTitle).toBeInTheDocument();
  });

  it("previous button is disabled on first page", (): void => {
    render(<ProjectsCommand />);
    const prevBtn: HTMLElement = screen.getByText("Previous");
    expect(prevBtn).toBeDisabled();
  });

  it("expands skills section when clicking expand icon", (): void => {
    render(<ProjectsCommand />);
    const expandButton: HTMLElement = screen.getByTitle("Project One - Skills");
    fireEvent.click(expandButton);
    const reactSkill: HTMLElement = screen.getByAltText("React");
    const tsSkill: HTMLElement = screen.getByAltText("TS");
    expect(reactSkill).toBeInTheDocument();
    expect(tsSkill).toBeInTheDocument();
  });

  it("renders github link when provided", (): void => {
    render(<ProjectsCommand />);
    const githubLink: HTMLElement = screen.getByTitle("Project One - Github");
    expect(githubLink).toHaveAttribute("href", "https://github.com/test");
  });
});