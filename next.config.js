/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
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
    'react-native-reanimated'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png|webp|avif|ico|gif)',
      locale: false,
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        }
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate'
        }
      ]
    },
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  async redirects() {
    return [
      {
        source: '/admin1974',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  // Configuration du sous-domaine app
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrites pour le sous-domaine app.dazno.de
        {
          source: '/:path*',
          destination: '/user/:path*',
          has: [
            {
              type: 'host',
              value: 'app.dazno.de',
            },
          ],
        },
        {
          source: '/',
          destination: '/user/dashboard',
          has: [
            {
              type: 'host',
              value: 'app.dazno.de',
            },
          ],
        },
      ],
    };
  },
}

module.exports = nextConfig
