import React from "react";
import { render, screen } from "../../../test-utils";
import Dashboard from "../../../../src/components/AdminLayout/Pages/Dashboard/Dashboard";
import { useGetGlobalStatsQuery } from "../../../../src/types/graphql";
import { useLang } from "../../../../src/context/Lang/LangContext";

jest.mock("../../../../src/types/graphql", () => ({
  useGetGlobalStatsQuery: jest.fn(),
}));

jest.mock("../../../../src/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock(
  "../../../../src/components/Charts/HorizontalBarChart",
  () => {
    const Mock = (props: any) => (
      <div data-testid="horizontal-bar-chart">
        {props.labels.join(",")}
      </div>
    );
    Mock.displayName = "HorizontalBarChart";
    return Mock;
  }
);

describe("Dashboard Page", () => {
  const translations = {
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

  const mockData = {
    getGlobalStats: {
      stats: {
        totalProjects: 5,
        totalSkills: 10,
        totalEducations: 3,
        totalExperiences: 7,
        totalUsers: 4,
      },
    },
    getAverageSkillsPerProject: 2.5,
    getUsersRoleDistribution: {
      admin: 20,
      editor: 50,
      view: 30,
    },
    getTopUsedSkills: {
      skills: [
        { name: "React", usageCount: 10 },
        { name: "TypeScript", usageCount: 5 },
      ],
    },
  };

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations });
  });

  it("renders loading state", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({ loading: true });
    render(<Dashboard />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: true,
    });
    render(<Dashboard />);
    expect(
      screen.getByText(translations.messagePageDashBoardErreurData)
    ).toBeInTheDocument();
  });

  it("renders dashboard stats", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: mockData,
    });

    render(<Dashboard />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });
});