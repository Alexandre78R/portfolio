import {
  useQuery,
  useMutation,
  ApolloError,
} from "@apollo/client";
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
import { GET_SKILLS_LIST } from "@/requetes/queries/skillCategories.queries";
import { CREATE_SKILL, UPDATE_SKILL, DELETE_SKILL } from "@/requetes/mutations/skills.mutations";

interface SkillAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetSkillsListQuery }>;
  data: GetSkillsListQuery | undefined;
}

export const useListSkillsAdmin = (): SkillAdminResult => {
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

export const useCreateSkillAdmin = (): [
  (variables: CreateSkillMutationVariables) => Promise<{ data?: CreateSkillMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createSkill, { loading, error }] = useMutation<
    CreateSkillMutation,
    CreateSkillMutationVariables
  >(CREATE_SKILL);

  return [
    async (variables: CreateSkillMutationVariables) => {
      try {
        const result = await createSkill({ variables });
        // Ensure data is undefined if null
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create skill error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateSkillAdmin = (): [
  (variables: UpdateSkillMutationVariables) => Promise<{ data?: UpdateSkillMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateSkill, { loading, error }] = useMutation<
    UpdateSkillMutation,
    UpdateSkillMutationVariables
  >(UPDATE_SKILL);

  return [
    async (variables: UpdateSkillMutationVariables) => {
      try {
        const result = await updateSkill({ variables });
        // Ensure data is undefined if null
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update skill error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteSkillAdmin = (): [
  (variables: DeleteSkillMutationVariables) => Promise<{ data?: DeleteSkillMutation }> ,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteSkill, { loading, error }] = useMutation<
    DeleteSkillMutation,
    DeleteSkillMutationVariables
  >(DELETE_SKILL);

  return [
    async (variables: DeleteSkillMutationVariables) => {
      try {
        const result = await deleteSkill({ variables });
        // Ensure data is undefined if null
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete skill error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
