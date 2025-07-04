module.exports = {
  testEnvironment: \node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'},
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jso\n],
  testMatch: [
    '*/__tests__/*/*.test.(ts|tsx|js)',
    '*/tests/api/*/*.test.(ts|tsx|js)'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'},
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jso\n}}}; 