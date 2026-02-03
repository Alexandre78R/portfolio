import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListUsersAdmin, useCreateUserAdmin, useUpdateUserAdmin, useDeleteUserAdmin } from "@/utils/hooks/useUserAdmin";
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

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

describe("useUserAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListUsersAdmin", (): void => {
    it("should return users data", async (): Promise<void> => {
      const mockData: GetUsersListQuery = {
        listUsers: {
          __typename: "UsersPayload",
          users: [
            {
              __typename: "User",
              id: "1",
              firstname: "John",
              lastname: "Doe",
              email: "john@example.com",
              role: "ADMIN",
            },
          ],
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetUsersListQuery }>, []>(
        async (): Promise<{ data: GetUsersListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListUsersAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe("useCreateUserAdmin", (): void => {
    it("should create a user successfully", async (): Promise<void> => {
      const mockData: CreateUserMutation = {
        createUser: {
          __typename: "User",
          id: "1",
          firstname: "Jane",
          lastname: "Smith",
          email: "jane@example.com",
          role: "USER",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateUserMutation }>, [{ variables: CreateUserMutationVariables }]>(
        async (): Promise<{ data?: CreateUserMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateUserAdmin());
      const [createUser] = result.current;

      const variables: CreateUserMutationVariables = {
        data: {
          firstname: "Jane",
          lastname: "Smith",
          email: "jane@example.com",
          password: "password123",
          role: "USER",
        },
      };

      await act(async () => {
        await createUser(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useUpdateUserAdmin", (): void => {
    it("should update a user successfully", async (): Promise<void> => {
      const mockData: UpdateUserMutation = {
        updateUser: {
          __typename: "User",
          id: "1",
          firstname: "Jane",
          lastname: "Smith Updated",
          email: "jane.updated@example.com",
          role: "ADMIN",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateUserMutation }>, [{ variables: UpdateUserMutationVariables }]>(
        async (): Promise<{ data?: UpdateUserMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateUserAdmin());
      const [updateUser] = result.current;

      const variables: UpdateUserMutationVariables = {
        data: {
          id: "1",
          firstname: "Jane",
          lastname: "Smith Updated",
          email: "jane.updated@example.com",
          role: "ADMIN",
        },
      };

      await act(async () => {
        await updateUser(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteUserAdmin", (): void => {
    it("should delete a user successfully", async (): Promise<void> => {
      const mockData: DeleteUserMutation = {
        deleteUser: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteUserMutation }>, [{ variables: DeleteUserMutationVariables }]>(
        async (): Promise<{ data?: DeleteUserMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteUserAdmin());
      const [deleteUser] = result.current;

      const variables: DeleteUserMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteUser(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
