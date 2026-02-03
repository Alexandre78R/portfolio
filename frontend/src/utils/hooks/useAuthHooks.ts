import {
  useMutation,
  ApolloError,
} from "@apollo/client";
import {
  LoginMutation,
  LoginMutationVariables,
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
  (variables: LoginMutationVariables) => Promise<{ data?: LoginMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [login, { loading, error }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN);

  return [
    async (variables: LoginMutationVariables) => {
      const result = await login({ variables });
      return result;
    },
    { loading, error },
  ];
};

// Logout Hook
export const useLogout = (): [
  () => Promise<{ data?: LogoutMutation }>,
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
  (variables: ChangePasswordMutationVariables) => Promise<{ data?: ChangePasswordMutation }>,
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
  (variables: ForgotPasswordMutationVariables) => Promise<{ data?: ForgotPasswordMutation }>,
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
