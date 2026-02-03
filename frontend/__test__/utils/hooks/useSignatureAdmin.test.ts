import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import {
  useListSignaturesAdmin,
  useCreateSignatureAdmin,
  useUpdateSignatureAdmin,
  useDeleteSignatureAdmin,
} from "@/utils/hooks/useSignatureAdmin";
import {
  GetSignaturesListQuery,
  CreateSignatureMutation,
  UpdateSignatureMutation,
  DeleteSignatureMutation,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock<any, [any, any]>;
const mockUseMutation = useMutation as jest.Mock<any, [any]>;

describe("useSignatureAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListSignaturesAdmin", (): void => {
    it("should return signatures data when query succeeds", async (): Promise<void> => {
      const mockData: GetSignaturesListQuery = {
        listAllSignatures: {
          signatures: [
            {
              id: 1,
              name: "Test Signature",
              description: "Test Description",
            },
          ],
          code: 200,
          message: "Success",
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetSignaturesListQuery }>, []>(
        async (): Promise<{ data: GetSignaturesListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should handle loading state", (): void => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("should handle error state", (): void => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Network error"),
      });

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useListSignaturesAdmin());

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useCreateSignatureAdmin", (): void => {
    it("should create a signature successfully", async (): Promise<void> => {
      const mockData: CreateSignatureMutation = {
        createSignature: {
          signature: {
            id: 1,
            name: "New Signature",
            description: "New Description",
          },
          code: 201,
          message: "Created",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateSignatureMutation }>, any>(
        async (): Promise<{ data?: CreateSignatureMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateSignatureAdmin());
      const [createSignature] = result.current;

      await act(async () => {
        const response = await createSignature({
          data: { name: "New Signature", description: "New Description" },
        });
        expect(response.data).toEqual(mockData);
      });
    });

    it("should handle create error", async (): Promise<void> => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Network error"),
      });

      const mockMutate = jest.fn<Promise<{ data?: CreateSignatureMutation }>, any>(
        async (): Promise<{ data?: CreateSignatureMutation }> => {
          throw mockError;
        }
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: mockError }]);

      const { result } = renderHook(() => useCreateSignatureAdmin());
      const [createSignature] = result.current;

      await act(async () => {
        try {
          await createSignature({ data: { name: "Test", description: "Test" } });
        } catch (err) {
          expect(err).toEqual(mockError);
        }
      });
    });
  });

  describe("useUpdateSignatureAdmin", (): void => {
    it("should update a signature successfully", async (): Promise<void> => {
      const mockData: UpdateSignatureMutation = {
        updateSignature: {
          signature: {
            id: 1,
            name: "Updated Signature",
            description: "Updated Description",
          },
          code: 200,
          message: "Updated",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateSignatureMutation }>, any>(
        async (): Promise<{ data?: UpdateSignatureMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateSignatureAdmin());
      const [updateSignature] = result.current;

      await act(async () => {
        const response = await updateSignature({
          data: { id: 1, name: "Updated Signature", description: "Updated Description" },
        });
        expect(response.data).toEqual(mockData);
      });
    });
  });

  describe("useDeleteSignatureAdmin", (): void => {
    it("should delete a signature successfully", async (): Promise<void> => {
      const mockData: DeleteSignatureMutation = {
        deleteSignature: {
          code: 200,
          message: "Deleted",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteSignatureMutation }>, any>(
        async (): Promise<{ data?: DeleteSignatureMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteSignatureAdmin());
      const [deleteSignature] = result.current;

      await act(async () => {
        const response = await deleteSignature({ id: 1 });
        expect(response.data).toEqual(mockData);
      });
    });
  });
});
