import { gql } from "@apollo/client";

export const VALIDATE_CAPTCHA  = gql`
  mutation ValidateCaptcha($challengeType: String!, $selectedIndices: [Float!]!, $idCaptcha: String!) {
    validateCaptcha(challengeType: $challengeType, selectedIndices: $selectedIndices, idCaptcha: $idCaptcha) {
    isValid
  }
}
`;

export const CLEAR_CAPTCHA  = gql`
  mutation ClearCaptcha($idCaptcha: String!) {
    clearCaptcha(idCaptcha: $idCaptcha)
}
`;