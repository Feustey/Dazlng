module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/lib/(.*)$": "<rootDir>/app/lib/$1",
    "^@/models/(.*)$": "<rootDir>/app/models/$1",
    "^@/services/(.*)$": "<rootDir>/app/services/$1",
    "^@/utils/(.*)$": "<rootDir>/app/utils/$1",
    "^@prisma/client$": "<rootDir>/node_modules/@prisma/client",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.json",
    },
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
