import { gql } from "@apollo/client";

export const SEND_CONTACT = gql`
  mutation sendContact($data: ContactFrom!) {
    sendContact(data: $data) {
    label
    message
    status
  }
  }
`;
