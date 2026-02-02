import { useGetBackupsListQuery, useGenerateDatabaseBackupMutation, useDeleteBackupFileMutation, GetBackupsListQuery, GenerateDatabaseBackupMutation, DeleteBackupFileMutation } from '@/types/graphql';
import { FetchResult } from '@apollo/client';

export interface BackupFileInfo {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
  modifiedAt: string;
}

export interface UseListBackupsAdminReturn {
  backups: BackupFileInfo[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export interface UseGenerateBackupAdminReturn {
  generateBackup: () => Promise<FetchResult<GenerateDatabaseBackupMutation>>;
  loading: boolean;
}

export interface UseDeleteBackupAdminReturn {
  deleteBackup: (fileName: string) => Promise<FetchResult<DeleteBackupFileMutation>>;
  loading: boolean;
}

export const useListBackupsAdmin = (): UseListBackupsAdminReturn => {
  const { data, loading, error, refetch } = useGetBackupsListQuery();

  const backups: BackupFileInfo[] =
    data?.listBackupFiles?.files
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ) ?? [];

  return {
    backups,
    loading,
    error,
    refetch: () => refetch(),
  };
};

export const useGenerateBackupAdmin = (): UseGenerateBackupAdminReturn => {
  const [generateBackupMutation, { loading }] = useGenerateDatabaseBackupMutation();

  const generateBackup = async (): Promise<FetchResult<GenerateDatabaseBackupMutation>> => {
    return await generateBackupMutation();
  };

  return {
    generateBackup,
    loading,
  };
};

export const useDeleteBackupAdmin = (): UseDeleteBackupAdminReturn => {
  const [deleteBackupMutation, { loading }] = useDeleteBackupFileMutation();

  const deleteBackup = async (fileName: string): Promise<FetchResult<DeleteBackupFileMutation>> => {
    return await deleteBackupMutation({
      variables: { fileName },
    });
  };

  return {
    deleteBackup,
    loading,
  };
};
