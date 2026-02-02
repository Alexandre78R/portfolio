import { useCvQuery, useUploadCvMutation, UploadCvMutation } from '@/types/graphql';
import { FetchResult } from '@apollo/client';

export interface UseGetCVAdminReturn {
  cvUrl: string | null;
  loading: boolean;
  error: any;
}

export interface UseUploadCVAdminReturn {
  uploadCV: (file: File) => Promise<FetchResult<UploadCvMutation>>;
  loading: boolean;
}

export const useGetCVAdmin = (): UseGetCVAdminReturn => {
  const { data, loading, error } = useCvQuery();

  return {
    cvUrl: data?.cvUrl || null,
    loading,
    error,
  };
};

export const useUploadCVAdmin = (): UseUploadCVAdminReturn => {
  const [uploadCvMutation, { loading }] = useUploadCvMutation();

  const uploadCV = async (file: File): Promise<FetchResult<UploadCvMutation>> => {
    return await uploadCvMutation({
      variables: { file },
    });
  };

  return {
    uploadCV,
    loading,
  };
};
