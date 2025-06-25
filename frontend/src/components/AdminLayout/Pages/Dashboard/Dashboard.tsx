import { useEffect, useState } from 'react';
import { 
  useGetGlobalStatsQuery,
  GetGlobalStatsQuery,
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

const Dashboard = (): React.ReactElement => {
  const { data , loading, error } = useGetGlobalStatsQuery();
  const [stats, setStats] = useState<GetGlobalStatsQuery | null>(null);

  useEffect(() => {
    console.log("Dashboard data:", data);
    if (data) {
      setStats(data);
    } else {
      setStats(null);
    }
  }, [data])

  if (loading) return <LoadingCustom />;
  if (error || !data?.getGlobalStats) return <p className="p-4 text-primary">Erreur lors du chargement des statistiques.</p>;


  const mainStats = [
    { title: "Utilisateurs", value: stats?.getGlobalStats.stats?.totalUsers ?? 0, icon: <Users size={24} />, color: "bg-blue-500 bg-cyan-400" },
    { title: "Projets", value: stats?.getGlobalStats.stats?.totalProjects ?? 0, icon: <FolderKanban size={24} />, color: "from-cyan-500 to-teal-400" },
    { title: "Compétences", value: stats?.getGlobalStats.stats?.totalSkills ?? 0, icon: <Brain size={24} />, color: "from-violet-500 to-fuchsia-400" },
    { title: "Formations", value: stats?.getGlobalStats.stats?.totalEducations ?? 0, icon: <GraduationCap size={24} />, color: "from-yellow-400 to-orange-300" },
    { title: "Expériences", value: stats?.getGlobalStats.stats?.totalExperiences ?? 0, icon: <Briefcase size={24} />, color: "from-pink-500 to-red-400" },
  ];
  
  return (  
    <>
      <h1 className="text-2xl font-bold text-primary">Tableau de bord</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-6">
        {mainStats.map((stat) => (
            <DashboardCard key={stat.title} {...stat} />
        ))}
      </section>
    </>
  )
}

export default Dashboard;