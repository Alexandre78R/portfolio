import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListProjectsAdmin, useCreateProjectAdmin, useUpdateProjectAdmin, useDeleteProjectAdmin } from "@/utils/hooks/useProjectAdmin";
import {
  GetProjectsListQuery,
  GetProjectsListQueryVariables,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock<
  {
    data: GetProjectsListQuery | undefined;
    loading: boolean;
    error: ApolloError | undefined;
    refetch: jest.Mock<Promise<{ data: GetProjectsListQuery }>, []>;
  },
  [any, any]
>;

const mockUseMutation = useMutation as jest.Mock<
  [jest.Mock<Promise<{ data?: CreateProjectMutation | UpdateProjectMutation | DeleteProjectMutation }>, [any]>, { loading: boolean; error: ApolloError | undefined }],
  [any]
>;

describe("useProjectAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListProjectsAdmin", (): void => {
    it("should return project data when query succeeds", async (): Promise<void> => {
      const mockData: GetProjectsListQuery = {
        listProjects: {
          __typename: "ProjectsPayload",
          projects: [
            {
              __typename: "Project",
              id: "1",
              title: "Test Project",
              descriptionFR: "Description FR",
              descriptionEN: "Description EN",
              typeDisplay: "gallery",
              contentDisplay: "image",
              github: "https://github.com",
              skills: [],
            },
          ],
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetProjectsListQuery }>, []>(
        async (): Promise<{ data: GetProjectsListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListProjectsAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should handle loading state", (): void => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useListProjectsAdmin());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("should handle error state", (): void => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Network error"),
      });

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useListProjectsAdmin());

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useCreateProjectAdmin", (): void => {
    it("should create a project successfully", async (): Promise<void> => {
      const mockData: CreateProjectMutation = {
        createProject: {
          __typename: "Project",
          id: "1",
          title: "New Project",
          descriptionFR: "Desc FR",
          descriptionEN: "Desc EN",
          typeDisplay: "gallery",
          contentDisplay: "image",
          github: null,
          skills: [],
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateProjectMutation }>, [{ variables: CreateProjectMutationVariables }]>(
        async ({ variables }: { variables: CreateProjectMutationVariables }): Promise<{ data?: CreateProjectMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateProjectAdmin());
      const [createProject, { loading, error }] = result.current;

      expect(loading).toBe(false);
      expect(error).toBeUndefined();

      const variables: CreateProjectMutationVariables = {
        data: {
          title: "New Project",
          descriptionFR: "Desc FR",
          descriptionEN: "Desc EN",
          typeDisplay: "gallery",
          contentDisplay: "image",
        },
      };

      await act(async () => {
        await createProject(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });

    it("should handle create error with proper error message", async (): Promise<void> => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Create failed"),
      });

      const mockMutate = jest.fn<Promise<{ data?: CreateProjectMutation }>, [{ variables: CreateProjectMutationVariables }]>(
        async ({ variables }: { variables: CreateProjectMutationVariables }): Promise<{ data?: CreateProjectMutation }> => {
          throw mockError;
        }
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: mockError }]);

      const { result } = renderHook(() => useCreateProjectAdmin());
      const [createProject] = result.current;

      const variables: CreateProjectMutationVariables = {
        data: {
          title: "New Project",
          descriptionFR: "Desc FR",
          descriptionEN: "Desc EN",
          typeDisplay: "gallery",
          contentDisplay: "image",
        },
      };

      await act(async () => {
        try {
          await createProject(variables);
        } catch (err: unknown) {
          if (err instanceof Error) {
            expect(err.message).toBe("Create failed");
          }
        }
      });
    });
  });

  describe("useUpdateProjectAdmin", (): void => {
    it("should update a project successfully", async (): Promise<void> => {
      const mockData: UpdateProjectMutation = {
        updateProject: {
          __typename: "Project",
          id: "1",
          title: "Updated Project",
          descriptionFR: "Updated Desc FR",
          descriptionEN: "Updated Desc EN",
          typeDisplay: "gallery",
          contentDisplay: "image",
          github: "https://github.com/updated",
          skills: [],
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateProjectMutation }>, [{ variables: UpdateProjectMutationVariables }]>(
        async ({ variables }: { variables: UpdateProjectMutationVariables }): Promise<{ data?: UpdateProjectMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateProjectAdmin());
      const [updateProject, { loading, error }] = result.current;

      expect(loading).toBe(false);
      expect(error).toBeUndefined();

      const variables: UpdateProjectMutationVariables = {
        data: {
          id: "1",
          title: "Updated Project",
          descriptionFR: "Updated Desc FR",
          descriptionEN: "Updated Desc EN",
          typeDisplay: "gallery",
          contentDisplay: "image",
        },
      };

      await act(async () => {
        await updateProject(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteProjectAdmin", (): void => {
    it("should delete a project successfully", async (): Promise<void> => {
      const mockData: DeleteProjectMutation = {
        deleteProject: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteProjectMutation }>, [{ variables: DeleteProjectMutationVariables }]>(
        async ({ variables }: { variables: DeleteProjectMutationVariables }): Promise<{ data?: DeleteProjectMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteProjectAdmin());
      const [deleteProject, { loading, error }] = result.current;

      expect(loading).toBe(false);
      expect(error).toBeUndefined();

      const variables: DeleteProjectMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteProject(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
