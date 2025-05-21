#!/bin/bash

# 1. Installer les dépendances nécessaires
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 2. Mettre à jour .eslintrc.js
cat > .eslintrc.js << EOL
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    'no-console': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'react-native/no-inline-styles': 'warn',
  },
}
EOL

# 3. Créer le fichier de logging
mkdir -p lib
cat > lib/logger.ts << EOL
export const logger = {
  info: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message)
    }
  },
  error: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(message)
    }
  }
}
EOL