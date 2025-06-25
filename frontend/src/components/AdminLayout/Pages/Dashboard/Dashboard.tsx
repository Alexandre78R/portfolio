import { useEffect, useState } from 'react';
import { 
  useGetGlobalStatsQuery,
  GetGlobalStatsQuery,
} from '@/types/graphql';


const Dashboard = (): React.ReactElement => {
  const { data , loading } = useGetGlobalStatsQuery();
  const [stats, setStats] = useState<GetGlobalStatsQuery | null>(null);

  useEffect(() => {
    // console.log("data", data);
    if (data) {
      setStats(data);
    } else {
      setStats(null);
    }
  }, [data])
  
  return (  
    <>
      <p className="text-primary">Page Dashboard</p>
      <p className='text-primary'>{stats?.getGlobalStats.stats?.totalExperiences}</p>
    </>
  )
}

export default Dashboard;