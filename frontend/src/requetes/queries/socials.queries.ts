import { gql } from "@apollo/client";

export const GET_SOCIALS_LIST = gql`
  query GetSocialsList {
    socialList {
      id
      title
      url
      tab
    }
  }
`;

export const GET_SOCIAL_BY_ID = gql`
  query GetSocialById($id: Int!) {
    socialById(id: $id) {
      social {
        id
        title
        url
        tab
      }
      code
      message
    }
  }
`;
