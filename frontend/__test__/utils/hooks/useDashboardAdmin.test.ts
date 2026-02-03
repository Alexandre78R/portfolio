import { renderHook } from '@testing-library/react';
import { useGetDashboardAdmin } from '@/utils/hooks/useDashboardAdmin';
import * as graphql from '@/types/graphql';

jest.mock('@/types/graphql', () => ({
  useGetGlobalStatsQuery: jest.fn(),
}));

describe('useDashboardAdmin hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useGetDashboardAdmin', () => {
    it('should return dashboard data', () => {
      const mockUseGetGlobalStatsQuery = graphql.useGetGlobalStatsQuery as jest.Mock<
        ReturnType<typeof graphql.useGetGlobalStatsQuery>,
        []
      >;

      const mockData = {
        getGlobalStats: {
          stats: {
            totalProjects: 5,
            totalSkills: 10,
            totalEducations: 3,
            totalExperiences: 2,
            totalUsers: 1,
            usersByRoleAdmin: 1,
            usersByRoleEditor: 0,
            usersByRoleView: 0,
          },
        },
        getTopUsedSkills: {
          skills: [
            { name: 'React', usageCount: 5 },
            { name: 'TypeScript', usageCount: 4 },
          ],
        },
      };

      mockUseGetGlobalStatsQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetDashboardAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading state', () => {
      const mockUseGetGlobalStatsQuery = graphql.useGetGlobalStatsQuery as jest.Mock<
        ReturnType<typeof graphql.useGetGlobalStatsQuery>,
        []
      >;

      mockUseGetGlobalStatsQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetDashboardAdmin());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const mockUseGetGlobalStatsQuery = graphql.useGetGlobalStatsQuery as jest.Mock<
        ReturnType<typeof graphql.useGetGlobalStatsQuery>,
        []
      >;

      const mockError = new Error('Failed to fetch');
      mockUseGetGlobalStatsQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
      } as any);

      const { result } = renderHook(() => useGetDashboardAdmin());

      expect(result.current.error).toEqual(mockError);
      expect(result.current.loading).toBe(false);
    });

    it('should return null data when query returns no data', () => {
      const mockUseGetGlobalStatsQuery = graphql.useGetGlobalStatsQuery as jest.Mock<
        ReturnType<typeof graphql.useGetGlobalStatsQuery>,
        []
      >;

      mockUseGetGlobalStatsQuery.mockReturnValue({
        data: null,
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetDashboardAdmin());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should handle partial data', () => {
      const mockUseGetGlobalStatsQuery = graphql.useGetGlobalStatsQuery as jest.Mock<
        ReturnType<typeof graphql.useGetGlobalStatsQuery>,
        []
      >;

      const mockData = {
        getGlobalStats: {
          stats: {
            totalProjects: 5,
          },
        },
        getTopUsedSkills: {
          skills: [],
        },
      };

      mockUseGetGlobalStatsQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetDashboardAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.data?.getGlobalStats?.stats?.totalProjects).toBe(5);
    });

    it('should handle undefined stats', () => {
      const mockUseGetGlobalStatsQuery = graphql.useGetGlobalStatsQuery as jest.Mock<
        ReturnType<typeof graphql.useGetGlobalStatsQuery>,
        []
      >;

      const mockData = {
        getGlobalStats: undefined,
        getTopUsedSkills: undefined,
      };

      mockUseGetGlobalStatsQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetDashboardAdmin());

      expect(result.current.data).toEqual(mockData);
    });
  });
});
