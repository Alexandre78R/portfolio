import {
  useQuery,
  useMutation,
  QueryResult,
  MutationTuple,
  ApolloError,
} from "@apollo/client";
import {
  GetProjectsListQuery,
  GetProjectsListQueryVariables,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  UploadProjectMediaMutation,
  UploadProjectMediaMutationVariables,
} from "@/types/graphql";
import { GET_PROJECTS_LIST } from "@/requetes/queries/projects.queries";
import { CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, UPLOAD_PROJECT_MEDIA } from "@/requetes/mutations/projects.mutations";

interface ProjectAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetProjectsListQuery }>;
  data: GetProjectsListQuery | undefined;
}

interface ProjectMutationResult {
  mutate: (
    variables: CreateProjectMutationVariables | UpdateProjectMutationVariables | DeleteProjectMutationVariables
  ) => Promise<{ data?: CreateProjectMutation | UpdateProjectMutation | DeleteProjectMutation }>;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useListProjectsAdmin = (): ProjectAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetProjectsListQuery,
    GetProjectsListQueryVariables
  >(GET_PROJECTS_LIST, {
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

export const useCreateProjectAdmin = (): [
  (variables: CreateProjectMutationVariables) => Promise<{ data?: CreateProjectMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createProject, { loading, error }] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT);

  return [
    async (variables: CreateProjectMutationVariables) => {
      try {
        const result = await createProject({ variables });
        // Ensure data is undefined if null, to match the expected type
        return { ...result, data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create project error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateProjectAdmin = (): [
  (variables: UpdateProjectMutationVariables) => Promise<{ data?: UpdateProjectMutation }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateProject, { loading, error }] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(UPDATE_PROJECT);

  return [
    async (variables: UpdateProjectMutationVariables) => {
      try {
        const result = await updateProject({ variables });
        // Ensure data is undefined if null, to match the expected type
        return { ...result, data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update project error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteProjectAdmin = (): [
  (variables: DeleteProjectMutationVariables) => Promise<{ data?: DeleteProjectMutation }> ,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteProject, { loading, error }] = useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(DELETE_PROJECT);

  return [
    async (variables: DeleteProjectMutationVariables) => {
      try {
        const result = await deleteProject({ variables });
        // Ensure data is undefined if null, to match the expected type
        return { ...result, data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete project error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUploadProjectMediaAdmin = (): [
  (variables: UploadProjectMediaMutationVariables) => Promise<{ data?: UploadProjectMediaMutation }> ,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [uploadProjectMedia, { loading, error }] = useMutation<
    UploadProjectMediaMutation,
    UploadProjectMediaMutationVariables
  >(UPLOAD_PROJECT_MEDIA);

  return [
    async (variables: UploadProjectMediaMutationVariables) => {
      try {
        const result = await uploadProjectMedia({ variables });
        // Ensure data is undefined if null, to match the expected type
        return { ...result, data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Upload project media error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
