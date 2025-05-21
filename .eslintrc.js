module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'off',
    'react/no-unescaped-entities': 'off'
  },
  ignorePatterns: [
    '*.config.js',
    '*.setup.js',
    'build/**',
    '.next/**'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
  }
}
