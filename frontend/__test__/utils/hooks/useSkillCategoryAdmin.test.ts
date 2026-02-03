import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import {
  useListSkillCategoriesAdmin,
  useCreateSkillCategoryAdmin,
  useUpdateSkillCategoryAdmin,
  useDeleteSkillCategoryAdmin,
} from "@/utils/hooks/useSkillCategoryAdmin";
import {
  GetSkillsListQuery,
  CreateSkillCategoryMutation,
  UpdateSkillCategoryMutation,
  DeleteSkillCategoryMutation,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock<any, [any, any]>;
const mockUseMutation = useMutation as jest.Mock<any, [any]>;

describe("useSkillCategoryAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListSkillCategoriesAdmin", (): void => {
    it("should return skill categories data when query succeeds", async (): Promise<void> => {
      const mockData: GetSkillsListQuery = {
        listSkillCategories: {
          categories: [
            {
              id: "1",
              categoryEN: "Frontend",
              categoryFR: "Frontend",
              skills: [
                {
                  id: "1",
                  name: "React",
                  image: "react.png",
                  categoryId: "1",
                },
              ],
            },
          ],
          code: 200,
          message: "Success",
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

      const { result } = renderHook(() => useListSkillCategoriesAdmin());

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

      const { result } = renderHook(() => useListSkillCategoriesAdmin());

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

      const { result } = renderHook(() => useListSkillCategoriesAdmin());

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useCreateSkillCategoryAdmin", (): void => {
    it("should create a skill category successfully", async (): Promise<void> => {
      const mockData: CreateSkillCategoryMutation = {
        createCategory: {
          categories: [
            {
              id: "1",
              categoryEN: "New Category",
              categoryFR: "Nouvelle Catégorie",
              skills: [],
            },
          ],
          code: 201,
          message: "Created",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateSkillCategoryMutation }>, any>(
        async (): Promise<{ data?: CreateSkillCategoryMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateSkillCategoryAdmin());
      const [createCategory] = result.current;

      await act(async () => {
        const response = await createCategory({
          data: { categoryEN: "New Category", categoryFR: "Nouvelle Catégorie" },
        });
        expect(response.data).toEqual(mockData);
      });
    });

    it("should handle create error", async (): Promise<void> => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Network error"),
      });

      const mockMutate = jest.fn<Promise<{ data?: CreateSkillCategoryMutation }>, any>(
        async (): Promise<{ data?: CreateSkillCategoryMutation }> => {
          throw mockError;
        }
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: mockError }]);

      const { result } = renderHook(() => useCreateSkillCategoryAdmin());
      const [createCategory] = result.current;

      await act(async () => {
        try {
          await createCategory({ data: { categoryEN: "Test", categoryFR: "Test" } });
        } catch (err) {
          expect(err).toEqual(mockError);
        }
      });
    });
  });

  describe("useUpdateSkillCategoryAdmin", (): void => {
    it("should update a skill category successfully", async (): Promise<void> => {
      const mockData: UpdateSkillCategoryMutation = {
        updateCategory: {
          categories: [
            {
              id: "1",
              categoryEN: "Updated Category",
              categoryFR: "Catégorie Mise à Jour",
              skills: [],
            },
          ],
          code: 200,
          message: "Updated",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateSkillCategoryMutation }>, any>(
        async (): Promise<{ data?: UpdateSkillCategoryMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateSkillCategoryAdmin());
      const [updateCategory] = result.current;

      await act(async () => {
        const response = await updateCategory({
          id: 1,
          data: { categoryEN: "Updated Category", categoryFR: "Catégorie Mise à Jour" },
        });
        expect(response.data).toEqual(mockData);
      });
    });
  });

  describe("useDeleteSkillCategoryAdmin", (): void => {
    it("should delete a skill category successfully", async (): Promise<void> => {
      const mockData: DeleteSkillCategoryMutation = {
        deleteCategory: {
          code: 200,
          message: "Deleted",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteSkillCategoryMutation }>, any>(
        async (): Promise<{ data?: DeleteSkillCategoryMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteSkillCategoryAdmin());
      const [deleteCategory] = result.current;

      await act(async () => {
        const response = await deleteCategory({ id: 1 });
        expect(response.data).toEqual(mockData);
      });
    });
  });
});
