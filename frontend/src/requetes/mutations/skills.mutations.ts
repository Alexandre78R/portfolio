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
