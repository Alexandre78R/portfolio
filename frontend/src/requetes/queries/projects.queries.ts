import { gql } from "@apollo/client";

export const GET_PROJECTS_LIST = gql`
  query GetProjectsList {
    listProjects {
      message
      code
      projects {
        contentDisplay
        descriptionEN
        descriptionFR
        github
        id
        image
        video
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