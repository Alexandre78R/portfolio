import { gql } from "@apollo/client";

export const GET_EDUCATIONS_LIST = gql`
  query GetEducationsList {
    listEducations {
      message
      code
      educations {
        diplomaLevelEN
        diplomaLevelFR
        endDateEN
        endDateFR
        id
        location
        month
        school
        startDateEN
        startDateFR
        titleEN
        titleFR
        typeEN
        typeFR
        year
      }
    }
  }
`;

export const GET_EDUCATION_BY_ID = gql`
  query GetEducationById($id: Int!) {
    getEducationById(id: $id) {
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
