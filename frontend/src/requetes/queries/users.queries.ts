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