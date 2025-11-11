import { gql } from "@apollo/client";

export const GET_USERS_LIST = gql`
  query GetUsersList {
    userList {
      users {
        id
        firstname
        lastname
        email
        role
        isPasswordChange
      }
      message
      code
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    userById(id: $id) {
      user {
        id
        firstname
        lastname
        email
        role
        isPasswordChange
      }
      message
      code
    }
  }
`;