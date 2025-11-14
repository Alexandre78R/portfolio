import { gql } from "@apollo/client";

export const GET_EXPERIENCES_LIST = gql`
  query GetExperiencesList {
    experienceList {
      message
      code
      experiences {
        employmentContractEN
        business
        employmentContractFR
        endDateEN
        endDateFR
        jobEN
        id
        jobFR
        month
        startDateEN
        startDateFR
        typeEN
        typeFR
      }
    }
  }
`;

export const GET_EXPERIENCE_BY_ID = gql`
  query GetExperienceById($id: Int!) {
    experienceById(id: $id) {
      code
      message
      experience {
        id
        jobFR
        jobEN
        business
        typeFR
        typeEN
        employmentContractFR
        employmentContractEN
        startDateFR
        startDateEN
        endDateFR
        endDateEN
        month
      }
    }
  }
`;