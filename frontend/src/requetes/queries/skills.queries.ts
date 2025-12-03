import { gql } from "@apollo/client";

export const GET_SKILL_BY_ID = gql`
  query GetSkillById($id: Int!) {
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