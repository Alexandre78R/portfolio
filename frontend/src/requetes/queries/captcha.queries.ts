import { gql } from "@apollo/client";

export const GENERATOR_CAPTCHA = gql`
  query generateCaptcha {
    generateCaptcha {
        id
        images {
          typeEN
          typeFR
          url
          id
        }
        challengeType
        challengeTypeTranslation {
          typeEN
          typeFR
        }
    }
  }
`;