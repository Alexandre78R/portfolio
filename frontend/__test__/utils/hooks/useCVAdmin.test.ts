import { renderHook } from '@testing-library/react';
import { useGetCVAdmin, useUploadCVAdmin } from '@/utils/hooks/useCVAdmin';
import * as graphql from '@/types/graphql';
import { FetchResult } from '@apollo/client';

jest.mock('@/types/graphql', () => ({
  useCvQuery: jest.fn(),
  useUploadCvMutation: jest.fn(),
}));

describe('useCVAdmin hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useGetCVAdmin', () => {
    it('should return CV URL from query', () => {
      const mockUseCvQuery = graphql.useCvQuery as jest.Mock<ReturnType<typeof graphql.useCvQuery>, []>;

      mockUseCvQuery.mockReturnValue({
        data: { cvUrl: '/uploads/cv.pdf' },
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetCVAdmin());

      expect(result.current.cvUrl).toBe('/uploads/cv.pdf');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading state', () => {
      const mockUseCvQuery = graphql.useCvQuery as jest.Mock<ReturnType<typeof graphql.useCvQuery>, []>;

      mockUseCvQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetCVAdmin());

      expect(result.current.loading).toBe(true);
      expect(result.current.cvUrl).toBeNull();
    });

    it('should handle missing CV URL', () => {
      const mockUseCvQuery = graphql.useCvQuery as jest.Mock<ReturnType<typeof graphql.useCvQuery>, []>;

      mockUseCvQuery.mockReturnValue({
        data: { cvUrl: null },
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useGetCVAdmin());

      expect(result.current.cvUrl).toBeNull();
    });
  });

  describe('useUploadCVAdmin', () => {
    it('should upload CV file', async () => {
      const mockUseUploadCvMutation = graphql.useUploadCvMutation as jest.Mock<
        ReturnType<typeof graphql.useUploadCvMutation>,
        []
      >;

      const mockMutation = jest
        .fn<Promise<FetchResult<any>>, [{ variables: { file: File } }]>()
        .mockResolvedValue({
          data: { uploadCV: { code: 200, message: 'Uploaded' } },
        });

      mockUseUploadCvMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useUploadCVAdmin());

      const file = new File(['content'], 'cv.pdf', { type: 'application/pdf' });
      const response = await result.current.uploadCV(file);

      expect(mockMutation).toHaveBeenCalledWith({
        variables: { file },
      });
      expect(response.data?.uploadCV.code).toBe(200);
    });

    it('should handle loading state during upload', () => {
      const mockUseUploadCvMutation = graphql.useUploadCvMutation as jest.Mock<
        ReturnType<typeof graphql.useUploadCvMutation>,
        []
      >;

      mockUseUploadCvMutation.mockReturnValue([jest.fn(), { loading: true }] as any);

      const { result } = renderHook(() => useUploadCVAdmin());

      expect(result.current.loading).toBe(true);
    });

    it('should handle upload errors', async () => {
      const mockUseUploadCvMutation = graphql.useUploadCvMutation as jest.Mock<
        ReturnType<typeof graphql.useUploadCvMutation>,
        []
      >;

      const mockMutation = jest
        .fn<Promise<FetchResult<any>>, [{ variables: { file: File } }]>()
        .mockResolvedValue({
          data: { uploadCV: { code: 400, message: 'File too large' } },
        });

      mockUseUploadCvMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useUploadCVAdmin());

      const file = new File(['content'], 'cv.pdf', { type: 'application/pdf' });
      const response = await result.current.uploadCV(file);

      expect(response.data?.uploadCV.code).toBe(400);
      expect(response.data?.uploadCV.message).toBe('File too large');
    });
  });
});
