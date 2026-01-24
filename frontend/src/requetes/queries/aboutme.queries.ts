import { gql } from "@apollo/client";

export const GET_ABOUT_ME = gql`
  query GetAboutMe {
    getAboutMe {
      aboutMe {
        id
        titleEN
        titleFR
        descriptionEN
        descriptionFR
      }
      message
      code
    }
  }
`;
