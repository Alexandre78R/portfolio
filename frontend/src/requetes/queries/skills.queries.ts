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

export const SKILL_BY_ID = gql`
    query SkillById($id: Int!) {
        skillById(id: $id) {
            code
            message
            subItems {
                id
                name
                image
                categoryId
            }
        }
    }
`;

export const SKILL_CATEGORY_BY_ID = gql`
    query SkillCategoryById($id: Int!) {
        skillCategoryById(id: $id) {
            code
            message
            categories {
                id
                categoryEN
                categoryFR
                skills {
                    id
                    name
                    image
                    categoryId
                }
            }
        }
    }
`;