import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListAboutMeAdmin, useCreateAboutMeAdmin, useUpdateAboutMeAdmin, useDeleteAboutMeAdmin } from "@/utils/hooks/useAboutMeAdmin";
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

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

describe("useAboutMeAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListAboutMeAdmin", (): void => {
    it("should return about me data", async (): Promise<void> => {
      const mockData: ListAboutMeQuery = {
        listAboutMe: {
          __typename: "AboutMesPayload",
          aboutMes: [
            {
              __typename: "AboutMe",
              id: "1",
              titleFR: "À Propos",
              titleEN: "About",
              descriptionFR: "Description FR",
              descriptionEN: "Description EN",
              isVisible: true,
            },
          ],
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: ListAboutMeQuery }>, []>(
        async (): Promise<{ data: ListAboutMeQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListAboutMeAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe("useCreateAboutMeAdmin", (): void => {
    it("should create about me successfully", async (): Promise<void> => {
      const mockData: CreateAboutMeMutation = {
        createAboutMe: {
          __typename: "AboutMe",
          id: "1",
          titleFR: "Nouvelle Section",
          titleEN: "New Section",
          descriptionFR: "Desc FR",
          descriptionEN: "Desc EN",
          isVisible: true,
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateAboutMeMutation }>, [{ variables: CreateAboutMeMutationVariables }]>(
        async (): Promise<{ data?: CreateAboutMeMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateAboutMeAdmin());
      const [createAboutMe] = result.current;

      const variables: CreateAboutMeMutationVariables = {
        data: {
          titleFR: "Nouvelle Section",
          titleEN: "New Section",
          descriptionFR: "Desc FR",
          descriptionEN: "Desc EN",
          isVisible: true,
        },
      };

      await act(async () => {
        await createAboutMe(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useUpdateAboutMeAdmin", (): void => {
    it("should update about me successfully", async (): Promise<void> => {
      const mockData: UpdateAboutMeMutation = {
        updateAboutMe: {
          __typename: "AboutMe",
          id: "1",
          titleFR: "Section Mise à Jour",
          titleEN: "Updated Section",
          descriptionFR: "Desc FR Updated",
          descriptionEN: "Desc EN Updated",
          isVisible: false,
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateAboutMeMutation }>, [{ variables: UpdateAboutMeMutationVariables }]>(
        async (): Promise<{ data?: UpdateAboutMeMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateAboutMeAdmin());
      const [updateAboutMe] = result.current;

      const variables: UpdateAboutMeMutationVariables = {
        data: {
          id: "1",
          titleFR: "Section Mise à Jour",
          titleEN: "Updated Section",
          descriptionFR: "Desc FR Updated",
          descriptionEN: "Desc EN Updated",
          isVisible: false,
        },
      };

      await act(async () => {
        await updateAboutMe(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteAboutMeAdmin", (): void => {
    it("should delete about me successfully", async (): Promise<void> => {
      const mockData: DeleteAboutMeMutation = {
        deleteAboutMe: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteAboutMeMutation }>, [{ variables: DeleteAboutMeMutationVariables }]>(
        async (): Promise<{ data?: DeleteAboutMeMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteAboutMeAdmin());
      const [deleteAboutMe] = result.current;

      const variables: DeleteAboutMeMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteAboutMe(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
