import { gql } from "@apollo/client";

export const GET_EXPERIENCES_LIST = gql`
  query GetExperiencesList {
    experienceList {
      id
      jobEN
      jobFR
      business
      employmentContractEN
      employmentContractFR
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