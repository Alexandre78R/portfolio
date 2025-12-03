import { gql } from "@apollo/client";

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

export const UPDATE_SKILL = gql`
  mutation UpdateSkill($id: Int!, $data: UpdateSkillInput!) {
    updateSkill(id: $id, data: $data) {
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
  mutation DeleteSkill($id: Int!) {
    deleteSkill(id: $id) {
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
