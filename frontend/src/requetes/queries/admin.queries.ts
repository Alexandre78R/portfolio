import { gql } from "@apollo/client";

export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    getGlobalStats {
      code
      message
      stats {
        totalUsers
        totalProjects
        totalSkills
        totalEducations
        totalExperiences
        usersByRoleAdmin
        usersByRoleEditor
        usersByRoleView
      }
    }
    getAverageSkillsPerProject
    getUsersRoleDistribution {
        admin
        editor
        view
        message
        code
    }
    getTopUsedSkills {
        code
        message
        skills {
        id
        name
        usageCount
        }
    }
}
`;
