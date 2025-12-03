import { gql } from "@apollo/client";

export const GET_SKILL_CATEGORIES_LIST = gql`
  query GetSkillCategoriesList {
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

export const GET_SKILL_CATEGORY_BY_ID = gql`
  query GetSkillCategoryById($id: Int!) {
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
