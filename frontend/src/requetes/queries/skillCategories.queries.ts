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

export const SEARCH_SKILLS = gql`
  query SearchSkills($searchTerm: String) {
    searchSkills(searchTerm: $searchTerm) {
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
