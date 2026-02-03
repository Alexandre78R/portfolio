import {
  useQuery,
  useMutation,
  ApolloError,
} from "@apollo/client";
import {
  ListAboutMeQuery,
  ListAboutMeQueryVariables,
  CreateAboutMeMutation,
  CreateAboutMeMutationVariables,
  UpdateAboutMeMutation,
  UpdateAboutMeMutationVariables,
  DeleteAboutMeMutation,
  DeleteAboutMeMutationVariables,
} from "@/types/graphql";
import { LIST_ABOUT_ME } from "@/requetes/queries/aboutme.queries";
import { CREATE_ABOUT_ME, UPDATE_ABOUT_ME, DELETE_ABOUT_ME } from "@/requetes/mutations/aboutme.mutations";

interface AboutMeAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: ListAboutMeQuery }>;
  data: ListAboutMeQuery | undefined;
}

export const useListAboutMeAdmin = (): AboutMeAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    ListAboutMeQuery,
    ListAboutMeQueryVariables
  >(LIST_ABOUT_ME, {
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

export const useCreateAboutMeAdmin = (): [
  (variables: CreateAboutMeMutationVariables) => Promise<{ data?: CreateAboutMeMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createAboutMe, { loading, error }] = useMutation<
    CreateAboutMeMutation,
    CreateAboutMeMutationVariables
  >(CREATE_ABOUT_ME);

  return [
    async (variables: CreateAboutMeMutationVariables) => {
      try {
        const result = await createAboutMe({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create about me error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateAboutMeAdmin = (): [
  (variables: UpdateAboutMeMutationVariables) => Promise<{ data?: UpdateAboutMeMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateAboutMe, { loading, error }] = useMutation<
    UpdateAboutMeMutation,
    UpdateAboutMeMutationVariables
  >(UPDATE_ABOUT_ME);

  return [
    async (variables: UpdateAboutMeMutationVariables) => {
      try {
        const result = await updateAboutMe({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update about me error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteAboutMeAdmin = (): [
  (variables: DeleteAboutMeMutationVariables) => Promise<{ data?: DeleteAboutMeMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteAboutMe, { loading, error }] = useMutation<
    DeleteAboutMeMutation,
    DeleteAboutMeMutationVariables
  >(DELETE_ABOUT_ME);

  return [
    async (variables: DeleteAboutMeMutationVariables) => {
      try {
        const result = await deleteAboutMe({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete about me error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
