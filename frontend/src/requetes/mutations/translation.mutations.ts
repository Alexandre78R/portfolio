import { gql } from "@apollo/client";

/**
 * Mutation to update or create a translation
 * Admin only mutation
 * Note: Can only modify existing keys, cannot create new ones
 */
export const UPSERT_TRANSLATION = gql`
  mutation UpsertTranslation($key: String!, $lang: String = "fr", $value: String!) {
    upsertTranslation(key: $key, lang: $lang, value: $value) {
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
