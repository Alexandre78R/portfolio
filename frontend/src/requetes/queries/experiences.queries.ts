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