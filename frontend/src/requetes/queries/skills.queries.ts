import { gql } from "@apollo/client";

export const GET_SKILL_BY_ID = gql`
  query GetSkillById($id: Int!) {
    getSkillById(id: $id) {
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