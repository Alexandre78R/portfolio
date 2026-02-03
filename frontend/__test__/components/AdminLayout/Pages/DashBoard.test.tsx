import { render, screen } from '@testing-library/react';
import Dashboard from "@/components/AdminLayout/Pages/Dashboard/Dashboard";
import { ThemeProvider } from "@/context/Theme/ThemeContext";
import type Lang from "@/lang/typeLang";
import type { GetGlobalStatsQuery, GetThemesListQuery } from "@/types/graphql";
import { useGetGlobalStatsQuery, useGetThemesListQuery } from "@/types/graphql";

jest.mock("@/types/graphql", () => ({
  ...jest.requireActual("@/types/graphql"),
  useGetGlobalStatsQuery: jest.fn(),
  useGetThemesListQuery: jest.fn(),
}));

jest.mock("@/components/Loading/LoadingCustom", () => () => (
  <div data-testid="loading">Loading...</div>
));

jest.mock("@/components/Charts/HorizontalBarChart", () => ({
  __esModule: true,
  default: ({
    labels,
    data,
  }: {
    labels: string[];
    data: number[];
  }): JSX.Element => (
    <div data-testid="chart-bar">
      {labels.map((label, index) => (
        <div key={label} data-testid={`skill-${label}`}>
          <span>{label}</span>: <span>{data[index]}</span>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: {
      messagePageDashBoardCardStatsProject: "Total Projects",
      messagePageDashBoardCardStatsSkill: "Skills",
      messagePageDashBoardCardStatsEducation: "Education",
      messagePageDashBoardCardStatsExperience: "Experience",
      messagePageDashBoardCardStatsUser: "Users",
      messagePageDashBoardRoleAdmin: "Admin",
      messagePageDashBoardRoleEditor: "Editor",
      messagePageDashBoardRoleViewer: "Viewer",
      messagePageDashBoardTitle: "Dashboard",
      messagePageDashBoardTittleSection1: "Average Skills",
      messagePageDashBoardMessageAverageLeft: "Average skills per project:",
      messagePageDashBoardMessageAverageRight: "skills",
      messagePageDashBoardTittleSection2: "Top Skills",
      messagePageDashBoardTittleSection3: "Roles",
      messagePageDashBoardErreurData: "Error loading data",
    } as Lang,
  }),
}));

describe("Dashboard Page", () => {
  const mockedGetThemes: jest.Mock = useGetThemesListQuery as jest.Mock;
  const mockedGetStats: jest.Mock = useGetGlobalStatsQuery as jest.Mock;

  beforeEach(() => {
    mockedGetThemes.mockReturnValue({
      data: {
        listThemes: [],
        __typename: "ThemesResponse",
        code: 200,
        message: "ok",
        themes: [],
      } as unknown as GetThemesListQuery,
      loading: false,
      error: undefined,
    } as Partial<ReturnType<typeof useGetThemesListQuery>>);

    mockedGetStats.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as Partial<ReturnType<typeof useGetGlobalStatsQuery>>);
  });


  it("renders loading state", (): void => {
    mockedGetStats.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as Partial<ReturnType<typeof useGetGlobalStatsQuery>>);

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error state", (): void => {
    mockedGetStats.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: "Test error" } as Partial<Error>,
    } as Partial<ReturnType<typeof useGetGlobalStatsQuery>>);

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
  });

  it("renders dashboard stats correctly", (): void => {
const statsMock: GetGlobalStatsQuery = {
  getGlobalStats: {
    __typename: "GlobalStatsResponse",
    code: 200,
    message: "ok",
    stats: {
      totalUsers: 5,
      totalProjects: 10,
      totalSkills: 8,
      totalEducations: 3,
      totalExperiences: 7,
      usersByRoleAdmin: 1,
      usersByRoleEditor: 2,
      usersByRoleView: 2,
    },
  },
  getTopUsedSkills: {
    __typename: "TopSkillsResponse",
    code: 200,
    message: "ok",
    skills: [
      { __typename: "TopSkillUsage", id: 1, name: "React", usageCount: 15 },
      { __typename: "TopSkillUsage", id: 2, name: "TypeScript", usageCount: 12 },
    ],
  },
  getAverageSkillsPerProject: 3.5,
  getUsersRoleDistribution: {
    __typename: "UserRolePercent",
    admin: 1,
    editor: 2,
    view: 2,
    code: 200,
    message: "ok",
  },
};

    mockedGetStats.mockReturnValue({
      data: statsMock,
      loading: false,
      error: undefined,
    } as Partial<ReturnType<typeof useGetGlobalStatsQuery>>);

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Total Projects")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();

    const skillsElements: HTMLElement[] = screen.getAllByText(/^Skills$/i);
    expect(skillsElements.length).toBeGreaterThan(0);

    expect(screen.getByText("10")).toBeInTheDocument(); // Total Projects
    expect(screen.getByText("8")).toBeInTheDocument(); // Skills
    expect(screen.getByText("3")).toBeInTheDocument(); // Education
    expect(screen.getByText("7")).toBeInTheDocument(); // Experience
    expect(screen.getByText("5")).toBeInTheDocument(); // Users

    expect(screen.getByText("Average Skills")).toBeInTheDocument();
    expect(screen.getByText("Top Skills")).toBeInTheDocument();
    expect(screen.getByText("Roles")).toBeInTheDocument();

    expect(screen.getByTestId("chart-bar")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("3.50")).toBeInTheDocument();
  });
});
