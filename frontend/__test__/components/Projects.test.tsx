
import React, { type ReactElement } from "react";
import { render, screen, fireEvent } from '@test-utils';
import Projects from "@/components/Projects/Projects";
import { useLang } from "@/context/Lang/LangContext";
import { Project } from "@/components/Projects/typeProjects";
import type Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn() as jest.Mock,
}));

jest.mock("react-player", () => {
  const ReactPlayerMock: React.FC = () => <div data-testid="react-player" />;
  ReactPlayerMock.displayName = "ReactPlayer";
  return ReactPlayerMock;
});

jest.mock("@mui/material", () => ({
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@mui/material/IconButton", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock("@mui/material/CardActions", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@mui/icons-material/GitHub", () => {
  const GitHubMock: React.FC = () => <span data-testid="github-icon" />;
  GitHubMock.displayName = "GitHubIcon";
  return GitHubMock;
});

jest.mock("@mui/icons-material/ExpandMore", () => {
  const ExpandMoreMock: React.FC<any> = (props) => <span data-testid="expand-icon" {...props} />;
  ExpandMoreMock.displayName = "ExpandMoreIcon";
  return ExpandMoreMock;
});

const mockProject: Project | any = {
  id: "1",
  title: "Test Project",
  description: "A".repeat(200),
  typeDisplay: "image",
  contentDisplay: "image.png",
  github: "https://github.com/test/project",
  image: "/images/test.png",
  video: null,
  skills: [
    { id: "s1", name: "React", image: "/react.png" },
    { id: "s2", name: "TypeScript", image: "/ts.png" },
  ],
};

describe("Projects component", (): void => {
  const translations = {
    buttonSeeMore: "See more",
    buttonSeeLess: "See less",
    navbarButtonSkill: "Skills",
  } as Lang;

  beforeEach((): void => {
    (useLang as jest.Mock).mockReturnValue({ translations });
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it("renders project title", (): void => {
    render(<Projects project={mockProject} /> as ReactElement);

    const titleElement: HTMLElement = screen.getByText(mockProject.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders shortened description with see more button", (): void => {
    render(<Projects project={mockProject} /> as ReactElement);

    const shortDescRegex: RegExp = new RegExp("A{150}\\.\\.\\.");
    const descElement: HTMLElement = screen.getByText(shortDescRegex);
    expect(descElement).toBeInTheDocument();

    const seeMoreButton: HTMLElement = screen.getByText(translations.buttonSeeMore);
    expect(seeMoreButton).toBeInTheDocument();
  });

  it("expands and collapses description text when clicking see more/see less", (): void => {
    render(<Projects project={mockProject} /> as ReactElement);

    const seeMoreButton: HTMLElement = screen.getByText(translations.buttonSeeMore);
    fireEvent.click(seeMoreButton);

    const fullDescElement: HTMLElement = screen.getByText(mockProject.description);
    expect(fullDescElement).toBeInTheDocument();

    const seeLessButton: HTMLElement = screen.getByText(translations.buttonSeeLess);
    fireEvent.click(seeLessButton);

    const shortDescRegex: RegExp = new RegExp("A{150}\\.\\.\\.");
    expect(screen.getByText(shortDescRegex)).toBeInTheDocument();
  });

  it("renders github link when provided", (): void => {
    render(<Projects project={mockProject} /> as ReactElement);

    const githubLink: HTMLAnchorElement = screen.getByTitle(`${mockProject.title} - Github`) as HTMLAnchorElement;
    expect(githubLink).toHaveAttribute("href", mockProject.github);
  });

  it("toggles skills section when expand icon is clicked", (): void => {
    render(<Projects project={mockProject} /> as ReactElement);

    const expandButton: HTMLElement = screen.getByTestId("expand-icon");
    fireEvent.click(expandButton);

    const skill1: HTMLElement = screen.getByAltText("React");
    const skill2: HTMLElement = screen.getByAltText("TypeScript");

    expect(skill1).toBeInTheDocument();
    expect(skill2).toBeInTheDocument();
  });

  it("renders ReactPlayer when project type is video", async (): Promise<void> => {
    render(
      <Projects
        project={{ ...mockProject, typeDisplay: "video", video: "/videos/demo.mp4", image: null }}
      /> as ReactElement
    );

    const playerElement: HTMLElement = await screen.findByTestId("react-player");
    expect(playerElement).toBeInTheDocument();
  });
});
