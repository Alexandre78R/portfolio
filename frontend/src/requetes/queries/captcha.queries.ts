import { gql } from "@apollo/client";

export const GENERATOR_CAPTCHA = gql`
  query generateCaptcha {
    generateCaptcha {
        id
        images {
            type
            url
            id
        }
        challengeType
    }
  }
`;