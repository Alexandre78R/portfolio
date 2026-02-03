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
        isVisible
      }
      message
      code
    }
  }
`;

export const GET_ABOUT_ME_BY_ID = gql`
  query GetAboutMeById($id: Int!) {
    getAboutMeById(id: $id) {
      aboutMe {
        id
        titleEN
        titleFR
        descriptionEN
        descriptionFR
        isVisible
      }
      message
      code
    }
  }
`;

export const LIST_ABOUT_ME = gql`
  query ListAboutMe {
    listAboutMe {
      aboutMes {
        id
        titleEN
        titleFR
        descriptionEN
        descriptionFR
        isVisible
      }
      code
      message
    }
  }
`;
