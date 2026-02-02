import { renderHook, act } from "@testing-library/react";
import { useMutation, useQuery, ApolloError } from "@apollo/client";
import {
  useListThemesAdmin,
  useCreateThemeAdmin,
  useUpdateThemeAdmin,
  useDeleteThemeAdmin,
} from "@/utils/hooks/useThemeAdmin";
import {
  GetThemesListQuery,
  CreateThemeMutation,
  UpdateThemeMutation,
  DeleteThemeMutation,
} from "@/types/graphql";

jest.mock("@apollo/client");

const mockUseQuery = useQuery as jest.Mock<any, [any, any]>;
const mockUseMutation = useMutation as jest.Mock<any, [any]>;

describe("useThemeAdmin hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("useListThemesAdmin", (): void => {
    it("should return themes data when query succeeds", async (): Promise<void> => {
      const mockData: GetThemesListQuery = {
        listThemes: {
          themes: [
            {
              id: "1",
              name: "Dark Theme",
              nameEN: "Dark Theme",
              nameFR: "Thème Sombre",
              body: "#000000",
              admin: "#1a1a1a",
              primary: "#ffffff",
              secondary: "#cccccc",
              success: "#4caf50",
              error: "#f44336",
              warn: "#ff9800",
              info: "#2196f3",
              grey: "#757575",
              placeholder: "#bdbdbd",
              scrollHandle: "#424242",
              scrollHandleHover: "#616161",
              text100: "#ffffff",
              text200: "#e0e0e0",
              text300: "#bdbdbd",
              textButton: "#ffffff",
              textDefault: "#000000",
              visible: true,
            },
          ],
          code: 200,
          message: "Success",
        },
      };

      const mockRefetch = jest.fn<Promise<{ data: GetThemesListQuery }>, []>(
        async (): Promise<{ data: GetThemesListQuery }> => ({ data: mockData })
      );

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useListThemesAdmin());

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

      const { result } = renderHook(() => useListThemesAdmin());

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

      const { result } = renderHook(() => useListThemesAdmin());

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useCreateThemeAdmin", (): void => {
    it("should create a theme successfully", async (): Promise<void> => {
      const mockData: CreateThemeMutation = {
        createTheme: {
          theme: {
            id: "1",
            name: "New Theme",
            nameEN: "New Theme",
            nameFR: "Nouveau Thème",
            body: "#ffffff",
            admin: "#f5f5f5",
            primary: "#1976d2",
            secondary: "#dc004e",
            success: "#4caf50",
            error: "#f44336",
            warn: "#ff9800",
            info: "#2196f3",
            grey: "#757575",
            placeholder: "#bdbdbd",
            scrollHandle: "#e0e0e0",
            scrollHandleHover: "#d0d0d0",
            text100: "#ffffff",
            text200: "#f5f5f5",
            text300: "#eeeeee",
            textButton: "#ffffff",
            textDefault: "#000000",
            visible: true,
          },
          code: 201,
          message: "Created",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: CreateThemeMutation }>, any>(
        async (): Promise<{ data?: CreateThemeMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useCreateThemeAdmin());
      const [createTheme] = result.current;

      await act(async () => {
        const response = await createTheme({
          data: {
            name: "New Theme",
            nameEN: "New Theme",
            nameFR: "Nouveau Thème",
            body: "#ffffff",
            admin: "#f5f5f5",
            primary: "#1976d2",
            secondary: "#dc004e",
            success: "#4caf50",
            error: "#f44336",
            warn: "#ff9800",
            info: "#2196f3",
            grey: "#757575",
            placeholder: "#bdbdbd",
            scrollHandle: "#e0e0e0",
            scrollHandleHover: "#d0d0d0",
            text100: "#ffffff",
            text200: "#f5f5f5",
            text300: "#eeeeee",
            textButton: "#ffffff",
            textDefault: "#000000",
            visible: true,
          },
        });
        expect(response.data).toEqual(mockData);
      });
    });

    it("should handle create error", async (): Promise<void> => {
      const mockError: ApolloError = new ApolloError({
        graphQLErrors: [],
        networkError: new Error("Network error"),
      });

      const mockMutate = jest.fn<Promise<{ data?: CreateThemeMutation }>, any>(
        async (): Promise<{ data?: CreateThemeMutation }> => {
          throw mockError;
        }
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: mockError }]);

      const { result } = renderHook(() => useCreateThemeAdmin());
      const [createTheme] = result.current;

      await act(async () => {
        try {
          await createTheme({
            data: {
              name: "Test",
              nameEN: "Test",
              nameFR: "Test",
              body: "#fff",
              admin: "#000",
              primary: "#000",
              secondary: "#000",
              success: "#000",
              error: "#000",
              warn: "#000",
              info: "#000",
              grey: "#000",
              placeholder: "#000",
              scrollHandle: "#000",
              scrollHandleHover: "#000",
              text100: "#000",
              text200: "#000",
              text300: "#000",
              textButton: "#000",
              textDefault: "#000",
              visible: true,
            },
          });
        } catch (err) {
          expect(err).toEqual(mockError);
        }
      });
    });
  });

  describe("useUpdateThemeAdmin", (): void => {
    it("should update a theme successfully", async (): Promise<void> => {
      const mockData: UpdateThemeMutation = {
        updateTheme: {
          theme: {
            id: "1",
            name: "Updated Theme",
            nameEN: "Updated Theme",
            nameFR: "Thème Mis à Jour",
            body: "#ffffff",
            admin: "#f5f5f5",
            primary: "#1976d2",
            secondary: "#dc004e",
            success: "#4caf50",
            error: "#f44336",
            warn: "#ff9800",
            info: "#2196f3",
            grey: "#757575",
            placeholder: "#bdbdbd",
            scrollHandle: "#e0e0e0",
            scrollHandleHover: "#d0d0d0",
            text100: "#ffffff",
            text200: "#f5f5f5",
            text300: "#eeeeee",
            textButton: "#ffffff",
            textDefault: "#000000",
            visible: true,
          },
          code: 200,
          message: "Updated",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: UpdateThemeMutation }>, any>(
        async (): Promise<{ data?: UpdateThemeMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useUpdateThemeAdmin());
      const [updateTheme] = result.current;

      await act(async () => {
        const response = await updateTheme({
          data: {
            id: "1",
            name: "Updated Theme",
            nameEN: "Updated Theme",
            nameFR: "Thème Mis à Jour",
            body: "#ffffff",
            admin: "#f5f5f5",
            primary: "#1976d2",
            secondary: "#dc004e",
            success: "#4caf50",
            error: "#f44336",
            warn: "#ff9800",
            info: "#2196f3",
            grey: "#757575",
            placeholder: "#bdbdbd",
            scrollHandle: "#e0e0e0",
            scrollHandleHover: "#d0d0d0",
            text100: "#ffffff",
            text200: "#f5f5f5",
            text300: "#eeeeee",
            textButton: "#ffffff",
            textDefault: "#000000",
            visible: true,
          },
        });
        expect(response.data).toEqual(mockData);
      });
    });
  });

  describe("useDeleteThemeAdmin", (): void => {
    it("should delete a theme successfully", async (): Promise<void> => {
      const mockData: DeleteThemeMutation = {
        deleteTheme: {
          code: 200,
          message: "Deleted",
        },
      };

      const mockMutate = jest.fn<Promise<{ data?: DeleteThemeMutation }>, any>(
        async (): Promise<{ data?: DeleteThemeMutation }> => ({ data: mockData })
      );

      mockUseMutation.mockReturnValue([mockMutate, { loading: false, error: undefined }]);

      const { result } = renderHook(() => useDeleteThemeAdmin());
      const [deleteTheme] = result.current;

      await act(async () => {
        const response = await deleteTheme({ id: 1 });
        expect(response.data).toEqual(mockData);
      });
    });
  });
});
