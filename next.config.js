const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garder uniquement les packages essentiels pour le mobile-first
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@expo/vector-icons',
    'expo-linking',
    'expo-constants'
  ],
  // Configuration webpack optimisée
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      ...((config.resolve.extensions || [])),
    ]
    // Optimisations pour la production
    if (!config.isServer) {
      config.optimization.splitChunks.cacheGroups = {
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          priority: 10
        }
      }
    }
    return config
  },
  // Optimisations d'images pour mobile
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
}); 