import { gql } from "@apollo/client";

export const GET_EDUCATIONS_LIST = gql`
  query GetEducationsList {
    educationList {
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