import { gql } from "@apollo/client";

export const GENERATE_BACKUP  = gql`
  mutation GenerateDatabaseBackup {
    generateDatabaseBackup {
      path
      message
      code
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

// export const UPLOAD_CV = gql`
//   mutation UploadCV($file: Upload!) {
//     uploadCV(file: $file)
//   }
// `;

export const UPLOAD_CV = gql`
  mutation UploadCV($file: Upload!) {
    uploadCV(file: $file) {
      code
      message
      url
    }
  }
`;