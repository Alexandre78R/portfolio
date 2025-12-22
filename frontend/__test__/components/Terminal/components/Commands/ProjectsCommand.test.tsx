import React from "react";
import { render, screen, fireEvent } from '@test-utils';
import ProjectsCommand from "@/components/Terminal/components/Commands/ProjectsCommand";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";
import { Project, SkillsProject } from "@/store/slices/projectsSlice";
import type Lang from "@/lang/typeLang";

jest.mock("next/dynamic", () => () => {
  const DynamicComponent: React.FC = () => <div data-testid="react-player" />;
  DynamicComponent.displayName = "DynamicComponent";
  return DynamicComponent;
});

jest.mock("@/context/Lang/LangContext");
jest.mock("react-redux");

jest.mock("@/components/Button/Button", () => {
  const ButtonMock: React.FC<{
    text: string;
    onClick?: () => void;
    disable?: boolean;
    disableHover?: boolean;
  }> = ({ text, onClick, disable }) => (
    <button disabled={disable} onClick={onClick}>
      {text}
    </button>
  );
  ButtonMock.displayName = "ButtonCustom";
  return ButtonMock;
});

const mockProjects: Project[] = [
  {
    id: 1,
    title: "Project One",
    descriptionFR: "A".repeat(120),
    descriptionEN: "A".repeat(120),
    typeDisplay: "image",
    contentDisplay: "image.png",
    github: "https://github.com/test",
    skills: [
      { name: "React", image: "/react.png" },
      { name: "TS", image: "/ts.png" },
    ],
    image: null,
    video: null
  },
  {
    id: 2,
    title: "Project Two",
    descriptionFR: "Short description",
    descriptionEN: "Short description",
    typeDisplay: "image",
    contentDisplay: "image2.png",
    github: null,
    skills: [],
    image: null,
    video: null
  },
];

describe("ProjectsCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useLang as jest.Mock).mockReturnValue({
      translations: {
        buttonSeeMore: "See more",
        buttonSeeLess: "See less",
        buttonPaginationNext: "Next",
        buttonPaginationPrevious: "Previous",
        navbarButtonSkill: "Skills",
      } as Lang,
      lang: "fr",
    });

    (useSelector as jest.MockedFunction<typeof useSelector>).mockImplementation(
      (selector) =>
        selector({
          projects: {
            dataProjects: mockProjects,
          },
        })
    );

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  test("renders first project title", () => {
    render(<ProjectsCommand />);
    expect(screen.getByText("Project One")).toBeInTheDocument();
  });

  test("shows truncated description and see more button", () => {
    render(<ProjectsCommand />);
    expect(screen.getByText(/A{90}\.\.\./)).toBeInTheDocument();
    expect(screen.getByText("See more")).toBeInTheDocument();
  });

  test("expands and collapses description text", () => {
    render(<ProjectsCommand />);
    const seeMoreButton: HTMLParagraphElement = screen.getByText("See more");
    fireEvent.click(seeMoreButton);
    expect(screen.getByText("See less")).toBeInTheDocument();
    const seeLessButton: HTMLParagraphElement = screen.getByText("See less");
    fireEvent.click(seeLessButton);
    expect(screen.getByText("See more")).toBeInTheDocument();
  });

  test("navigates to next project with pagination", () => {
    render(<ProjectsCommand />);
    const nextButton: HTMLButtonElement = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByText("Project Two")).toBeInTheDocument();
  });

  test("previous button is disabled on first page", () => {
    render(<ProjectsCommand />);
    const prevButton: HTMLButtonElement = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  test("expands skills section when clicking expand icon", () => {
    render(<ProjectsCommand />);
    const expandButton: HTMLButtonElement | null = screen.getByTitle(
      "Project One - Skills"
    );
    expect(expandButton).toBeInTheDocument();
    if (expandButton) fireEvent.click(expandButton);
    expect(screen.getByAltText("React")).toBeInTheDocument();
    expect(screen.getByAltText("TS")).toBeInTheDocument();
  });

  test("renders github link when provided", () => {
    render(<ProjectsCommand />);
    const link: HTMLAnchorElement = screen.getByTitle("Project One - Github");
    expect(link).toHaveAttribute("href", "https://github.com/test");
  });
});
