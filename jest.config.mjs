import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@lib/(.*)$": "<rootDir>/lib/$1",
    "^@components/(.*)$": "<rootDir>/app/components/$1",
    "^@services/(.*)$": "<rootDir>/app/services/$1",
    "^@utils/(.*)$": "<rootDir>/app/utils/$1",
    "^@ui/(.*)$": "<rootDir>/app/components/ui/$1",
    "^@hooks/(.*)$": "<rootDir>/app/hooks/$1",
    "^@test/(.*)$": "<rootDir>/__tests__/$1",
    "^@mocks/(.*)$": "<rootDir>/__tests__/mocks/$1",
    "^@api/(.*)$": "<rootDir>/app/api/$1",
    "^@config/(.*)$": "<rootDir>/app/config/$1",
    "^@types/(.*)$": "<rootDir>/app/types/$1",
    "^@supabase/(.*)$": "<rootDir>/app/lib/supabase/$1",
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
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/auth/alby.test.ts",
    "/__tests__/auth/albyAuthContext.test.tsx",
    "/__tests__/services/cleanupService.test.ts",
    "/__tests__/services/emailService.test.ts",
    "/__tests__/components/AlbyLoginButton.test.tsx",
  ],
};

export default createJestConfig(customJestConfig);
