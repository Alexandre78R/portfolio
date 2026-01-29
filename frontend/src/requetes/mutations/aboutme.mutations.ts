import { gql } from "@apollo/client";

export const UPDATE_ABOUT_ME = gql`
  mutation UpdateAboutMe($data: UpdateAboutMeInput!) {
    updateAboutMe(data: $data) {
      aboutMe {
        id
        titleEN
        titleFR
        descriptionEN
        descriptionFR
      }
      code
      message
    }
  }
`;
