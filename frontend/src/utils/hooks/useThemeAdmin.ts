import {
  useQuery,
  useMutation,
  QueryResult,
  MutationTuple,
  ApolloError,
} from "@apollo/client";
import {
  GetThemesListQuery,
  GetThemesListQueryVariables,
  CreateThemeMutation,
  CreateThemeMutationVariables,
  UpdateThemeMutation,
  UpdateThemeMutationVariables,
  DeleteThemeMutation,
  DeleteThemeMutationVariables,
} from "@/types/graphql";
import { GET_THEMES_LIST } from "@/requetes/queries/themes.queries";
import { CREATED_THEME, UPDATE_THEME, DELETE_THEME } from "@/requetes/mutations/themes.mutations";

interface ThemeAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetThemesListQuery }>;
  data: GetThemesListQuery | undefined;
}

interface ThemeMutationResult {
  mutate: (
    variables:
      | CreateThemeMutationVariables
      | UpdateThemeMutationVariables
      | DeleteThemeMutationVariables
  ) => Promise<{ data?: CreateThemeMutation | UpdateThemeMutation | DeleteThemeMutation }>;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useListThemesAdmin = (): ThemeAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetThemesListQuery,
    GetThemesListQueryVariables
  >(GET_THEMES_LIST, {
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

export const useCreateThemeAdmin = (): [
  (variables: CreateThemeMutationVariables) => Promise<{ data?: CreateThemeMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createTheme, { loading, error }] = useMutation<
    CreateThemeMutation,
    CreateThemeMutationVariables
  >(CREATED_THEME);

  return [
    async (variables: CreateThemeMutationVariables) => {
      try {
        const result = await createTheme({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create theme error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateThemeAdmin = (): [
  (variables: UpdateThemeMutationVariables) => Promise<{ data?: UpdateThemeMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateTheme, { loading, error }] = useMutation<
    UpdateThemeMutation,
    UpdateThemeMutationVariables
  >(UPDATE_THEME);

  return [
    async (variables: UpdateThemeMutationVariables) => {
      try {
        const result = await updateTheme({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update theme error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteThemeAdmin = (): [
  (variables: DeleteThemeMutationVariables) => Promise<{ data?: DeleteThemeMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteTheme, { loading, error }] = useMutation<
    DeleteThemeMutation,
    DeleteThemeMutationVariables
  >(DELETE_THEME);

  return [
    async (variables: DeleteThemeMutationVariables) => {
      try {
        const result = await deleteTheme({ variables });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete theme error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
