import {
  useQuery,
  useMutation,
  ApolloError,
} from "@apollo/client";
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
import { GET_SOCIALS_LIST } from "@/requetes/queries/socials.queries";
import { CREATE_SOCIAL, UPDATE_SOCIAL, DELETE_SOCIAL } from "@/requetes/mutations/socials.mutations";

interface SocialAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetSocialsListQuery }>;
  data: GetSocialsListQuery | undefined;
}

export const useListSocialsAdmin = (): SocialAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetSocialsListQuery,
    GetSocialsListQueryVariables
  >(GET_SOCIALS_LIST, {
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

export const useCreateSocialAdmin = (): [
  (variables: CreateSocialMutationVariables) => Promise<{ data?: CreateSocialMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createSocial, { loading, error }] = useMutation<
    CreateSocialMutation,
    CreateSocialMutationVariables
  >(CREATE_SOCIAL);

  return [
    async (variables: CreateSocialMutationVariables) => {
      try {
        const result = await createSocial({ variables });
        // Ensure data is never null, only undefined or CreateSocialMutation
        const { data, ...rest } = result;
        return { data: data === null ? undefined : data, ...rest };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create social error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateSocialAdmin = (): [
  (variables: UpdateSocialMutationVariables) => Promise<{ data?: UpdateSocialMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateSocial, { loading, error }] = useMutation<
    UpdateSocialMutation,
    UpdateSocialMutationVariables
  >(UPDATE_SOCIAL);

  return [
    async (variables: UpdateSocialMutationVariables) => {
      try {
        const result = await updateSocial({ variables });
        // Ensure data is never null, only undefined or UpdateSocialMutation
        const { data, ...rest } = result;
        return { data: data === null ? undefined : data, ...rest };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update social error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteSocialAdmin = (): [
  (variables: DeleteSocialMutationVariables) => Promise<{ data?: DeleteSocialMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteSocial, { loading, error }] = useMutation<
    DeleteSocialMutation,
    DeleteSocialMutationVariables
  >(DELETE_SOCIAL);

  return [
    async (variables: DeleteSocialMutationVariables) => {
      try {
        const result = await deleteSocial({ variables });
        // Ensure data is never null, only undefined or DeleteSocialMutation
        const { data, ...rest } = result;
        return { data: data === null ? undefined : data, ...rest };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete social error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
