import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListSkillsAdmin, useCreateSkillAdmin, useUpdateSkillAdmin, useDeleteSkillAdmin } from "@/utils/hooks/useSkillAdmin";
import {
  GetSkillsListQuery,
  GetSkillsListQueryVariables,
  CreateSkillMutation,
  CreateSkillMutationVariables,
  UpdateSkillMutation,
  UpdateSkillMutationVariables,
  DeleteSkillMutation,
  DeleteSkillMutationVariables,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

describe("useSkillAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListSkillsAdmin", (): void => {
    it("should return skills data when query succeeds", async (): Promise<void> => {
      const mockData: GetSkillsListQuery = {
        listSkillCategories: {
          __typename: "SkillCategoriesPayload",
          categories: [
            {
              __typename: "SkillCategory",
              id: "1",
              categoryFR: "Catégorie",
              categoryEN: "Category",
              skills: [
                {
                  __typename: "Skill",
                  id: "1",
                  name: "JavaScript",
                  image: "js.png",
                },
              ],
            },
          ],
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetSkillsListQuery }>, []>(
        async (): Promise<{ data: GetSkillsListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListSkillsAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should handle loading and error states", (): void => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Load error"),
      });

      mockUseQuery.mockReturnValueOnce({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      });

      const { result: resultLoading } = renderHook(() => useListSkillsAdmin());
      expect(resultLoading.current.loading).toBe(true);

      mockUseQuery.mockReturnValueOnce({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result: resultError } = renderHook(() => useListSkillsAdmin());
      expect(resultError.current.error).toEqual(mockError);
    });
  });

  describe("useCreateSkillAdmin", (): void => {
    it("should create a skill successfully", async (): Promise<void> => {
      const mockData: CreateSkillMutation = {
        createSkill: {
          __typename: "Skill",
          id: "1",
          name: "TypeScript",
          image: "ts.png",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateSkillMutation }>, [{ variables: CreateSkillMutationVariables }]>(
        async (): Promise<{ data?: CreateSkillMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateSkillAdmin());
      const [createSkill, { loading, error }] = result.current;

      expect(loading).toBe(false);
      expect(error).toBeUndefined();

      const variables: CreateSkillMutationVariables = {
        data: {
          name: "TypeScript",
          image: "ts.png",
        },
      };

      await act(async () => {
        await createSkill(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useUpdateSkillAdmin", (): void => {
    it("should update a skill successfully", async (): Promise<void> => {
      const mockData: UpdateSkillMutation = {
        updateSkill: {
          __typename: "Skill",
          id: "1",
          name: "TypeScript Updated",
          image: "ts-updated.png",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateSkillMutation }>, [{ variables: UpdateSkillMutationVariables }]>(
        async (): Promise<{ data?: UpdateSkillMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateSkillAdmin());
      const [updateSkill] = result.current;

      const variables: UpdateSkillMutationVariables = {
        id: "1",
        data: {
          name: "TypeScript Updated",
          image: "ts-updated.png",
        },
      };

      await act(async () => {
        await updateSkill(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteSkillAdmin", (): void => {
    it("should delete a skill successfully", async (): Promise<void> => {
      const mockData: DeleteSkillMutation = {
        deleteSkill: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteSkillMutation }>, [{ variables: DeleteSkillMutationVariables }]>(
        async (): Promise<{ data?: DeleteSkillMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteSkillAdmin());
      const [deleteSkill] = result.current;

      const variables: DeleteSkillMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteSkill(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
