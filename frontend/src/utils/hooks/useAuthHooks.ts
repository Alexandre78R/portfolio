import {
  useMutation,
  ApolloError,
} from "@apollo/client";
import {
  MutationMutation,
  MutationMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  LogoutMutation,
} from "@/types/graphql";
import { LOGIN, LOGOUT } from "@/requetes/mutations/login.mutations";
import { CHANGE_PASSWORD, FORGOT_PASSWORD } from "@/requetes/mutations/user.mutations";

// Login Hook
export const useLogin = (): [
  (variables: MutationMutationVariables) => Promise<{ data?: MutationMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [login, { loading, error }] = useMutation<
    MutationMutation,
    MutationMutationVariables
  >(LOGIN);

  return [
    async (variables: MutationMutationVariables) => {
      const result = await login({ variables });
      return { data: result.data ?? undefined };
    },
    { loading, error },
  ];
};

// Logout Hook
export const useLogout = (): [
  () => Promise<{ data?: LogoutMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [logout, { loading, error }] = useMutation<LogoutMutation>(LOGOUT);

  return [
    async () => {
      const result = await logout();
      return result;
    },
    { loading, error },
  ];
};

// Change Password Hook
export const useChangePassword = (): [
  (variables: ChangePasswordMutationVariables) => Promise<{ data?: ChangePasswordMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [changePassword, { loading, error }] = useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(CHANGE_PASSWORD);

  return [
    async (variables: ChangePasswordMutationVariables) => {
      const result = await changePassword({ variables });
      return result;
    },
    { loading, error },
  ];
};

// Forgot Password Hook
export const useForgotPassword = (): [
  (variables: ForgotPasswordMutationVariables) => Promise<{ data?: ForgotPasswordMutation | null }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [forgotPassword, { loading, error }] = useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(FORGOT_PASSWORD);

  return [
    async (variables: ForgotPasswordMutationVariables) => {
      const result = await forgotPassword({ variables });
      return result;
    },
    { loading, error },
  ];
};
