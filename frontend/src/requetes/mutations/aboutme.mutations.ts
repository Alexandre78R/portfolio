import { gql } from "@apollo/client";

export const CREATE_ABOUT_ME = gql`
  mutation CreateAboutMe($data: CreateAboutMeInput!) {
    createAboutMe(data: $data) {
      aboutMe {
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

export const UPDATE_ABOUT_ME = gql`
  mutation UpdateAboutMe($data: UpdateAboutMeInput!) {
    updateAboutMe(data: $data) {
      aboutMe {
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

export const DELETE_ABOUT_ME = gql`
  mutation DeleteAboutMe($id: Int!) {
    deleteAboutMe(id: $id) {
      code
      message
    }
  }
`;
