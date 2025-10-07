import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Projects from "@/components/Projects/Projects";
import { useLang } from "@/context/Lang/LangContext";
import { Project } from "@/components/Projects/typeProjects";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn() as jest.Mock,
}));

jest.mock("react-player", () => {
  const ReactPlayerMock: React.FC = () => <div data-testid="react-player" />;
  ReactPlayerMock.displayName = "ReactPlayer" as const;
  return ReactPlayerMock;
});

jest.mock("@mui/material", () => ({
  CardContent: ({ children }: any) => <div>{children}</div>,
  Typography: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@mui/material/IconButton", () => ({
  __esModule: true as boolean,
  default: ({ children }: any) => <button>{children}</button>,
}));

jest.mock("@mui/material/CardActions", () => ({
  __esModule: true as boolean,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@mui/icons-material/GitHub", () => {
  const GitHubMock: React.FC = () => <span data-testid="github-icon" />;
  GitHubMock.displayName = "GitHubIcon" as const;
  return GitHubMock;
});

jest.mock("@mui/icons-material/ExpandMore", () => {
  const ExpandMoreMock: React.FC = (props: any) => <span data-testid="expand-icon" {...props} />;
  ExpandMoreMock.displayName = "ExpandMoreIcon" as const;
  return ExpandMoreMock;
});

const mockProject: Project = {
  id: "1" as unknown as string,
  title: "Test Project" as unknown as string,
  description: "A".repeat(200) as unknown as string,
  typeDisplay: "image" as unknown as string,
  contentDisplay: "image.png" as unknown as string,
  github: "https://github.com/test/project" as unknown as string,
  skills: [
    { name: "React", image: "/react.png" } as { name: string; image: string },
    { name: "TypeScript", image: "/ts.png" } as { name: string; image: string },
  ] as any[],
} as Project;

describe("Projects component", () => {
  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({
      translations: {
        buttonSeeMore: "See more" as const,
        buttonSeeLess: "See less" as const,
        navbarButtonSkill: "Skills" as const,
      } as Record<string, string>,
    }as any);

    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000" as string;
  });

  it("renders project title", () => {
    render(<Projects project={mockProject as any} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders shortened description with see more button", () => {
    render(<Projects project={mockProject as any} />);

    expect(screen.getByText(/A{150}\.\.\./ as RegExp) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("See more" as string) as HTMLElement).toBeInTheDocument();
  });

  it("expands and collapses description text", () => {
    render(<Projects project={mockProject as any} />);

    fireEvent.click(screen.getByText("See more" as string));
    expect(screen.getByText(mockProject.description as string)).toBeInTheDocument();

    fireEvent.click(screen.getByText("See less" as string));
    expect(screen.getByText(/A{150}\.\.\./ as RegExp)).toBeInTheDocument();
  });

  it("renders github link when provided", () => {
    render(<Projects project={mockProject as any} /> as React.ReactElement);

    const link: HTMLAnchorElement = screen.getByTitle("Test Project - Github" as string) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", mockProject.github as string);
  });

  it("toggles skills section when expand icon is clicked", () => {
    render(<Projects project={mockProject as any} /> as React.ReactElement);

    fireEvent.click(screen.getByTestId("expand-icon" as string) as HTMLElement);

    expect(screen.getByAltText("React" as string)).toBeInTheDocument();
    expect(screen.getByAltText("TypeScript" as string)).toBeInTheDocument();
  });

  it("renders ReactPlayer when project type is video", () => {
    render(
      <Projects
        project={{
          ...mockProject,
          typeDisplay: "video",
        } as any}
      />
    );

    expect(screen.getByTestId("react-player") as HTMLElement).toBeInTheDocument();
  });
});