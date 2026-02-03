import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListEducationsAdmin, useCreateEducationAdmin, useUpdateEducationAdmin, useDeleteEducationAdmin } from "@/utils/hooks/useEducationAdmin";
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

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

describe("useEducationAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListEducationsAdmin", (): void => {
    it("should return education data when query succeeds", async (): Promise<void> => {
      const mockData: GetEducationsListQuery = {
        listEducations: {
          __typename: "EducationsPayload",
          educations: [
            {
              __typename: "Education",
              id: "1",
              school: "Test School",
              location: "Test Location",
              titleFR: "Titre FR",
              titleEN: "Title EN",
              diplomaLevelFR: "Master",
              diplomaLevelEN: "Master",
              year: 2020,
              month: 1,
              typeFR: "Type FR",
              typeEN: "Type EN",
            },
          ],
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetEducationsListQuery }>, []>(
        async (): Promise<{ data: GetEducationsListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListEducationsAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should handle loading and error states", (): void => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Load error"),
      });

      mockUseQuery.mockReturnValueOnce({
        data: undefined,
        loading: true,
        error: undefined,
        refetch: jest.fn(),
      });

      const { result: resultLoading } = renderHook(() => useListEducationsAdmin());
      expect(resultLoading.current.loading).toBe(true);

      mockUseQuery.mockReturnValueOnce({
        data: undefined,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result: resultError } = renderHook(() => useListEducationsAdmin());
      expect(resultError.current.error).toEqual(mockError);
    });
  });

  describe("useCreateEducationAdmin", (): void => {
    it("should create an education successfully", async (): Promise<void> => {
      const mockData: CreateEducationMutation = {
        createEducation: {
          __typename: "Education",
          id: "1",
          school: "New School",
          location: "Location",
          titleFR: "Titre",
          titleEN: "Title",
          diplomaLevelFR: "Bachelor",
          diplomaLevelEN: "Bachelor",
          year: 2023,
          month: 1,
          typeFR: "Type",
          typeEN: "Type",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateEducationMutation }>, [{ variables: CreateEducationMutationVariables }]>(
        async (): Promise<{ data?: CreateEducationMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateEducationAdmin());
      const [createEducation, { loading, error }] = result.current;

      expect(loading).toBe(false);
      expect(error).toBeUndefined();

      const variables: CreateEducationMutationVariables = {
        data: {
          school: "New School",
          location: "Location",
          titleFR: "Titre",
          titleEN: "Title",
          diplomaLevelFR: "Bachelor",
          diplomaLevelEN: "Bachelor",
          year: 2023,
          month: 1,
          typeFR: "Type",
          typeEN: "Type",
        },
      };

      await act(async () => {
        await createEducation(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });

    it("should handle create error", async (): Promise<void> => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Create failed"),
      });

      const mockMutate = jest.fn<Promise<{ data?: CreateEducationMutation }>, [{ variables: CreateEducationMutationVariables }]>(
        async (): Promise<never> => {
          throw mockError;
        }
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: mockError }]);

      const { result } = renderHook(() => useCreateEducationAdmin());
      const [createEducation] = result.current;

      await act(async () => {
        try {
          await createEducation({ data: { school: "Test", location: "Test", titleFR: "Test", titleEN: "Test", diplomaLevelFR: "Test", diplomaLevelEN: "Test", year: 2023, month: 1, typeFR: "Test", typeEN: "Test" } });
        } catch (err: unknown) {
          if (err instanceof Error) {
            expect(err.message).toBe("Create failed");
          }
        }
      });
    });
  });

  describe("useUpdateEducationAdmin", (): void => {
    it("should update an education successfully", async (): Promise<void> => {
      const mockData: UpdateEducationMutation = {
        updateEducation: {
          __typename: "Education",
          id: "1",
          school: "Updated School",
          location: "Updated Location",
          titleFR: "Titre Maj",
          titleEN: "Title Updated",
          diplomaLevelFR: "Master",
          diplomaLevelEN: "Master",
          year: 2024,
          month: 6,
          typeFR: "Type",
          typeEN: "Type",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateEducationMutation }>, [{ variables: UpdateEducationMutationVariables }]>(
        async (): Promise<{ data?: UpdateEducationMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateEducationAdmin());
      const [updateEducation] = result.current;

      const variables: UpdateEducationMutationVariables = {
        data: {
          id: "1",
          school: "Updated School",
          location: "Updated Location",
          titleFR: "Titre Maj",
          titleEN: "Title Updated",
          diplomaLevelFR: "Master",
          diplomaLevelEN: "Master",
          year: 2024,
          month: 6,
          typeFR: "Type",
          typeEN: "Type",
        },
      };

      await act(async () => {
        await updateEducation(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteEducationAdmin", (): void => {
    it("should delete an education successfully", async (): Promise<void> => {
      const mockData: DeleteEducationMutation = {
        deleteEducation: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteEducationMutation }>, [{ variables: DeleteEducationMutationVariables }]>(
        async (): Promise<{ data?: DeleteEducationMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteEducationAdmin());
      const [deleteEducation] = result.current;

      const variables: DeleteEducationMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteEducation(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
