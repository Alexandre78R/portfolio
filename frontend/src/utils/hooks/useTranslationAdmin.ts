import {
  useMutation,
  useQuery,
  useLazyQuery,
  ApolloError,
  LazyQueryResult,
  OperationVariables,
  DocumentNode,
} from "@apollo/client";
import { GET_TRANSLATIONS, LIST_TRANSLATIONS_PAGINATED } from "../../requetes/queries/translation.queries";
import { UPSERT_TRANSLATION } from "../../requetes/mutations/translation.mutations";
import type {
  GetTranslationsQuery,
  GetTranslationsQueryVariables,
  ListTranslationsPaginatedQuery,
  ListTranslationsPaginatedQueryVariables,
  UpsertTranslationMutation,
  UpsertTranslationMutationVariables,
} from "@/types/graphql";
import { useLang } from "../../context/Lang/LangContext";

/**
 * Interface for translation item from backend
 */
interface TranslationItemDTO {
  readonly key: string;
  readonly value: string;
}

/**
 * Interface for useGetCurrentTranslations return type
 */
interface UseGetCurrentTranslationsReturn {
  readonly translations: readonly TranslationItemDTO[] | undefined;
  readonly loading: boolean;
  readonly error: ApolloError | undefined;
  readonly refetch: () => Promise<unknown>;
}

/**
 * Interface for useListCurrentTranslationsPaginated return type
 */
interface UseListCurrentTranslationsPaginatedReturn {
  readonly translations: readonly TranslationItemDTO[] | undefined;
  readonly loading: boolean;
  readonly error: ApolloError | undefined;
  readonly refetch: () => Promise<unknown>;
}

/**
 * Hook to fetch current language translations
 * @description Uses LangContext to get translations in current language
 * @returns Object with translations, loading, error, and refetch
 */
export const useGetCurrentTranslations = (): UseGetCurrentTranslationsReturn => {
  const { lang } = useLang();

  const { data, loading, error, refetch } = useQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(
    GET_TRANSLATIONS as DocumentNode,
    {
      variables: { lang } as unknown as OperationVariables,
    }
  );

  return {
    translations: data?.getTranslations,
    loading,
    error,
    refetch: async (): Promise<unknown> => {
      return await refetch();
    },
  };
};

/**
 * Hook to fetch paginated translations for current language (Admin)
 * @description Fetch translations with pagination in current language
 * @param page - Page number
 * @param limit - Items per page
 * @param searchTerm - Optional search filter
 * @returns Object with translations, loading, error, and refetch
 */
export const useListCurrentTranslationsPaginated = (
  page: number = 1,
  limit: number = 20,
  searchTerm: string | null = null
): UseListCurrentTranslationsPaginatedReturn => {
  const { lang } = useLang();

  const { data, loading, error, refetch } = useQuery<
    ListTranslationsPaginatedQuery,
    ListTranslationsPaginatedQueryVariables
  >(LIST_TRANSLATIONS_PAGINATED as DocumentNode, {
    variables: {
      page: page as unknown as number,
      limit: limit as unknown as number,
      lang,
      searchTerm,
    } as unknown as OperationVariables,
  });

  return {
    translations: data?.listTranslationsPaginated,
    loading,
    error,
    refetch: async (): Promise<unknown> => {
      return await refetch();
    },
  };
};

/**
 * Hook to fetch all translations paginated (Admin)
 * @description Fetch all translations regardless of language
 * @param page - Page number
 * @param limit - Items per page
 * @param searchTerm - Optional search filter
 * @returns Object with translations, loading, error, and refetch
 */
export const useListAllTranslationsPaginated = (
  page: number = 1,
  limit: number = 20,
  searchTerm: string | null = null
) => {
  const { data, loading, error, refetch } = useQuery<
    ListTranslationsPaginatedQuery,
    ListTranslationsPaginatedQueryVariables
  >(LIST_TRANSLATIONS_PAGINATED as DocumentNode, {
    variables: {
      page: page as unknown as number,
      limit: limit as unknown as number,
      lang: null,
      searchTerm,
    } as unknown as OperationVariables,
  });

  return {
    translations: data?.listTranslationsPaginated,
    loading,
    error,
    refetch: async (): Promise<unknown> => {
      return await refetch();
    },
  };
};

/**
 * Hook for lazy fetching translations (Admin)
 * @description Lazy query hook for on-demand translation fetching
 * @returns Object with fetch function, translations, loading, and error
 */
