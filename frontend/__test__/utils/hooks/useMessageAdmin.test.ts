import { renderHook } from '@testing-library/react';
import { useListSignaturesAdmin, useSendMessageAdmin } from '@/utils/hooks/useMessageAdmin';
import * as graphql from '@/types/graphql';
import { FetchResult } from '@apollo/client';

jest.mock('@/types/graphql', () => ({
  useGetSignaturesListQuery: jest.fn(),
  useSendMessageMutation: jest.fn(),
}));

describe('useMessageAdmin hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useListSignaturesAdmin', () => {
    it('should return list of signatures', () => {
      const mockUseGetSignaturesListQuery = graphql.useGetSignaturesListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetSignaturesListQuery>,
        [{ fetchPolicy: string }]
      >;

      mockUseGetSignaturesListQuery.mockReturnValue({
        data: {
          listAllSignatures: {
            signatures: [
              { id: 1, name: 'Signature 1', description: 'Desc 1' },
              { id: 2, name: 'Signature 2', description: 'Desc 2' },
            ],
          },
        },
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.signatures).toHaveLength(2);
      expect(result.current.signatures[0].name).toBe('Signature 1');
      expect(result.current.signatures[1].id).toBe(2);
      expect(result.current.loading).toBe(false);
    });

    it('should handle loading state', () => {
      const mockUseGetSignaturesListQuery = graphql.useGetSignaturesListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetSignaturesListQuery>,
        [{ fetchPolicy: string }]
      >;

      mockUseGetSignaturesListQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.loading).toBe(true);
      expect(result.current.signatures).toEqual([]);
    });

    it('should handle empty signatures', () => {
      const mockUseGetSignaturesListQuery = graphql.useGetSignaturesListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetSignaturesListQuery>,
        [{ fetchPolicy: string }]
      >;

      mockUseGetSignaturesListQuery.mockReturnValue({
        data: { listAllSignatures: { signatures: null } },
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.signatures).toEqual([]);
    });

    it('should filter out null signatures', () => {
      const mockUseGetSignaturesListQuery = graphql.useGetSignaturesListQuery as jest.Mock<
        ReturnType<typeof graphql.useGetSignaturesListQuery>,
        [{ fetchPolicy: string }]
      >;

      mockUseGetSignaturesListQuery.mockReturnValue({
        data: {
          listAllSignatures: {
            signatures: [
              { id: 1, name: 'Signature 1', description: 'Desc 1' },
              null,
              { id: 2, name: 'Signature 2', description: 'Desc 2' },
            ],
          },
        },
        loading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.signatures).toHaveLength(2);
      expect(result.current.signatures[0].id).toBe(1);
      expect(result.current.signatures[1].id).toBe(2);
    });
  });

  describe('useSendMessageAdmin', () => {
    it('should send message', async () => {
      const mockUseSendMessageMutation = graphql.useSendMessageMutation as jest.Mock<
        ReturnType<typeof graphql.useSendMessageMutation>,
        []
      >;

      const mockMutation = jest
        .fn<Promise<FetchResult<any>>, [{ variables: any }]>()
        .mockResolvedValue({
          data: { sendMessage: { code: 200, message: 'Message sent' } },
        });

      mockUseSendMessageMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useSendMessageAdmin());

      const variables = {
        subject: 'Test',
        content: 'Test content',
        recipients: 'test@example.com',
      };

      const response = await result.current.sendMessage(variables);

      expect(mockMutation).toHaveBeenCalledWith({
        variables,
      });
      expect(response.data?.sendMessage.code).toBe(200);
    });

    it('should handle loading state during send', () => {
      const mockUseSendMessageMutation = graphql.useSendMessageMutation as jest.Mock<
        ReturnType<typeof graphql.useSendMessageMutation>,
        []
      >;

      mockUseSendMessageMutation.mockReturnValue([jest.fn(), { loading: true }] as any);

      const { result } = renderHook(() => useSendMessageAdmin());

      expect(result.current.loading).toBe(true);
    });

    it('should handle send errors', async () => {
      const mockUseSendMessageMutation = graphql.useSendMessageMutation as jest.Mock<
        ReturnType<typeof graphql.useSendMessageMutation>,
        []
      >;

      const mockMutation = jest
        .fn<Promise<FetchResult<any>>, [{ variables: any }]>()
        .mockResolvedValue({
          data: { sendMessage: { code: 400, message: 'Invalid recipients' } },
        });

      mockUseSendMessageMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useSendMessageAdmin());

      const variables = {
        subject: 'Test',
        content: 'Test content',
        recipients: 'invalid',
      };

      const response = await result.current.sendMessage(variables);

      expect(response.data?.sendMessage.code).toBe(400);
    });

    it('should handle message with null response', async () => {
      const mockUseSendMessageMutation = graphql.useSendMessageMutation as jest.Mock<
        ReturnType<typeof graphql.useSendMessageMutation>,
        []
      >;

      const mockMutation = jest
        .fn<Promise<FetchResult<any>>, [{ variables: any }]>()
        .mockResolvedValue({
          data: { sendMessage: null },
        });

      mockUseSendMessageMutation.mockReturnValue([mockMutation, { loading: false }] as any);

      const { result } = renderHook(() => useSendMessageAdmin());

      const variables = {
        subject: 'Test',
        content: 'Test content',
        recipients: 'test@example.com',
      };

      const response = await result.current.sendMessage(variables);

      expect(response.data?.sendMessage).toBeNull();
    });
  });
});
