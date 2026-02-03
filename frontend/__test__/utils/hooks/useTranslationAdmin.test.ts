import { renderHook, act } from "@testing-library/react";
import {
  useGetCurrentTranslations,
  useListCurrentTranslationsPaginated,
  useListAllTranslationsPaginated,
  useLazyListTranslationsPaginated,
  useUpsertCurrentTranslation,
  useUpsertTranslationForLang,
  useUpsertMultipleTranslations,
} from "@/utils/hooks/useTranslationAdmin";
import {
  GET_TRANSLATIONS,
  LIST_TRANSLATIONS_PAGINATED,
} from "@/requetes/queries/translation.queries";
import type {
  GetTranslationsQuery,
  GetTranslationsQueryVariables,
  ListTranslationsPaginatedQuery,
  ListTranslationsPaginatedQueryVariables,
  UpsertTranslationMutation,
  UpsertTranslationMutationVariables,
} from "@/types/graphql";
import type { ApolloError } from "@apollo/client";
import type Lang from "@/lang/typeLang";
import type { LangContextType, LangKey } from "@/context/Lang/LangContext";

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useQuery: jest.fn(),
    useLazyQuery: jest.fn(),
    useMutation: jest.fn(),
  };
});

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

const apolloMocks: { useQuery: jest.Mock; useLazyQuery: jest.Mock; useMutation: jest.Mock } = jest.requireMock("@apollo/client");
const useQueryMock: jest.Mock = apolloMocks.useQuery;
const useLazyQueryMock: jest.Mock = apolloMocks.useLazyQuery;
const useMutationMock: jest.Mock = apolloMocks.useMutation;
const langMocks: { useLang: jest.Mock } = jest.requireMock("@/context/Lang/LangContext");
const useLangMock: jest.Mock = langMocks.useLang;

