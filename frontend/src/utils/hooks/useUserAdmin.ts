import {
  useQuery,
  useMutation,
  ApolloError,
} from "@apollo/client";
import {
  GetUsersListQuery,
  GetUsersListQueryVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  DeleteUserMutation,
  DeleteUserMutationVariables,
} from "@/types/graphql";
import { GET_USERS_LIST } from "@/requetes/queries/users.queries";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "@/requetes/mutations/user.mutations";

interface UserAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetUsersListQuery }>;
  data: GetUsersListQuery | undefined;
}

export const useListUsersAdmin = (): UserAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetUsersListQuery,
    GetUsersListQueryVariables
  >(GET_USERS_LIST, {
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

export const useCreateUserAdmin = (): [
  (variables: CreateUserMutationVariables) => Promise<{ data?: CreateUserMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createUser, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER);

  return [
    async (variables: CreateUserMutationVariables) => {
      try {
        const result = await createUser({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create user error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateUserAdmin = (): [
  (variables: UpdateUserMutationVariables) => Promise<{ data?: UpdateUserMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateUser, { loading, error }] = useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UPDATE_USER);

  return [
    async (variables: UpdateUserMutationVariables) => {
      try {
        const result = await updateUser({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update user error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteUserAdmin = (): [
  (variables: DeleteUserMutationVariables) => Promise<{ data?: DeleteUserMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteUser, { loading, error }] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >(DELETE_USER);

  return [
    async (variables: DeleteUserMutationVariables) => {
      try {
        const result = await deleteUser({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete user error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
