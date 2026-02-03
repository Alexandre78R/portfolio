import { gql } from "@apollo/client";

/**
 * Query to get translations for a specific language
 * Public query - no authentication required
 */
export const GET_TRANSLATIONS = gql`
  query GetTranslations($lang: String = "fr") {
    getTranslations(lang: $lang) {
      code
      success
      message
      translations {
        key
        value
      }
    }
  }
`;

/**
 * Query to list translations with pagination and search
 * Admin only query
 */
export const LIST_TRANSLATIONS_PAGINATED = gql`
  query ListTranslationsPaginated(
    $page: Float = 1
    $limit: Float = 20
    $lang: String
    $searchTerm: String
  ) {
    listTranslationsPaginated(
      page: $page
      limit: $limit
      lang: $lang
      searchTerm: $searchTerm
    ) {
      code
      success
      message
      translations {
        key
        lang
        value
      }
      total
      page
      limit
    }
  }
`;
