import { gql } from "@apollo/client";

export const LOGIN  = gql`
mutation Mutation($data: LoginInput!) {
  login(data: $data) {
    token
    message
    code
  }
}
`;