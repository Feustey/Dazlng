const nextJest = require(\next/jest');

const createJestConfig = nextJest({
  dir: './'});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: [
    '<rootDir>/jest.mock-setup.js'
  ],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'},
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'},
  transformIgnorePatterns: [
    '/node_modules/(?!(@supabase|node-fetch|isows|cross-fetch|formdata-polyfill|fetch-blob|data-uri-to-buffer)/)',
  ],
  collectCoverageFrom: [
    'app/*/*.{js,jsx,ts,tsx}',
    '!app/*/*.d.ts',
    '!app/*/_*.{js,jsx,ts,tsx}',
    '!app/*/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80}},
  modulePathIgnorePatterns: ['<rootDir>/.next/']};

module.exports = createJestConfig(customJestConfig);