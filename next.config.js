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
