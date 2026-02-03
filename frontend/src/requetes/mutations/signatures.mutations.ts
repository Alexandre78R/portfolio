import { gql } from "@apollo/client";

export const CREATE_SIGNATURE = gql`
  mutation CreateSignature($data: CreateSignatureInput!) {
    createSignature(data: $data) {
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

export const UPDATE_SIGNATURE = gql`
  mutation UpdateSignature($data: UpdateSignatureInput!) {
    updateSignature(data: $data) {
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

export const DELETE_SIGNATURE = gql`
  mutation DeleteSignature($id: Int!) {
    deleteSignature(id: $id) {
      code
      message
    }
  }
`;
