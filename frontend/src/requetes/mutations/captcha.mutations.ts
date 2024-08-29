import { gql } from "@apollo/client";

export const VALIDATE_CAPTCHA  = gql`
  mutation ValidateCaptcha($challengeType: String!, $selectedIndices: [Float!]!, $idCaptcha: String!) {
    validateCaptcha(challengeType: $challengeType, selectedIndices: $selectedIndices, idCaptcha: $idCaptcha) {
    isValid
  }
  }
`;