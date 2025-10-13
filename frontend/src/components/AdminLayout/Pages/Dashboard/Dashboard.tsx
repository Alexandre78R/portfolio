import React from "react";
import { useGetGlobalStatsQuery, GetGlobalStatsQuery } from "@/types/graphql";
import DashboardCard from "../../components/Dashboard/DashBordCard";
import { Users, FolderKanban, Brain, GraduationCap, Briefcase } from "lucide-react";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import HorizontalBarChart from "@/components/Charts/HorizontalBarChart";
import { useLang } from "@/context/Lang/LangContext";
import TextAdmin from "../../components/Text/TextAdmin";

export interface MainStat {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export interface RoleStat {
  label: string;
  value: number;
}

const Dashboard: React.FC = (): React.ReactElement => {
  const { data, loading, error } = useGetGlobalStatsQuery();

  const { translations } = useLang();

  if (loading) return <LoadingCustom />;
  if (error || !data?.getGlobalStats)
    return <p className="p-4 text-primary">{translations.messagePageDashBoardErreurData}</p>;

  const averageSkills: number = data.getAverageSkillsPerProject ?? 0;

  const globalStatsResponse: NonNullable<GetGlobalStatsQuery["getGlobalStats"]> = data.getGlobalStats!;

  const stats: NonNullable<GetGlobalStatsQuery["getGlobalStats"]["stats"]> | null = globalStatsResponse.stats ?? null;

  const roleDistribution: { admin: number; editor: number; view: number } = stats
    ? {
        admin: stats.usersByRoleAdmin,
        editor: stats.usersByRoleEditor,
        view: stats.usersByRoleView,
      }
    : { admin: 0, editor: 0, view: 0 };

  const topSkills: NonNullable<GetGlobalStatsQuery["getTopUsedSkills"]["skills"]> = data.getTopUsedSkills?.skills ?? [];

  const mainStats: MainStat[] = [
    { title: translations.messagePageDashBoardCardStatsProject, value: stats?.totalProjects ?? 0, icon: <FolderKanban size={24} />, color: "from-cyan-500 to-teal-400" },
    { title: translations.messagePageDashBoardCardStatsSkill, value: stats?.totalSkills ?? 0, icon: <Brain size={24} />, color: "from-violet-500 to-fuchsia-400" },
    { title: translations.messagePageDashBoardCardStatsEducation, value: stats?.totalEducations ?? 0, icon: <GraduationCap size={24} />, color: "from-yellow-400 to-orange-300" },
    { title: translations.messagePageDashBoardCardStatsExperience, value: stats?.totalExperiences ?? 0, icon: <Briefcase size={24} />, color: "from-pink-500 to-red-400" },
    { title: translations.messagePageDashBoardCardStatsUser, value: stats?.totalUsers ?? 0, icon: <Users size={24} />, color: "bg-blue-500 bg-cyan-400" },
  ];

  const roleStats: RoleStat[] = [
    { label: translations.messagePageDashBoardRoleAdmin, value: roleDistribution.admin },
    { label: translations.messagePageDashBoardRoleEditor, value: roleDistribution.editor },
    { label: translations.messagePageDashBoardRoleViewer, value: roleDistribution.view },
  ];

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">{translations.messagePageDashBoardTitle}</TextAdmin>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {mainStats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="bg-muted p-6 rounded-xl shadow-sm">
        <TextAdmin type="h2">{translations.messagePageDashBoardTittleSection1}</TextAdmin>
        <TextAdmin type="p">
          {translations.messagePageDashBoardMessageAverageLeft}{" "}
          <span className="text-primary font-bold">{averageSkills.toFixed(2)}</span>{" "}
          {translations.messagePageDashBoardMessageAverageRight}
        </TextAdmin>
      </section>

      <section className="bg-muted p-6 rounded-xl shadow-sm">
        <TextAdmin type="h2">{translations.messagePageDashBoardTittleSection2}</TextAdmin>
        <HorizontalBarChart
          labels={topSkills.map((skill) => skill.name)}
          data={topSkills.map((skill) => skill.usageCount)}
        />
      </section>

      <section className="bg-muted p-6 rounded-xl shadow-sm">
        <TextAdmin type="h2">{translations.messagePageDashBoardTittleSection3}</TextAdmin>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-text">
          {roleStats.map((role) => (
            <div key={role.label} className="flex flex-col items-center justify-center bg-background rounded-lg shadow-md py-4">
              <TextAdmin type="span">{role.label}</TextAdmin>
              <TextAdmin type="span">{role.value.toFixed(0)}%</TextAdmin>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;