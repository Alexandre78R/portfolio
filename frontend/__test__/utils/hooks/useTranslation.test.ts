import { renderHook, act } from "@testing-library/react";
import {
  useListTranslationsPaginated,
  useUpsertTranslation,
  useUpsertMultipleTranslations,
} from "@/utils/hooks/useTranslation";
import { LIST_TRANSLATIONS_PAGINATED } from "@/requetes/queries/translation.queries";
import type {
  ListTranslationsPaginatedQuery,
  ListTranslationsPaginatedQueryVariables,
  UpsertTranslationMutation,
  UpsertTranslationMutationVariables,
} from "@/types/graphql";
import type { ApolloError } from "@apollo/client";

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
  };
});

const apolloMocks: { useQuery: jest.Mock; useMutation: jest.Mock } = jest.requireMock("@apollo/client");
const useQueryMock: jest.Mock = apolloMocks.useQuery;
const useMutationMock: jest.Mock = apolloMocks.useMutation;

describe("useTranslation hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useListTranslationsPaginated calls query with default variables", (): void => {
    const refetch: jest.Mock<Promise<unknown>, []> = jest.fn().mockResolvedValue({});
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    const data: ListTranslationsPaginatedQuery | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    renderHook(() => useListTranslationsPaginated());

    const expectedVariables: ListTranslationsPaginatedQueryVariables = {
      page: 1,
      limit: 10,
      lang: null,
      searchTerm: null,
    };

    expect(useQueryMock).toHaveBeenCalledWith(LIST_TRANSLATIONS_PAGINATED, {
      variables: expectedVariables,
    });
  });

  it("useListTranslationsPaginated passes custom variables", (): void => {
    const refetch: jest.Mock<Promise<unknown>, []> = jest.fn().mockResolvedValue({});
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    const data: ListTranslationsPaginatedQuery | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    renderHook(() => useListTranslationsPaginated(2, 5, "fr", "hello"));

    const expectedVariables: ListTranslationsPaginatedQueryVariables = {
      page: 2,
      limit: 5,
      lang: "fr",
      searchTerm: "hello",
    };

    expect(useQueryMock).toHaveBeenCalledWith(LIST_TRANSLATIONS_PAGINATED, {
      variables: expectedVariables,
    });
  });

  it("useListTranslationsPaginated exposes refetch that calls underlying refetch", async (): Promise<void> => {
    const refetch: jest.Mock<Promise<{ ok: true }>, []> = jest.fn().mockResolvedValue({ ok: true });
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    const data: ListTranslationsPaginatedQuery | undefined = undefined;
    useQueryMock.mockReturnValue({ data, loading, error, refetch });

    const { result } = renderHook(() => useListTranslationsPaginated());

    await act(async () => {
      await result.current.refetch();
    });

    expect(refetch).toHaveBeenCalled();
  });

  it("useUpsertTranslation calls mutation with variables and returns data", async (): Promise<void> => {
    const mutate: jest.Mock<
      Promise<{ data?: UpsertTranslationMutation }>,
      [{ variables: UpsertTranslationMutationVariables }]
    > = jest.fn().mockResolvedValue({ data: { upsertTranslation: { success: true } } as UpsertTranslationMutation });
    const loading: boolean = false;
    const error: ApolloError | undefined = undefined;
    useMutationMock.mockReturnValue([mutate, { loading, error }]);

    const { result } = renderHook(() => useUpsertTranslation());

    await act(async () => {
      const response: UpsertTranslationMutation | undefined = await result.current.upsertTranslation(
        "key",
        "value",
        "en"
      );
      expect(response).toEqual({ upsertTranslation: { success: true } });
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: { key: "key", value: "value", lang: "en" } as UpsertTranslationMutationVariables,
    });
  });

  it("useUpsertTranslation throws and logs on error", async (): Promise<void> => {
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

    const { result } = renderHook(() => useUpsertTranslation());

    await expect(async (): Promise<void> => {
      await act(async () => {
        await result.current.upsertTranslation("key", "value", "fr");
      });
    }).rejects.toThrow("boom");

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
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
    expect(mutate).toHaveBeenNthCalledWith(1, {
      variables: { key: "a", value: "va", lang: "fr" } as UpsertTranslationMutationVariables,
    });
    expect(mutate).toHaveBeenNthCalledWith(2, {
      variables: { key: "b", value: "vb", lang: "en" } as UpsertTranslationMutationVariables,
    });
  });
});
