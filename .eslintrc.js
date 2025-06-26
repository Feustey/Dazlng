module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-unused-styles': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/alt-text': 'warn',
    '@next/next/no-img-element': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/ban-ts-comment': 'off'
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
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}
