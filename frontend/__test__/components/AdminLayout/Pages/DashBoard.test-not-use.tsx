import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../../../../src/components/AdminLayout/Pages/Dashboard/Dashboard";
import { useGetGlobalStatsQuery } from "../../../../src/types/graphql";
import { useLang } from "../../../../src/context/Lang/LangContext";

// Mocks GraphQL et contexte
jest.mock("@src/types/graphql", () => ({
  useGetGlobalStatsQuery: jest.fn(),
}));

jest.mock("@src/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

// Mocks composants enfants avec chemins relatifs sûrs
// jest.mock("@src/components/Dashboard/DashboardCard", () => {
// jest.mock("@src/components/AdminLayout/Components/DashboardCard", () => {
//jest.mock("@/components/AdminLayout/Pages/Dashboard/DashboardCard", () => {
// jest.mock("../../../../src/components/AdminLayout/Components/Dashboard/DashboardfCard", () => {
// jest.mock("../../../../src/components/AdminLayout/components/Dashboard/DashboardCard", () => {
jest.mock("@/components/AdminLayout/components/Dashboard/DashboardCard", () => {
  const DashboardCardMock = (props: any) => (
    <div data-testid="dashboard-card">{props.title}: {props.value}</div>
  );
  DashboardCardMock.displayName = "DashboardCard";
  return DashboardCardMock;
});

jest.mock("@src/components/Charts/HorizontalBarChart", () => {
  const HorizontalBarChartMock = (props: any) => (
    <div data-testid="horizontal-bar-chart">
      {props.labels.join(",")}
    </div>
  );
  HorizontalBarChartMock.displayName = "HorizontalBarChart";
  return HorizontalBarChartMock;
});

jest.mock("@src/components/Loading/LoadingCustom", () => {
  const LoadingMock = () => <div data-testid="loading">Loading...</div>;
  LoadingMock.displayName = "LoadingCustom";
  return LoadingMock;
});

jest.mock("@src/components/Text/TextAdmin", () => {
  const TextAdminMock = (props: any) => (
    <div data-testid={`textadmin-${props.type}`}>{props.children}</div>
  );
  TextAdminMock.displayName = "TextAdmin";
  return TextAdminMock;
});

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
    expect(screen.getByTestId("loading")).toBeInTheDocument();
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

  it("renders main stats cards", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: mockData,
    });
    render(<Dashboard />);

    expect(screen.getByText("Projects: 5")).toBeInTheDocument();
    expect(screen.getByText("Skills: 10")).toBeInTheDocument();
    expect(screen.getByText("Educations: 3")).toBeInTheDocument();
    expect(screen.getByText("Experiences: 7")).toBeInTheDocument();
    expect(screen.getByText("Users: 4")).toBeInTheDocument();
  });

  it("renders average skills section", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: mockData,
    });
    render(<Dashboard />);
    expect(screen.getByText(/Average is/)).toBeInTheDocument();
    expect(screen.getByText("2.50")).toBeInTheDocument();
  });

  it("renders top skills chart", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: mockData,
    });
    render(<Dashboard />);
    const chart = screen.getByTestId("horizontal-bar-chart");
    expect(chart).toHaveTextContent("React,TypeScript");
  });

  it("renders role distribution section", () => {
    (useGetGlobalStatsQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: mockData,
    });
    render(<Dashboard />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Viewer")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });
});
