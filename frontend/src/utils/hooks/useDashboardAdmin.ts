import { useGetGlobalStatsQuery, GetGlobalStatsQuery } from '@/types/graphql';

export interface RoleStat {
  label: string;
  value: number;
}

export interface MainStat {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export interface UseGetDashboardAdminReturn {
  data: GetGlobalStatsQuery | undefined;
  loading: boolean;
  error: any;
}

export const useGetDashboardAdmin = (): UseGetDashboardAdminReturn => {
  const { data, loading, error } = useGetGlobalStatsQuery();

  return {
    data,
    loading,
    error,
  };
};
