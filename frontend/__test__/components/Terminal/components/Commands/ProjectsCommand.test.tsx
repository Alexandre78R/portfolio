import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsCommand from "@/components/Terminal/components/Commands/ProjectsCommand";
import { useLang } from "@/context/Lang/LangContext";
import { useSelector } from "react-redux";

// ---------- mocks ----------
jest.mock("next/dynamic", () => () => {
  const DynamicComponent: React.FC = () => <div data-testid="react-player" /> as React.ReactElement;
  DynamicComponent.displayName = "DynamicComponent" as string;
  return DynamicComponent as React.FC;
});

jest.mock("@/context/Lang/LangContext");
jest.mock("react-redux");

jest.mock("@/components/Button/Button", () => {
  const ButtonMock = (props: any) => (
    <button
      disabled={props.disable}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );

  ButtonMock.displayName = "ButtonCustom" as string;

  return ButtonMock as React.FC<any>;
});

const mockProjects: Array<{
  id: string;
  title: string;
  description: string;
  typeDisplay: string;
  contentDisplay: string;
  github?: string;
  skills: Array<{ name: string; image: string }>;
}> = [
  {
    id: "1" as string,
    title: "Project One" as string,
    description: "A".repeat(120) as string,
    typeDisplay: "image" as string,
    contentDisplay: "image.png" as string,
    github: "https://github.com/test" as string,
    skills: [
      { name: "React", image: "/react.png" } as { name: string; image: string },
      { name: "TS", image: "/ts.png" } as { name: string; image: string },
    ] as Array<{ name: string; image: string }>,
  },
  {
    id: "2" as string,
    title: "Project Two" as string,
    description: "Short description" as string,
    typeDisplay: "image" as string,
    contentDisplay: "image2.png" as string,
    skills: [] as Array<{ name: string; image: string }>,
  },
];

describe("ProjectsCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useLang as jest.Mock).mockReturnValue({
      translations: {
        buttonSeeMore: "See more" as string,
        buttonSeeLess: "See less" as string,
        buttonPaginationNext: "Next" as string,
        buttonPaginationPrevious: "Previous" as string,
        navbarButtonSkill: "Skills" as string,
      },
    });

    const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

        mockedUseSelector.mockImplementation((selector) =>
        selector({
            projects: {
            dataProjects: mockProjects,
            } as any,
        } as any)
    );

    Object.defineProperty(window, "innerWidth", {
      writable: true as boolean,
      configurable: true as boolean,
      value: 1024 as number,
    });
  });

  test("renders first project title", () => {
    render(<ProjectsCommand /> as React.ReactElement);
    expect(screen.getByText("Project One" as string) as HTMLElement).toBeInTheDocument();
  });

  test("shows truncated description and see more button", () => {
    render(<ProjectsCommand /> as React.ReactElement);

    expect(screen.getByText(/A{90}\.\.\./ as RegExp) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("See more" as string) as HTMLElement).toBeInTheDocument();
  });

  test("expands and collapses description text", () => {
    render(<ProjectsCommand /> as React.ReactElement);

    fireEvent.click(screen.getByText("See more" as string) as HTMLElement);
    expect(screen.getByText("See less" as string) as HTMLElement).toBeInTheDocument();

    fireEvent.click(screen.getByText("See less" as string) as HTMLElement);
    expect(screen.getByText("See more" as string) as HTMLElement).toBeInTheDocument();
  });

  test("navigates to next project with pagination", () => {
    render(<ProjectsCommand /> as React.ReactElement);

    fireEvent.click(screen.getByText("Next" as string) as HTMLElement);
    expect(screen.getByText("Project Two" as string) as HTMLElement).toBeInTheDocument();
  });

  test("previous button is disabled on first page", () => {
    render(<ProjectsCommand /> as React.ReactElement);
    expect(screen.getByText("Previous" as string) as HTMLElement).toBeDisabled();
  });

  test("expands skills section when clicking expand icon", () => {
    render(<ProjectsCommand /> as React.ReactElement);

    const expandButton: HTMLElement = screen.getByTitle(
      "Project One - Skills"
    ) as HTMLElement;

    fireEvent.click(expandButton as HTMLElement);

    expect(screen.getByAltText("React" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByAltText("TS" as string) as unknown as string).toBeInTheDocument();
  });

  test("renders github link when provided", () => {
    render(<ProjectsCommand /> as React.ReactElement);

    const link: HTMLElement = screen.getByTitle("Project One - Github" as string) as HTMLElement;
    expect(link as HTMLElement | null | void).toHaveAttribute("href" as string, "https://github.com/test" as string) as HTMLElement | null | void;
  });
});