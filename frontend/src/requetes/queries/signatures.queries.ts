import { gql } from "@apollo/client";

export const GET_SIGNATURES_LIST = gql`
  query GetSignaturesList {
    listAllSignatures {
      signatures {
        id
        name
        description
      }
      code
      message
    }
  }
`;

export const GET_SIGNATURE_BY_ID = gql`
  query GetSignatureById($id: Int!) {
    getSignatureById(id: $id) {
      signature {
        id
        name
        description
      }
      code
      message
    }
  }
`;