export const useLazyListTranslationsPaginated = () => {
  const [fetchTranslations, { data, loading, error }] = useLazyQuery<
    ListTranslationsPaginatedQuery,
    ListTranslationsPaginatedQueryVariables
  >(LIST_TRANSLATIONS_PAGINATED as DocumentNode);

  return {
    fetchTranslations: (
      variables: ListTranslationsPaginatedQueryVariables
    ): Promise<{ data: ListTranslationsPaginatedQuery | undefined }> => {
      return fetchTranslations({ variables } as unknown as {
        variables: OperationVariables;
      });
    },
    translations: data?.listTranslationsPaginated,
    loading,
    error,
  };
};

/**
 * Hook to upsert translation in current language (Admin)
 * @description Update or insert translation for current language
 * @returns Object with upsertTranslation function, loading, and error
 */
export const useUpsertCurrentTranslation = () => {
  const { lang } = useLang();

  const [upsertTranslation, { loading, error }] = useMutation<
    UpsertTranslationMutation,
    UpsertTranslationMutationVariables
  >(UPSERT_TRANSLATION as DocumentNode, {
    refetchQueries: [
      { query: GET_TRANSLATIONS as DocumentNode, variables: { lang } },
      { query: LIST_TRANSLATIONS_PAGINATED as DocumentNode, variables: { lang } },
    ],
    awaitRefetchQueries: true,
  });

  /**
   * Execute upsert with error handling
   */
  const executeUpsert = async (key: string, value: string): Promise<UpsertTranslationMutation | undefined> => {
    try {
      const result = await upsertTranslation({
        variables: { key, value, lang } as unknown as UpsertTranslationMutationVariables,
      });
      return result.data;
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
      console.error("Error upserting translation:", errorMessage);
      throw err;
    }
  };

  return {
    upsertTranslation: executeUpsert,
    loading,
    error,
  };
};

/**
 * Hook to upsert translation for specific language (Admin)
 * @description Update or insert translation for any language
 * @returns Object with upsertTranslation function, loading, and error
 */
export const useUpsertTranslationForLang = () => {
  const [upsertTranslation, { loading, error }] = useMutation<
    UpsertTranslationMutation,
    UpsertTranslationMutationVariables
  >(UPSERT_TRANSLATION as DocumentNode, {
    refetchQueries: [
      { query: GET_TRANSLATIONS as DocumentNode },
      { query: LIST_TRANSLATIONS_PAGINATED as DocumentNode },
    ],
    awaitRefetchQueries: true,
  });

  /**
   * Execute upsert with error handling
   */
  const executeUpsert = async (
    key: string,
    value: string,
    targetLang: string = "fr"
  ): Promise<UpsertTranslationMutation | undefined> => {
    try {
      const result = await upsertTranslation({
        variables: { key, value, lang: targetLang } as unknown as UpsertTranslationMutationVariables,
      });
      return result.data;
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
      console.error("Error upserting translation:", errorMessage);
      throw err;
    }
  };

  return {
    upsertTranslation: executeUpsert,
    loading,
    error,
  };
};

/**
 * Hook to update multiple translations (Admin)
 * @description Batch update multiple translation entries
 * @returns Object with upsertMultiple function
 */
export const useUpsertMultipleTranslations = () => {
  const [upsertTranslation] = useMutation<UpsertTranslationMutation, UpsertTranslationMutationVariables>(
    UPSERT_TRANSLATION as DocumentNode,
    {
      refetchQueries: [
        { query: GET_TRANSLATIONS as DocumentNode },
        { query: LIST_TRANSLATIONS_PAGINATED as DocumentNode },
      ],
      awaitRefetchQueries: true,
    }
  );

  /**
   * Execute multiple upsert mutations sequentially
   */
  const upsertMultiple = async (
    translations: ReadonlyArray<{ readonly key: string; readonly value: string; readonly lang?: string }>
  ): Promise<Array<UpsertTranslationMutation | undefined>> => {
    const results: Array<UpsertTranslationMutation | undefined> = [];

    for (const { key, value, lang = "fr" } of translations) {
      try {
        const result = await upsertTranslation({
          variables: { key, value, lang } as unknown as UpsertTranslationMutationVariables,
        });
        if (result.data) {
          results.push(result.data);
        }
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
        console.error(`Error upserting translation for key ${key}:`, errorMessage);
        throw err;
      }
    }

    return results;
  };

  return {
    upsertMultiple,
  };
};
