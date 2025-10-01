import nextJest from "next/jest";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",    // alias existing (@/...)
    "^@src/(.*)$": "<rootDir>/src/$1", // new alias (@src/...)
  },
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};

export default createJestConfig(config);

// import nextJest from "next/jest";
// import type { Config } from "jest";

// const createJestConfig = nextJest({
//   dir: "./",
// });

// const config: Config = {
//   clearMocks: true,
//   testEnvironment: "jest-environment-jsdom",
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
//   testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
//   // moduleNameMapper: {
//   //   "^@/(.*)$": "<rootDir>/src/$1",
//   // },
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1"  // Ajustez le chemin en fonction de votre structure de répertoires
//   },
//   transform: {
//     "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
//   },
//   // testMatch: [
//   //   "**/__tests__/**/*.[jt]s?(x)",
//   //   "**/?(*.)+(spec|test).[tj]s?(x)",
//   // ],
//     // Les motifs globaux que Jest utilise pour détecter les fichiers de test
//   testMatch: [
//     "**/__tests__/**/*.[jt]s?(x)",
//     "**/?(*.)+(spec|test).[tj]s?(x)"
//   ],

//   // Indique si les informations de couverture doivent être collectées pendant l'exécution des tests
//   // collectCoverage: true,

//   // Le répertoire où Jest doit stocker ses fichiers de couverture
//   coverageDirectory: "coverage",

//   // Le fournisseur qui doit être utilisé pour instrumenter le code pour la couverture
//   coverageProvider: "v8",
// };

// export default createJestConfig(config);