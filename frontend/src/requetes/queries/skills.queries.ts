import { gql } from "@apollo/client";

export const GET_SKILLS_LIST = gql`
    query GetSkillsList {
        skillList {
            categories {
            categoryFR
            id
            skills {
                categoryId
                id
                image
                name
            }
            categoryEN
            }
            code
            message
        }
    }
`;