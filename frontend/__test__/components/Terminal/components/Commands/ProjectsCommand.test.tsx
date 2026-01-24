import React from "react";
import { render, screen, fireEvent } from '@test-utils';
import ProjectsCommand from "@/components/Terminal/components/Commands/ProjectsCommand";
import { Project } from "@/store/slices/projectsSlice";
import { useLang } from "@/context/Lang/LangContext";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import projectsReducer from "@/store/slices/projectsSlice";

jest.mock("next/dynamic", () => () => {
  const DynamicComponent: React.FC = () => <div data-testid="react-player" />;
  DynamicComponent.displayName = "DynamicComponent";
  return DynamicComponent;
});

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

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
  const renderWithStore = () => {
    const store = configureStore({
      reducer: {
        projects: projectsReducer,
      },
      preloadedState: {
        projects: {
          dataProjects: mockProjects,
        },
      },
    });

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    return render(
      <Provider store={store}>
        <ProjectsCommand />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useLang as jest.Mock).mockReturnValue({
      translations: {
        buttonSeeMore: "See more",
        buttonSeeLess: "See less",
        buttonPaginationNext: "Next",
        buttonPaginationPrevious: "Previous",
        navbarButtonSkill: "Skills",
      },
      lang: "en",
    });
  });

  test("renders first project title", () => {
    renderWithStore();
    expect(screen.getByText("Project One")).toBeInTheDocument();
  });

  test("shows truncated description and see more button", () => {
    renderWithStore();
    expect(screen.getByText(/A{90}\.\.\./)).toBeInTheDocument();
    expect(screen.getByText("See more")).toBeInTheDocument();
  });

  test("expands and collapses description text", () => {
    renderWithStore();
    const seeMoreButton: HTMLParagraphElement = screen.getByText("See more");
    fireEvent.click(seeMoreButton);
    expect(screen.getByText("See less")).toBeInTheDocument();
    const seeLessButton: HTMLParagraphElement = screen.getByText("See less");
    fireEvent.click(seeLessButton);
    expect(screen.getByText("See more")).toBeInTheDocument();
  });

  test("navigates to next project with pagination", () => {
    renderWithStore();
    const nextButton: HTMLButtonElement = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByText("Project Two")).toBeInTheDocument();
  });

  test("previous button is disabled on first page", () => {
    renderWithStore();
    const prevButton: HTMLButtonElement = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  test("expands skills section when clicking expand icon", () => {
    renderWithStore();
    const expandButton: HTMLButtonElement | null = screen.getByTitle(
      "Project One - Skills"
    );
    expect(expandButton).toBeInTheDocument();
    if (expandButton) fireEvent.click(expandButton);
    expect(screen.getByAltText("React")).toBeInTheDocument();
    expect(screen.getByAltText("TS")).toBeInTheDocument();
  });

  test("renders github link when provided", () => {
    renderWithStore();
    const link: HTMLAnchorElement = screen.getByTitle("Project One - Github");
    expect(link).toHaveAttribute("href", "https://github.com/test");
  });
});
