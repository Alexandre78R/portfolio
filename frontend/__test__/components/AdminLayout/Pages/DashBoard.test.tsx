import React from "react";
import { render, screen } from "../../../test-utils";
import Dashboard from "../../../../src/components/AdminLayout/Pages/Dashboard/Dashboard";
import { useGetGlobalStatsQuery, GetGlobalStatsQuery } from "../../../../src/types/graphql";
import { useLang } from "../../../../src/context/Lang/LangContext";
import { MainStat, RoleStat } from "../../../../src/components/AdminLayout/Pages/Dashboard/Dashboard";
import Lang from "@/lang/typeLang";

jest.mock("../../../../src/types/graphql", () => ({
  useGetGlobalStatsQuery: jest.fn(),
}));

jest.mock("../../../../src/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("../../../../src/components/Charts/HorizontalBarChart", () => {
  const Mock: React.FC<{ labels: string[]; data?: number[] }> = (props) => (
    <div data-testid="horizontal-bar-chart">{props.labels.join(",")}</div>
  );
  Mock.displayName = "HorizontalBarChart";
  return Mock;
});

describe("Dashboard Page", () => {
  const translations: Record<string, string> = {
    messagePageDashBoardErreurData: "Erreur data",
    messagePageDashBoardTitle: "Dashboard",
    messagePageDashBoardCardStatsProject: "Projects",
    messagePageDashBoardCardStatsSkill: "Skills",
    messagePageDashBoardCardStatsEducation: "Educations",
    messagePageDashBoardCardStatsExperience: "Experiences",
    messagePageDashBoardCardStatsUser: "Users",
    messagePageDashBoardTittleSection1: "Average Skills",
    messagePageDashBoardMessageAverageLeft: "Average is",
    messagePageDashBoardMessageAverageRight: "per project",
    messagePageDashBoardTittleSection2: "Top Skills",
    messagePageDashBoardTittleSection3: "Role Distribution",
    messagePageDashBoardRoleAdmin: "Admin",
    messagePageDashBoardRoleEditor: "Editor",
    messagePageDashBoardRoleViewer: "Viewer",
  };

  const mockData: GetGlobalStatsQuery = {
    getGlobalStats: {
      __typename: "GlobalStatsResponse",
      code: 200,
      message: "OK",
      stats: {
        __typename: "GlobalStats",
        totalProjects: 5,
        totalSkills: 10,
        totalEducations: 3,
        totalExperiences: 7,
        totalUsers: 4,
        usersByRoleAdmin: 20,
        usersByRoleEditor: 50,
        usersByRoleView: 30,
      },
    },
    getAverageSkillsPerProject: 2.5,
    getUsersRoleDistribution: {
      __typename: "UserRolePercent",
      admin: 20,
      editor: 50,
      view: 30,
      code: 200,
      message: "OK",
    },
    getTopUsedSkills: {
      __typename: "TopSkillsResponse",
      code: 200,
      message: "OK",
      skills: [
        { __typename: "TopSkillUsage", id: 1, name: "React", usageCount: 10 },
        { __typename: "TopSkillUsage", id: 2, name: "TypeScript", usageCount: 5 },
      ],
    },
  };

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations });
  });

  it("renders loading state", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    });
    render(<Dashboard />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: true,
      data: undefined,
    });
    render(<Dashboard />);
    expect(screen.getByText(translations.messagePageDashBoardErreurData)).toBeInTheDocument();
  });

  it("renders dashboard stats correctly", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: mockData,
    });

    render(<Dashboard />);

    const stats = mockData.getGlobalStats.stats!;
    const averageSkills: number = mockData.getAverageSkillsPerProject;
    const topSkills = mockData.getTopUsedSkills.skills;
    const roleDistribution: RoleStat[] = [
      { label: translations.messagePageDashBoardRoleAdmin, value: stats.usersByRoleAdmin },
      { label: translations.messagePageDashBoardRoleEditor, value: stats.usersByRoleEditor },
      { label: translations.messagePageDashBoardRoleViewer, value: stats.usersByRoleView },
    ];

    const mainStats: MainStat[] = [
      { title: translations.messagePageDashBoardCardStatsProject, value: stats.totalProjects, icon: <></>, color: "" },
      { title: translations.messagePageDashBoardCardStatsSkill, value: stats.totalSkills, icon: <></>, color: "" },
      { title: translations.messagePageDashBoardCardStatsEducation, value: stats.totalEducations, icon: <></>, color: "" },
      { title: translations.messagePageDashBoardCardStatsExperience, value: stats.totalExperiences, icon: <></>, color: "" },
      { title: translations.messagePageDashBoardCardStatsUser, value: stats.totalUsers, icon: <></>, color: "" },
    ];

    mainStats.forEach((stat) => {
      expect(screen.getByText(stat.title)).toBeInTheDocument();
      expect(screen.getByText(stat.value.toString())).toBeInTheDocument();
    });

    expect(screen.getByText(averageSkills.toFixed(2))).toBeInTheDocument();

    roleDistribution.forEach((role) => {
      expect(screen.getByText(role.label)).toBeInTheDocument();
      expect(screen.getByText(`${role.value.toFixed(0)}%`)).toBeInTheDocument();
    });

    expect(screen.getByTestId("horizontal-bar-chart")).toHaveTextContent(topSkills.map(s => s.name).join(","));
  });
});