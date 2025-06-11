import { gql } from "@apollo/client";

export const GET_PROJECTS_LIST = gql`
  query GetProjectsList {
    projectList {
      message
      code
      projects {
        contentDisplay
        descriptionEN
        descriptionFR
        github
        id
        skills {
          categoryId
          id
          image
          name
        }
        title
        typeDisplay
      }
    }
  }
`;