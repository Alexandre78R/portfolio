import { gql } from "@apollo/client";

export const GET_CV = gql`
    query CV {
    cvUrl
    }
`;