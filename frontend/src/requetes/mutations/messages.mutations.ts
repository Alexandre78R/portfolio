import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($subject: String!, $content: String!, $recipients: String!) {
    sendMessage(subject: $subject, content: $content, recipients: $recipients) {
      code
      message
    }
  }
`;
