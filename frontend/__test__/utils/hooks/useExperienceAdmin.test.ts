import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import { useListExperiencesAdmin, useCreateExperienceAdmin, useUpdateExperienceAdmin, useDeleteExperienceAdmin } from "@/utils/hooks/useExperienceAdmin";
import {
  GetExperiencesListQuery,
  GetExperiencesListQueryVariables,
  CreateExperienceMutation,
  CreateExperienceMutationVariables,
  UpdateExperienceMutation,
  UpdateExperienceMutationVariables,
  DeleteExperienceMutation,
  DeleteExperienceMutationVariables,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

describe("useExperienceAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListExperiencesAdmin", (): void => {
    it("should return experiences data", async (): Promise<void> => {
      const mockData: GetExperiencesListQuery = {
        listExperiences: {
          __typename: "ExperiencesPayload",
          experiences: [
            {
              __typename: "Experience",
              id: "1",
              jobFR: "Développeur",
              jobEN: "Developer",
              business: "Tech Corp",
              employmentContractFR: "CDI",
              employmentContractEN: "Permanent",
              startDateFR: "2020-01-01",
              startDateEN: "2020-01-01",
              endDateFR: "2022-12-31",
              endDateEN: "2022-12-31",
              month: 24,
              typeFR: "Frontend",
              typeEN: "Frontend",
            },
          ],
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetExperiencesListQuery }>, []>(
        async (): Promise<{ data: GetExperiencesListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListExperiencesAdmin());

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe("useCreateExperienceAdmin", (): void => {
    it("should create an experience successfully", async (): Promise<void> => {
      const mockData: CreateExperienceMutation = {
        createExperience: {
          __typename: "Experience",
          id: "1",
          jobFR: "Ingénieur",
          jobEN: "Engineer",
          business: "Tech Company",
          employmentContractFR: "CDI",
          employmentContractEN: "Permanent",
          startDateFR: "2023-01-01",
          startDateEN: "2023-01-01",
          endDateFR: null,
          endDateEN: null,
          month: 12,
          typeFR: "Backend",
          typeEN: "Backend",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateExperienceMutation }>, [{ variables: CreateExperienceMutationVariables }]>(
        async (): Promise<{ data?: CreateExperienceMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateExperienceAdmin());
      const [createExperience] = result.current;

      const variables: CreateExperienceMutationVariables = {
        data: {
          jobFR: "Ingénieur",
          jobEN: "Engineer",
          business: "Tech Company",
          employmentContractFR: "CDI",
          employmentContractEN: "Permanent",
          startDateFR: "2023-01-01",
          startDateEN: "2023-01-01",
          month: 12,
          typeFR: "Backend",
          typeEN: "Backend",
        },
      };

      await act(async () => {
        await createExperience(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useUpdateExperienceAdmin", (): void => {
    it("should update an experience successfully", async (): Promise<void> => {
      const mockData: UpdateExperienceMutation = {
        updateExperience: {
          __typename: "Experience",
          id: "1",
          jobFR: "Senior Ingénieur",
          jobEN: "Senior Engineer",
          business: "Tech Company Updated",
          employmentContractFR: "CDI",
          employmentContractEN: "Permanent",
          startDateFR: "2023-01-01",
          startDateEN: "2023-01-01",
          endDateFR: null,
          endDateEN: null,
          month: 12,
          typeFR: "Backend",
          typeEN: "Backend",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateExperienceMutation }>, [{ variables: UpdateExperienceMutationVariables }]>(
        async (): Promise<{ data?: UpdateExperienceMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateExperienceAdmin());
      const [updateExperience] = result.current;

      const variables: UpdateExperienceMutationVariables = {
        data: {
          id: "1",
          jobFR: "Senior Ingénieur",
          jobEN: "Senior Engineer",
          business: "Tech Company Updated",
          employmentContractFR: "CDI",
          employmentContractEN: "Permanent",
          startDateFR: "2023-01-01",
          startDateEN: "2023-01-01",
          month: 12,
          typeFR: "Backend",
          typeEN: "Backend",
        },
      };

      await act(async () => {
        await updateExperience(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });

  describe("useDeleteExperienceAdmin", (): void => {
    it("should delete an experience successfully", async (): Promise<void> => {
      const mockData: DeleteExperienceMutation = {
        deleteExperience: true,
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteExperienceMutation }>, [{ variables: DeleteExperienceMutationVariables }]>(
        async (): Promise<{ data?: DeleteExperienceMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteExperienceAdmin());
      const [deleteExperience] = result.current;

      const variables: DeleteExperienceMutationVariables = {
        id: "1",
      };

      await act(async () => {
        await deleteExperience(variables);
      });

      expect(mockMutate).toHaveBeenCalledWith({ variables });
    });
  });
});
