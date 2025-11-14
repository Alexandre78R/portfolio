import { gql } from "@apollo/client";

export const CREATE_EXPERIENCE = gql`
  mutation CreateExperience($data: CreateExperienceInput!) {
    createExperience(data: $data) {
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

export const UPDATE_EXPERIENCE = gql`
  mutation UpdateExperience($data: UpdateExperienceInput!) {
    updateExperience(data: $data) {
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

export const DELETE_EXPERIENCE = gql`
  mutation DeleteExperience($id: Int!) {
    deleteExperience(id: $id) {
      code
      message
    }
  }
`;
