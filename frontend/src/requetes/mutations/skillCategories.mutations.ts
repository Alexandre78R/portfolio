import { gql } from "@apollo/client";

export const CREATE_SKILL_CATEGORY = gql`
  mutation CreateSkillCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      categories {
        skills {
          categoryId
          id
          image
          name
        }
        id
        categoryFR
        categoryEN
      }
      code
      message
    }
  }
`;

export const UPDATE_SKILL_CATEGORY = gql`
  mutation UpdateSkillCategory($id: Int!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
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
      code
      message
    }
  }
`;

export const DELETE_SKILL_CATEGORY = gql`
  mutation DeleteSkillCategory($id: Int!) {
    deleteCategory(id: $id) {
      code
      message
    }
  }
`;
