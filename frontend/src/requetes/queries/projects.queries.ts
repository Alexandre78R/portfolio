import { gql } from "@apollo/client";

export const GET_PROJECTS_LIST = gql`
  query GetProjectsList {
    projectList {
      id
      title
      github
      descriptionFR
      descriptionEN
      contentDisplay
      typeDisplay
      skills {
        id
        name
        image
        categoryId
      }
    }
  }
`;