import { gql } from "@apollo/client";

export const GET_SKILLS_LIST = gql`
    query GetSkillsList {
        skillList {
            id
            categoryFR
            categoryEN
            skills {
                name
                image
            }
        }
    }
`;