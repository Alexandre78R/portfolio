import { gql } from "@apollo/client";

export const CREATE_SOCIAL = gql`
  mutation CreateSocial($data: CreateSocialInput!) {
    createSocial(data: $data) {
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

export const UPDATE_SOCIAL = gql`
  mutation UpdateSocial($id: Int!, $data: UpdateSocialInput!) {
    updateSocial(id: $id, data: $data) {
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

export const DELETE_SOCIAL = gql`
  mutation DeleteSocial($id: Int!) {
    deleteSocial(id: $id) {
      code
      message
    }
  }
`;
