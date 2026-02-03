import {
  useQuery,
  useMutation,
  ApolloError,
} from "@apollo/client";
import {
  GetExperiencesListQuery,
  GetExperiencesListQueryVariables,
  CreateExperienceMutation,
  CreateExperienceMutationVariables,
  UpdateExperienceMutation,
  UpdateExperienceMutationVariables,
  DeleteExperienceMutation,
  DeleteExperienceMutationVariables,
} from "@/types/graphql";
import { GET_EXPERIENCES_LIST } from "@/requetes/queries/experiences.queries";
import { CREATE_EXPERIENCE, UPDATE_EXPERIENCE, DELETE_EXPERIENCE } from "@/requetes/mutations/experiences.mutations";

interface ExperienceAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetExperiencesListQuery }>;
  data: GetExperiencesListQuery | undefined;
}

export const useListExperiencesAdmin = (): ExperienceAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetExperiencesListQuery,
    GetExperiencesListQueryVariables
  >(GET_EXPERIENCES_LIST, {
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

export const useCreateExperienceAdmin = (): [
  (variables: CreateExperienceMutationVariables) => Promise<{ data?: CreateExperienceMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createExperience, { loading, error }] = useMutation<
    CreateExperienceMutation,
    CreateExperienceMutationVariables
  >(CREATE_EXPERIENCE);

  return [
    async (variables: CreateExperienceMutationVariables) => {
      try {
        const result = await createExperience({ variables });
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create experience error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateExperienceAdmin = (): [
  (variables: UpdateExperienceMutationVariables) => Promise<{ data?: UpdateExperienceMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateExperience, { loading, error }] = useMutation<
    UpdateExperienceMutation,
    UpdateExperienceMutationVariables
  >(UPDATE_EXPERIENCE);

  return [
    async (variables: UpdateExperienceMutationVariables) => {
      try {
        const result = await updateExperience({ variables });
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update experience error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteExperienceAdmin = (): [
  (variables: DeleteExperienceMutationVariables) => Promise<{ data?: DeleteExperienceMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteExperience, { loading, error }] = useMutation<
    DeleteExperienceMutation,
    DeleteExperienceMutationVariables
  >(DELETE_EXPERIENCE);

  return [
    async (variables: DeleteExperienceMutationVariables) => {
      try {
        const result = await deleteExperience({ variables });
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete experience error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
