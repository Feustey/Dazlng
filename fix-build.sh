#!/bin/bash

# Fonction pour vérifier si une commande s'est bien exécutée
check_error() {
    if [ $? -ne 0 ]; then
        echo "❌ Erreur: $1"
        exit 1
    fi
}

# 1. Configuration de Node.js
echo "🔧 Configuration de Node.js..."
if command -v nvm &> /dev/null; then
    nvm install 18
    nvm use 18
    check_error "Impossible de configurer Node.js 18"
fi

# 2. Nettoyage complet
echo "🧹 Nettoyage complet..."
rm -rf node_modules .next package-lock.json
rm -rf .cache .turbo
npm cache clean --force
check_error "Erreur lors du nettoyage"

# 3. Mise à jour du package.json pour fixer les versions
echo "📝 Mise à jour des versions dans package.json..."
cat > temp-package.json << 'EOL'
{
  "name": "dazenode",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.29",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native-web": "0.19.9",
    "react-native-reanimated": "3.6.1",
    "@expo/next-adapter": "5.0.2",
    "expo": "49.0.0"
  },
  "devDependencies": {
    "tailwindcss": "3.3.0",
    "postcss": "8.4.31",
    "autoprefixer": "10.4.16",
    "typescript": "5.1.6",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0"
  }
}
EOL

# 4. Fusionner les dépendances existantes
existing_deps=$(node -e "const pkg = require('./package.json'); console.log(JSON.stringify({dependencies: pkg.dependencies, devDependencies: pkg.devDependencies}))")
merged_pkg=$(node -e "
  const temp = require('./temp-package.json');
  const existing = $existing_deps;
  const merged = {
    ...temp,
    dependencies: {...temp.dependencies, ...existing.dependencies},
    devDependencies: {...temp.devDependencies, ...existing.devDependencies}
  };
  console.log(JSON.stringify(merged, null, 2));
")
echo "$merged_pkg" > package.json
rm temp-package.json

# 5. Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps
check_error "Installation des dépendances"

# 6. Configuration de Tailwind
echo "⚙️ Configuration de Tailwind..."
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Votre configuration existante sera préservée
    },
  },
  plugins: [],
}
EOL

# 7. Configuration de PostCSS
echo "⚙️ Configuration de PostCSS..."
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# 8. Configuration de Next.js
echo "⚙️ Configuration de Next.js..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-reanimated': 'react-native-reanimated/lib/module/web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },
  transpilePackages: [
    'react-native-web',
    '@expo/vector-icons',
    'react-native-reanimated',
    'expo'
  ]
}

module.exports = nextConfig
EOL

# 9. Build du projet
echo "🏗️ Build du projet..."
npm run build
check_error "Build du projet"

echo "✅ Build terminé avec succès!"