import { useMutation, useQuery, ApolloError, OperationVariables, DocumentNode } from "@apollo/client";
import {
  LIST_TRANSLATIONS_PAGINATED,
  // UPSERT_TRANSLATION,
} from "../../requetes/queries/translation.queries";
import { UPSERT_TRANSLATION as UPSERT_TRANSLATION_MUTATION } from "../../requetes/mutations/translation.mutations";
import type {
  ListTranslationsPaginatedQuery,
  ListTranslationsPaginatedQueryVariables,
  UpsertTranslationMutation,
  UpsertTranslationMutationVariables,
} from "@/types/graphql";

/**
 * Interface for translation item from backend
 */
interface TranslationItemDTO {
  readonly key: string;
  readonly value: string;
}

/**
 * Interface for useListTranslationsPaginated return type
 */
interface UseListTranslationsPaginatedReturn {
  readonly data: ListTranslationsPaginatedQuery | undefined;
  readonly loading: boolean;
  readonly error: ApolloError | undefined;
  readonly refetch: () => Promise<unknown>;
}

/**
 * Interface for useUpsertTranslation return type
 */
interface UseUpsertTranslationReturn {
  readonly upsertTranslation: (key: string, value: string, lang: string) => Promise<UpsertTranslationMutation | undefined>;
  readonly loading: boolean;
  readonly error: ApolloError | undefined;
}

/**
 * Hook to fetch paginated translations (admin only)
 * @description Retrieve translations with pagination support
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 20)
 * @param lang - Language filter ('fr', 'en', or null for all)
 * @param searchTerm - Search term to filter translations
 * @returns Object with translations data, loading state, error, and refetch function
 */
export const useListTranslationsPaginated = (
  page: number = 1,
  limit: number = 10,
  lang: string | null = null,
  searchTerm: string | null = null
): UseListTranslationsPaginatedReturn => {
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
    data,
    loading,
    error,
    refetch: async (): Promise<unknown> => {
      return await refetch();
    },
  };
};

/**
 * Hook to update a translation (admin only)
 * @description Update existing translation by key and language
 * @note Can only modify existing keys, cannot create new ones
 * @returns Object with upsertTranslation function, loading state, and error
 */
export const useUpsertTranslation = (): UseUpsertTranslationReturn => {
  const [upsertTranslation, { loading, error }] = useMutation<
    UpsertTranslationMutation,
    UpsertTranslationMutationVariables
  >(UPSERT_TRANSLATION_MUTATION as DocumentNode, {
    refetchQueries: [{ query: LIST_TRANSLATIONS_PAGINATED as DocumentNode }],
    awaitRefetchQueries: true,
  });

  /**
   * Execute upsert mutation with error handling
   */
  const executeUpsert = async (
    key: string,
    value: string,
    lang: string = "fr"
  ): Promise<UpsertTranslationMutation | undefined> => {
    try {
      const result = await upsertTranslation({
        variables: { key, value, lang } as unknown as UpsertTranslationMutationVariables,
      });
      return result.data ?? undefined;
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
      console.error(`Error upserting translation for key ${key}:`, errorMessage);
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
 * Hook to update multiple translations
 * @description Batch update multiple translation entries
 * @returns Object with upsertMultiple function
 */
export const useUpsertMultipleTranslations = () => {
  const [upsertTranslation] = useMutation<
    UpsertTranslationMutation,
    UpsertTranslationMutationVariables
  >(UPSERT_TRANSLATION_MUTATION as DocumentNode, {
    refetchQueries: [{ query: LIST_TRANSLATIONS_PAGINATED as DocumentNode }],
    awaitRefetchQueries: true,
  });

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
