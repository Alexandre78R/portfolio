import { gql } from "@apollo/client";

export const CREATE_EDUCATION = gql`
  mutation CreateEducation($data: CreateEducationInput!) {
    createEducation(data: $data) {
      education {
        id
        school
        location
        diplomaLevelFR
        diplomaLevelEN
        titleFR
        titleEN
        typeFR
        typeEN
        startDateFR
        startDateEN
        endDateFR
        endDateEN
        month
        year
      }
      code
    }
  }
`;

export const UPDATE_EDUCATION = gql`
  mutation UpdateEducation($data: UpdateEducationInput!) {
    updateEducation(data: $data) {
      education {
        id
        school
        location
        diplomaLevelFR
        diplomaLevelEN
        titleFR
        titleEN
        typeFR
        typeEN
        startDateFR
        startDateEN
        endDateFR
        endDateEN
        month
        year
      }
      message
      code
    }
  }
`;

export const DELETE_EDUCATION = gql`
  mutation DeleteEducation($id: Int!) {
    deleteEducation(id: $id) {
      message
      code
    }
  }
`;