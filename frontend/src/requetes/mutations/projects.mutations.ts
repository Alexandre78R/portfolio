import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($data: CreateProjectInput!) {
    createProject(data: $data) {
      code
      message
      project {
        id
        title
        descriptionFR
        descriptionEN
        typeDisplay
        contentDisplay
        github
        image
        video
        skills {
          id
          name
          image
        }
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($data: UpdateProjectInput!) {
    updateProject(data: $data) {
      code
      message
      project {
        id
        title
        descriptionFR
        descriptionEN
        typeDisplay
        contentDisplay
        github
        image
        video
        skills {
          id
          name
          image
        }
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(id: $id) {
      code
      message
    }
  }
`;
