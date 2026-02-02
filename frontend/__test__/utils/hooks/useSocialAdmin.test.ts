import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListSocialsAdmin, useCreateSocialAdmin, useUpdateSocialAdmin, useDeleteSocialAdmin } from "@/utils/hooks/useSocialAdmin";
import {
  GetSocialsListQuery,
  GetSocialsListQueryVariables,
  CreateSocialMutation,
  CreateSocialMutationVariables,
  UpdateSocialMutation,
  UpdateSocialMutationVariables,
  DeleteSocialMutation,
  DeleteSocialMutationVariables,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

describe("useSocialAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListSocialsAdmin", (): void => {
    it("should return socials data", async (): Promise<void> => {
      const mockData: GetSocialsListQuery = {
        listSocials: [
          {
            __typename: "Social",
            id: "1",
            title: "GitHub",
            url: "https://github.com",
            tab: true,
          },
        ],
      };

      const mockRefetch = jest.fn<Promise<{ data: GetSocialsListQuery }>, []>(
        async (): Promise<{ data: GetSocialsListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListSocialsAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe("useCreateSocialAdmin", (): void => {
    it("should create a social successfully", async (): Promise<void> => {
      const mockData: CreateSocialMutation = {
        createSocial: {
          __typename: "Social",
          id: "1",
          title: "LinkedIn",
          url: "https://linkedin.com",
          tab: true,
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateSocialMutation }>, [{ variables: CreateSocialMutationVariables }]>(
        async (): Promise<{ data?: CreateSocialMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateSocialAdmin());
      const [createSocial] = result.current;

      const variables: CreateSocialMutationVariables = {
        data: {
          title: "LinkedIn",
          url: "https://linkedin.com",
          tab: true,
        },
      };

      await act(async () => {
        await createSocial(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useUpdateSocialAdmin", (): void => {
    it("should update a social successfully", async (): Promise<void> => {
      const mockData: UpdateSocialMutation = {
        updateSocial: {
          __typename: "Social",
          id: "1",
          title: "LinkedIn Updated",
          url: "https://linkedin.com/updated",
          tab: false,
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateSocialMutation }>, [{ variables: UpdateSocialMutationVariables }]>(
        async (): Promise<{ data?: UpdateSocialMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateSocialAdmin());
      const [updateSocial] = result.current;

      const variables: UpdateSocialMutationVariables = {
        data: {
          id: "1",
          title: "LinkedIn Updated",
          url: "https://linkedin.com/updated",
          tab: false,
        },
      };

      await act(async () => {
        await updateSocial(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteSocialAdmin", (): void => {
    it("should delete a social successfully", async (): Promise<void> => {
      const mockData: DeleteSocialMutation = {
        deleteSocial: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteSocialMutation }>, [{ variables: DeleteSocialMutationVariables }]>(
        async (): Promise<{ data?: DeleteSocialMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteSocialAdmin());
      const [deleteSocial] = result.current;

      const variables: DeleteSocialMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteSocial(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
