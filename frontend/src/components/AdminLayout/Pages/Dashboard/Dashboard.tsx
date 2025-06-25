import { 
  useGetGlobalStatsQuery,
} from '@/types/graphql';
import DashboardCard from '../../components/Dashboard/DashBordCard';
import { 
  Users,
  FolderKanban,
  Brain,
  GraduationCap,
  Briefcase
} from "lucide-react";
import LoadingCustom from '@/components/Loading/LoadingCustom';
// import HorizontalBarChart from '@/components/Charts/HorizontalBarChart';

const Dashboard = (): React.ReactElement => {
  const { data , loading, error } = useGetGlobalStatsQuery();
  
  if (loading) return <LoadingCustom />;
  if (error || !data?.getGlobalStats) return <p className="p-4 text-primary">Erreur lors du chargement des statistiques.</p>;
  
    const stats = data.getGlobalStats.stats;
    const averageSkills = data.getAverageSkillsPerProject;
    const roleDistribution = data.getUsersRoleDistribution;
    const topSkills = data.getTopUsedSkills.skills;

  const mainStats = [
    { title: "Projets", value: stats?.totalProjects ?? 0, icon: <FolderKanban size={24} />, color: "from-cyan-500 to-teal-400" },
    { title: "Compétences", value: stats?.totalSkills ?? 0, icon: <Brain size={24} />, color: "from-violet-500 to-fuchsia-400" },
    { title: "Formations", value: stats?.totalEducations ?? 0, icon: <GraduationCap size={24} />, color: "from-yellow-400 to-orange-300" },
    { title: "Expériences", value: stats?.totalExperiences ?? 0, icon: <Briefcase size={24} />, color: "from-pink-500 to-red-400" },
    { title: "Utilisateurs", value: stats?.totalUsers ?? 0, icon: <Users size={24} />, color: "bg-blue-500 bg-cyan-400" },
  ];
  
  return (  
    <div className="space-y-10">
      {/* <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {mainStats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="bg-muted p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Moyenne de compétences par projet
        </h2>
        <p className="text-muted-foreground text-l text-text">
          Chaque projet utilise en moyenne{' '}
          <span className="text-primary font-bold">
            {averageSkills.toFixed(2)}
          </span>{' '}
          compétences.
        </p>
      </section> */}


      {/* <section className="bg-muted p-6 rounded-xl shadow-sm mb-20">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Les compétences les plus utilisées
        </h2>
        <ul className="divide-y divide-border">
          {topSkills.map((skill) => (
            <li
              key={skill.id}
              className="flex justify-between items-center py-3"
            >
              <span className="text-muted-foreground text-text">{skill.name}</span>
              <span className="font-semibold text-primary">
                {skill.usageCount} projets
              </span>
            </li>
          ))}
        </ul>
      </section> */}

      {/* <section className="bg-muted p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Compétences les plus utilisées (Top 5)
        </h2>

        <DoughnutChart
          title="Répartition par usage"
          labels={topSkills.map(skill => skill.name)}
          data={topSkills.map(skill => skill.usageCount)}
        />
      </section> */}

      {/* <section className="bg-muted p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Compétences les plus utilisées (Top 5)
        </h2>

        <HorizontalBarChart
          labels={topSkills.map(skill => skill.name)}
          data={topSkills.map(skill => skill.usageCount)}
        />
      </section> */}

      {/* <section className="bg-muted p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Répartition des rôles utilisateurs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-text">
          {[
            { label: 'Administrateurs', value: roleDistribution?.admin ?? 0 },
            { label: 'Éditeurs', value: roleDistribution?.editor ?? 0 },
            { label: 'Lecteurs', value: roleDistribution?.view ?? 0 },
          ].map((role) => (
            <div
              key={role.label}
              className="flex flex-col items-center justify-center bg-background rounded-lg shadow-md py-4"
            >
              <span className="text-muted-foreground">{role.label}</span>
              <span className="text-2xl font-bold text-primary">
                {role.value.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </section> */}

    </div>
  )
}

export default Dashboard;