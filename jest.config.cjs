module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/lib/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "lib/**/*.ts",
    "models/**/*.ts",
    "!**/*.d.ts",
    "!**/*.stories.ts",
    "!**/*.test.ts",
  ],
};
