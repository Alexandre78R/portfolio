import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
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

export const CREATE_SKILL = gql`
  mutation CreateSkill($data: CreateSkillInput!) {
    createSkill(data: $data) {
      subItems {
        name
        image
        id
        categoryId
      }
      message
      code
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $data: UpdateCategoryInput!) {
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

export const UPDATE_SKILL = gql`
  mutation UpdateSkill($data: UpdateSkillInput!, $updateSkillId: Int!) {
    updateSkill(data: $data, id: $updateSkillId) {
      subItems {
        name
        image
        id
        categoryId
      }
      message
      code
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id) {
      code
      message
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation DeleteSkill($deleteSkillId: Int!) {
    deleteSkill(id: $deleteSkillId) {
      subItems {
        name
        image
        id
        categoryId
      }
      message
      code
    }
  }
`;
