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

export const DELETE_BACKUP  = gql`  
  mutation DeleteBackupFile($fileName: String!) {
    deleteBackupFile(fileName: $fileName) {
      code
      message
    }
}
`;