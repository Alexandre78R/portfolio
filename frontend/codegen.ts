import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:4000/graphql": {
        headers: {
          "x-api-key": "gr2e@%h&3y_c@nx053(4hg+sdw4voe91nt@6z&4uc!ice6c)ej"
        }
      }
    }
  ],
  // schema: {
  //   'github:user/repo#branchName:path/to/file.graphql':
  //     { token: "<YOUR GITHUB TOKEN>" }
  // },
  documents: [
    "src/requetes/queries/*.queries.ts",
    "src/requetes/mutations/*.mutations.ts"
  ],
  generates: {
    "./src/types/graphql.ts": {
      config: {
        useIndexSignature: true
      },
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ]
    }
  },
  verbose: true
};

export default config;