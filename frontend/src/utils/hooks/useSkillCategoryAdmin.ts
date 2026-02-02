import {
  useQuery,
  useMutation,
  QueryResult,
  MutationTuple,
  ApolloError,
} from "@apollo/client";
import {
  GetSkillsListQuery,
  GetSkillsListQueryVariables,
  CreateSkillCategoryMutation,
  CreateSkillCategoryMutationVariables,
  UpdateSkillCategoryMutation,
  UpdateSkillCategoryMutationVariables,
  DeleteSkillCategoryMutation,
  DeleteSkillCategoryMutationVariables,
} from "@/types/graphql";
import { GET_SKILLS_LIST } from "@/requetes/queries/skillCategories.queries";
import {
  CREATE_SKILL_CATEGORY,
  UPDATE_SKILL_CATEGORY,
  DELETE_SKILL_CATEGORY,
} from "@/requetes/mutations/skillCategories.mutations";

interface SkillCategoryAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetSkillsListQuery }>;
  data: GetSkillsListQuery | undefined;
}

interface SkillCategoryMutationResult {
  mutate: (
    variables:
      | CreateSkillCategoryMutationVariables
      | UpdateSkillCategoryMutationVariables
      | DeleteSkillCategoryMutationVariables
  ) => Promise<{
    data?: CreateSkillCategoryMutation | UpdateSkillCategoryMutation | DeleteSkillCategoryMutation;
  }>;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useListSkillCategoriesAdmin = (): SkillCategoryAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetSkillsListQuery,
    GetSkillsListQueryVariables
  >(GET_SKILLS_LIST, {
    fetchPolicy: "cache-and-network",
  });

  return {
    data,
    loading,
    error,
    refetch: async () => {
      const result = await refetch();
      return result;
    },
  };
};

export const useCreateSkillCategoryAdmin = (): [
  (variables: CreateSkillCategoryMutationVariables) => Promise<{
    data?: CreateSkillCategoryMutation;
  }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createCategory, { loading, error }] = useMutation<
    CreateSkillCategoryMutation,
    CreateSkillCategoryMutationVariables
  >(CREATE_SKILL_CATEGORY);

  return [
    async (variables: CreateSkillCategoryMutationVariables) => {
      try {
        const result = await createCategory({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create skill category error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateSkillCategoryAdmin = (): [
  (variables: UpdateSkillCategoryMutationVariables) => Promise<{
    data?: UpdateSkillCategoryMutation;
  }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateCategory, { loading, error }] = useMutation<
    UpdateSkillCategoryMutation,
    UpdateSkillCategoryMutationVariables
  >(UPDATE_SKILL_CATEGORY);

  return [
    async (variables: UpdateSkillCategoryMutationVariables) => {
      try {
        const result = await updateCategory({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update skill category error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteSkillCategoryAdmin = (): [
  (variables: DeleteSkillCategoryMutationVariables) => Promise<{
    data?: DeleteSkillCategoryMutation;
  }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteCategory, { loading, error }] = useMutation<
    DeleteSkillCategoryMutation,
    DeleteSkillCategoryMutationVariables
  >(DELETE_SKILL_CATEGORY);

  return [
    async (variables: DeleteSkillCategoryMutationVariables) => {
      try {
        const result = await deleteCategory({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete skill category error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
