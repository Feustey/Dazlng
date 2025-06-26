module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/alt-text': 'warn',
    '@next/next/no-img-element': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'off'
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
