import { gql } from "@apollo/client";

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      message
      code
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: Int!, 
    $firstname: String, 
    $lastname: String, 
    $email: String, 
    $role: String
  ) {
    updateUser(
      id: $id, 
      firstname: $firstname, 
      lastname: $lastname, 
      email: $email, 
      role: $role
    ) {
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

export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    registerUser(data: $data) {
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
