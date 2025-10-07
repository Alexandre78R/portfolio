import React from "react";
import { render, screen } from "../../../test-utils";
import Dashboard from "../../../../src/components/AdminLayout/Pages/Dashboard/Dashboard";
import { useGetGlobalStatsQuery } from "../../../../src/types/graphql";
import { useLang } from "../../../../src/context/Lang/LangContext";

jest.mock("../../../../src/types/graphql", () => ({
  useGetGlobalStatsQuery: jest.fn() as jest.Mock,
}));

jest.mock("../../../../src/context/Lang/LangContext", () => ({
  useLang: jest.fn() as jest.Mock,
}));

jest.mock(
  "../../../../src/components/Charts/HorizontalBarChart",
  () => {
    const Mock: React.FC<{ labels: string[] }> = (props) => (
      <div data-testid="horizontal-bar-chart">
        {props.labels.join(",")}
      </div>
    );
    Mock.displayName = "HorizontalBarChart" as string;
    return Mock as React.FC<{ labels: string[] }>;
  }
);

describe("Dashboard Page", () => {
  const translations: Record<string, string> = {
    messagePageDashBoardErreurData: "Erreur data" as string,
    messagePageDashBoardTitle: "Dashboard" as string,
    messagePageDashBoardCardStatsProject: "Projects" as string,
    messagePageDashBoardCardStatsSkill: "Skills" as string,
    messagePageDashBoardCardStatsEducation: "Educations" as string,
    messagePageDashBoardCardStatsExperience: "Experiences" as string,
    messagePageDashBoardCardStatsUser: "Users" as string,
    messagePageDashBoardTittleSection1: "Average Skills" as string,
    messagePageDashBoardMessageAverageLeft: "Average is" as string,
    messagePageDashBoardMessageAverageRight: "per project" as string,
    messagePageDashBoardTittleSection2: "Top Skills" as string,
    messagePageDashBoardTittleSection3: "Role Distribution" as string,
    messagePageDashBoardRoleAdmin: "Admin" as string,
    messagePageDashBoardRoleEditor: "Editor" as string,
    messagePageDashBoardRoleViewer: "Viewer" as string,
  };

  const mockData: Record<string, any> = {
    getGlobalStats: {
      stats: {
        totalProjects: 5 as number,
        totalSkills: 10 as number,
        totalEducations: 3 as number,
        totalExperiences: 7 as number,
        totalUsers: 4 as number,
      } as { [key: string]: number },
    } as { stats: { [key: string]: number } } ,
    getAverageSkillsPerProject: 2.5 as number,
    getUsersRoleDistribution: {
      admin: 20 as number,
      editor: 50 as number,
      view: 30 as number  ,
    } as { [key: string]: number },
    getTopUsedSkills: {
      skills: [
        { name: "React", usageCount: 10 },
        { name: "TypeScript", usageCount: 5 },
      ] as { name: string; usageCount: number }[],
    } as { skills: { name: string; usageCount: number }[] },
  };

  beforeEach(() => {
    (useLang as jest.Mock).mockReturnValue({ translations } as { translations: Record<string, string> });
  });

  it("renders loading state", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({ loading: true } as { loading: boolean });
    render(<Dashboard /> as React.ReactElement);
    expect(screen.getByRole("progressbar" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false as boolean,
      error: true as boolean,
    });
    render(<Dashboard /> as React.ReactElement);
    expect(
      screen.getByText(translations.messagePageDashBoardErreurData as string)
    ).toBeInTheDocument();
  });

  it("renders dashboard stats", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false as boolean,
      error: false as boolean,
      data: mockData as Record<string, any>,
    });

    render(<Dashboard /> as React.ReactElement);

    expect(screen.getByText("Projects" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("5" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Admin" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("20%" as string) as HTMLElement).toBeInTheDocument();
  });
});