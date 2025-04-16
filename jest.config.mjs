import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@lib/(.*)$": "<rootDir>/app/lib/$1",
    "^@components/(.*)$": "<rootDir>/app/components/$1",
    "^@services/(.*)$": "<rootDir>/app/services/$1",
    "^@utils/(.*)$": "<rootDir>/app/utils/$1",
    "^@ui/(.*)$": "<rootDir>/app/components/ui/$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "mjs"],
  transformIgnorePatterns: [
    "node_modules/(?!(msw|@mswjs)/)",
    "node_modules/(?!jsonwebtoken)/",
  ],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  globals: {
    "process.env.NEXT_PUBLIC_SUPABASE_URL": "http://localhost:3000",
    "process.env.NEXT_PUBLIC_API_URL": "http://localhost:3000/api",
  },
};

export default createJestConfig(customJestConfig);
