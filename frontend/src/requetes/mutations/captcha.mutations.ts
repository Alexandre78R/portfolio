import { gql } from "@apollo/client";

export const VALIDATE_CAPTCHA  = gql`
  mutation ValidateCaptcha($challengeType: String!, $selectedIndices: [Float!]!) {
    validateCaptcha(challengeType: $challengeType, selectedIndices: $selectedIndices) {
    isValid
  }
  }
`;