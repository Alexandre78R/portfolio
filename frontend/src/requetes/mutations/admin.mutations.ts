import { gql } from "@apollo/client";

export const GENERATE_BACKUP  = gql`  
  mutation generateDatabaseBackup {
    generateDatabaseBackup {
        code
        message
        path
    }
}
`;