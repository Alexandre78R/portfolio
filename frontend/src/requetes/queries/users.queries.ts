import { gql } from "@apollo/client";

export const GET_ME = gql`
    query GetMe {
        me {
            role
            lastname
            isPasswordChange
            id
            firstname
            email
        }
    }
`;

export const GET_USERS_LIST = gql`
  query GetUsersList {
    listUsers {
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
    getUserById(id: $id) {
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