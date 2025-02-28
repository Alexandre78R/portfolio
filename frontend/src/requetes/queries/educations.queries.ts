import { gql } from "@apollo/client";

export const GET_EDUCATIONS_LIST = gql`
  query GetEducationsList {
    educationList {
      id
      titleEN
      titleFR
      diplomaLevelEN
      diplomaLevelFR
      school
      location
      year
      startDateEN
      startDateFR
      endDateEN
      endDateFR
      month
      typeEN
      typeFR
    }
  }
`;