describe("useTranslationAdmin hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const translationsMock = {
      messageAdminEducationCreateTitle: "Create Education",
      messageAdminEducationCreateSuccess: "Education created successfully",
      messageAdminEducationCreateError: "Failed to create education",
      messageErrorServerOff: "Server is off",
      messageAdminEducationCreateLoading: "Creating...",
      messageAdminEducationCreateConfirm: "Confirm",
    } as Lang;

    const langContextMock: LangContextType = {
      lang: "fr" as LangKey,
      setLang: (): void => undefined,
      translations: translationsMock,
      listLang: ["fr", "en"],
      isLoadingTranslations: false,
    };

    useLangMock.mockReturnValue(langContextMock);
  });

  it("useGetCurrentTranslations queries current language and returns translations", (): void => {
    const refetch: jest.Mock<Promise<unknown>, []> = jest.fn().mockResolvedValue({});
    const data: GetTranslationsQuery = { getTranslations: [{ key: "k", value: "v" }] } as GetTranslationsQuery;
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    const { result } = renderHook(() => useGetCurrentTranslations());

    const expectedVariables: GetTranslationsQueryVariables = { lang: "fr" } as GetTranslationsQueryVariables;
    expect(useQueryMock).toHaveBeenCalledWith(GET_TRANSLATIONS, {
      variables: expectedVariables,
    });
    expect(result.current.translations).toEqual([{ key: "k", value: "v" }]);
  });

  it("useGetCurrentTranslations exposes refetch", async (): Promise<void> => {
    const refetch: jest.Mock<Promise<{ ok: true }>, []> = jest.fn().mockResolvedValue({ ok: true });
    const data: GetTranslationsQuery | undefined = undefined;
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    const { result } = renderHook(() => useGetCurrentTranslations());

    await act(async () => {
      await result.current.refetch();
    });

    expect(refetch).toHaveBeenCalled();
  });

  it("useListCurrentTranslationsPaginated uses lang and variables", (): void => {
    const refetch: jest.Mock<Promise<unknown>, []> = jest.fn().mockResolvedValue({});
    const data: ListTranslationsPaginatedQuery = {
      listTranslationsPaginated: { translations: [] },
    } as ListTranslationsPaginatedQuery;
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    renderHook(() => useListCurrentTranslationsPaginated(2, 15, "hello"));

    const expectedVariables: ListTranslationsPaginatedQueryVariables = {
      page: 2,
      limit: 15,
      lang: "fr",
      searchTerm: "hello",
    } as ListTranslationsPaginatedQueryVariables;

    expect(useQueryMock).toHaveBeenCalledWith(LIST_TRANSLATIONS_PAGINATED, {
      variables: expectedVariables,
    });
  });

  it("useListAllTranslationsPaginated uses lang null", (): void => {
    const refetch: jest.Mock<Promise<unknown>, []> = jest.fn().mockResolvedValue({});
    const data: ListTranslationsPaginatedQuery = {
      listTranslationsPaginated: { translations: [] },
    } as ListTranslationsPaginatedQuery;
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    renderHook(() => useListAllTranslationsPaginated(3, 25, "test"));

    const expectedVariables: ListTranslationsPaginatedQueryVariables = {
      page: 3,
      limit: 25,
      lang: null,
      searchTerm: "test",
    } as ListTranslationsPaginatedQueryVariables;

    expect(useQueryMock).toHaveBeenCalledWith(LIST_TRANSLATIONS_PAGINATED, {
      variables: expectedVariables,
    });
  });

  it("useLazyListTranslationsPaginated exposes fetchTranslations", async (): Promise<void> => {
    const lazyFn: jest.Mock<
      Promise<{ data: ListTranslationsPaginatedQuery | undefined }>,
      [{ variables: ListTranslationsPaginatedQueryVariables }]
    > = jest.fn().mockResolvedValue({
      data: { listTranslationsPaginated: { translations: [] } } as ListTranslationsPaginatedQuery,
    });
    const data: ListTranslationsPaginatedQuery | undefined = undefined;
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useLazyQueryMock.mockReturnValue([lazyFn, { data, loading, error }]);

    const { result } = renderHook(() => useLazyListTranslationsPaginated());

    const variables: ListTranslationsPaginatedQueryVariables = {
      page: 1,
      limit: 10,
      lang: "fr",
      searchTerm: null,
    } as ListTranslationsPaginatedQueryVariables;

    await act(async () => {
      await result.current.fetchTranslations(variables);
    });

    expect(lazyFn).toHaveBeenCalledWith({
      variables,
    });
  });

  it("useUpsertCurrentTranslation uses lang in mutation variables", async (): Promise<void> => {
    const mutate: jest.Mock<
      Promise<{ data?: UpsertTranslationMutation }>,
      [{ variables: UpsertTranslationMutationVariables }]
    > = jest.fn().mockResolvedValue({ data: { upsertTranslation: { ok: true } } as UpsertTranslationMutation });
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useMutationMock.mockReturnValue([mutate, { loading, error }]);

    const { result } = renderHook(() => useUpsertCurrentTranslation());

    await act(async () => {
      const response: UpsertTranslationMutation | undefined = await result.current.upsertTranslation("k", "v");
      expect(response).toEqual({ upsertTranslation: { ok: true } });
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: { key: "k", value: "v", lang: "fr" } as UpsertTranslationMutationVariables,
    });
  });

  it("useUpsertTranslationForLang uses target language", async (): Promise<void> => {
    const mutate: jest.Mock<
      Promise<{ data?: UpsertTranslationMutation }>,
      [{ variables: UpsertTranslationMutationVariables }]
    > = jest.fn().mockResolvedValue({ data: { upsertTranslation: { ok: true } } as UpsertTranslationMutation });
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useMutationMock.mockReturnValue([mutate, { loading, error }]);

    const { result } = renderHook(() => useUpsertTranslationForLang());

    await act(async () => {
      await result.current.upsertTranslation("k", "v", "en");
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: { key: "k", value: "v", lang: "en" } as UpsertTranslationMutationVariables,
    });
  });

  it("useUpsertMultipleTranslations calls mutation for each entry", async (): Promise<void> => {
    const mutate: jest.Mock<
      Promise<{ data?: UpsertTranslationMutation }>,
      [{ variables: UpsertTranslationMutationVariables }]
    > = jest
      .fn()
      .mockResolvedValueOnce({ data: { upsertTranslation: { ok: 1 } } as UpsertTranslationMutation })
      .mockResolvedValueOnce({ data: { upsertTranslation: { ok: 2 } } as UpsertTranslationMutation });
    useMutationMock.mockReturnValue([mutate]);

    const { result } = renderHook(() => useUpsertMultipleTranslations());

    await act(async () => {
      const responses: Array<UpsertTranslationMutation | undefined> = await result.current.upsertMultiple([
        { key: "a", value: "va", lang: "fr" },
        { key: "b", value: "vb", lang: "en" },
      ]);
      expect(responses).toEqual([
        { upsertTranslation: { ok: 1 } },
        { upsertTranslation: { ok: 2 } },
      ]);
    });

    expect(mutate).toHaveBeenCalledTimes(2);
  });

  it("useUpsertCurrentTranslation throws and logs on error", async (): Promise<void> => {
    const error: Error = new Error("boom");
    const mutate: jest.Mock<
      Promise<{ data?: UpsertTranslationMutation }>,
      [{ variables: UpsertTranslationMutationVariables }]
    > = jest.fn().mockRejectedValue(error);
    const loading: boolean = false;
    const apolloError: ApolloError | undefined = undefined;
    useMutationMock.mockReturnValue([mutate, { loading, error: apolloError }]);
    const consoleSpy: jest.SpyInstance<void, [message?: unknown, ...optionalParams: unknown[]]> = jest
      .spyOn(console, "error")
      .mockImplementation((): void => undefined);

    const { result } = renderHook(() => useUpsertCurrentTranslation());

    await expect(async (): Promise<void> => {
      await act(async () => {
        await result.current.upsertTranslation("k", "v");
      });
    }).rejects.toThrow("boom");

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
