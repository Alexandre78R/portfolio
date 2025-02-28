import { gql } from "@apollo/client";

export const GET_PROJECTS_LIST = gql`
  query GetProjectsList {
    projectsList {
      id
      title
      descriptionFR
      descriptionEN
      typeDisplay
      github
      contentDisplay
      skills {
        name
        image
      }
    }
  }
`;