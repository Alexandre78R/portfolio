import {
  useQuery,
  useMutation,
  ApolloError,
} from "@apollo/client";
import {
  GetEducationsListQuery,
  GetEducationsListQueryVariables,
  CreateEducationMutation,
  CreateEducationMutationVariables,
  UpdateEducationMutation,
  UpdateEducationMutationVariables,
  DeleteEducationMutation,
  DeleteEducationMutationVariables,
} from "@/types/graphql";
import { GET_EDUCATIONS_LIST } from "@/requetes/queries/educations.queries";
import { CREATE_EDUCATION, UPDATE_EDUCATION, DELETE_EDUCATION } from "@/requetes/mutations/educations.mutations";

interface EducationAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetEducationsListQuery }>;
  data: GetEducationsListQuery | undefined;
}

export const useListEducationsAdmin = (): EducationAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetEducationsListQuery,
    GetEducationsListQueryVariables
  >(GET_EDUCATIONS_LIST, {
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

export const useCreateEducationAdmin = (): [
  (variables: CreateEducationMutationVariables) => Promise<{ data?: CreateEducationMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createEducation, { loading, error }] = useMutation<
    CreateEducationMutation,
    CreateEducationMutationVariables
  >(CREATE_EDUCATION);

  return [
    async (variables: CreateEducationMutationVariables) => {
      try {
        const result = await createEducation({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create education error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateEducationAdmin = (): [
  (variables: UpdateEducationMutationVariables) => Promise<{ data?: UpdateEducationMutation | undefined }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateEducation, { loading, error }] = useMutation<
    UpdateEducationMutation,
    UpdateEducationMutationVariables
  >(UPDATE_EDUCATION);

  return [
    async (variables: UpdateEducationMutationVariables) => {
      try {
        const result = await updateEducation({ variables });
        // Ensure data is undefined if null
        return { ...result, data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update education error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteEducationAdmin = (): [
  (variables: DeleteEducationMutationVariables) => Promise<{ data?: DeleteEducationMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteEducation, { loading, error }] = useMutation<
    DeleteEducationMutation,
    DeleteEducationMutationVariables
  >(DELETE_EDUCATION);

  return [
    async (variables: DeleteEducationMutationVariables) => {
      try {
        const result = await deleteEducation({ variables });
        // Ensure data is undefined if null
        return { ...result, data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete education error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
