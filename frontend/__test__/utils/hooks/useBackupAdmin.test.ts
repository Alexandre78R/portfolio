import { renderHook, waitFor } from '@testing-library/react';
import {
  useListBackupsAdmin,
  useGenerateBackupAdmin,
  useDeleteBackupAdmin,
} from '@/utils/hooks/useBackupAdmin';
import * as graphql from '@/types/graphql';
import { FetchResult } from '@apollo/client';

jest.mock('@/types/graphql', () => ({
  useGetBackupsListQuery: jest.fn(),
  useGenerateDatabaseBackupMutation: jest.fn(),
  useDeleteBackupFileMutation: jest.fn(),
}));

describe('useBackupAdmin hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useListBackupsAdmin', () => {
    it('should return sorted backups', () => {
      const mockBackups = [
        {
          fileName: 'backup2.sql',
          sizeBytes: 2000,
          createdAt: '2024-01-02',
          modifiedAt: '2024-01-02',
        },
        {
          fileName: 'backup1.sql',
          sizeBytes: 1000,
          createdAt: '2024-01-01',
          modifiedAt: '2024-01-01',
        },
      ];

      const mockUseGetBackupsListQuery = graphql.useGetBackupsListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetBackupsListQuery>,
        []
      >;

      mockUseGetBackupsListQuery.mockReturnValue({
        data: { listBackupFiles: { files: mockBackups } },
        loading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useListBackupsAdmin());

      expect(result.current.backups).toHaveLength(2);
      expect(result.current.backups[0].fileName).toBe('backup2.sql');
      expect(result.current.loading).toBe(false);
    });

    it('should handle loading state', () => {
      const mockUseGetBackupsListQuery = graphql.useGetBackupsListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetBackupsListQuery>,
        []
      >;

      mockUseGetBackupsListQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: null,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useListBackupsAdmin());

      expect(result.current.loading).toBe(true);
      expect(result.current.backups).toEqual([]);
    });

    it('should handle empty backups', () => {
      const mockUseGetBackupsListQuery = graphql.useGetBackupsListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetBackupsListQuery>,
        []
      >;

      mockUseGetBackupsListQuery.mockReturnValue({
        data: { listBackupFiles: { files: null } },
        loading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      const { result } = renderHook(() => useListBackupsAdmin());

      expect(result.current.backups).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useGenerateBackupAdmin', () => {
    it('should generate backup', async () => {
      const mockGenerateBackupMutation = graphql.useGenerateDatabaseBackupMutation as jest.Mock<
        ReturnType<typeof graphql.useGenerateDatabaseBackupMutation>,
        []
      >;

      const mockMutation = jest.fn<Promise<FetchResult<any>>, []>().mockResolvedValue({
        data: { generateDatabaseBackup: { code: 200 } },
      });

      mockGenerateBackupMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useGenerateBackupAdmin());

      const response = await result.current.generateBackup();

      expect(mockMutation).toHaveBeenCalled();
      expect(response.data?.generateDatabaseBackup.code).toBe(200);
    });

    it('should handle loading state during backup generation', () => {
      const mockGenerateBackupMutation = graphql.useGenerateDatabaseBackupMutation as jest.Mock<
        ReturnType<typeof graphql.useGenerateDatabaseBackupMutation>,
        []
      >;

      mockGenerateBackupMutation.mockReturnValue([jest.fn(), { loading: true }] as any);

      const { result } = renderHook(() => useGenerateBackupAdmin());

      expect(result.current.loading).toBe(true);
    });
  });

  describe('useDeleteBackupAdmin', () => {
    it('should delete backup file', async () => {
      const mockDeleteBackupMutation = graphql.useDeleteBackupFileMutation as jest.Mock<
        ReturnType<typeof graphql.useDeleteBackupFileMutation>,
        []
      >;

      const mockMutation = jest
        .fn<Promise<FetchResult<any>>, [{ variables: { fileName: string } }]>()
        .mockResolvedValue({
          data: { deleteBackupFile: { code: 200 } },
        });

      mockDeleteBackupMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useDeleteBackupAdmin());

      const response = await result.current.deleteBackup('backup.sql');

      expect(mockMutation).toHaveBeenCalledWith({
        variables: { fileName: 'backup.sql' },
      });
      expect(response.data?.deleteBackupFile.code).toBe(200);
    });

    it('should handle loading state during deletion', () => {
      const mockDeleteBackupMutation = graphql.useDeleteBackupFileMutation as jest.Mock<
        ReturnType<typeof graphql.useDeleteBackupFileMutation>,
        []
      >;

      mockDeleteBackupMutation.mockReturnValue([jest.fn(), { loading: true }] as any);

      const { result } = renderHook(() => useDeleteBackupAdmin());

      expect(result.current.loading).toBe(true);
    });
  });
});
