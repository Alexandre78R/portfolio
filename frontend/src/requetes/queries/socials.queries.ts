import { gql } from "@apollo/client";

export const GET_SOCIALS_LIST = gql`
  query GetSocialsList {
    listSocials {
      id
      title
      url
      tab
    }
  }
`;

export const GET_SOCIAL_BY_ID = gql`
  query GetSocialById($id: Int!) {
    getSocialById(id: $id) {
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
