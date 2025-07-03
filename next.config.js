/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    scrollRestoration: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Exclure les modules Lightning côté client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        events: false,
        querystring: false,
        punycode: false,
        string_decoder: false,
        timers: false,
        tty: false,
        vm: false,
        worker_threads: false,
        child_process: false,
        cluster: false,
        dgram: false,
        dns: false,
        domain: false,
        module: false,
        process: false,
        readline: false,
        repl: false,
        string_decoder: false,
        sys: false,
        v8: false,
      };
      
      // Alias pour remplacer les services Lightning par des stubs côté client
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/services/lightning-service': '@/lib/services/lightning-stubs',
        '@/lib/services/daznode-lightning-service': '@/lib/services/lightning-stubs',
        '@/lib/services/unified-lightning-service': '@/lib/services/lightning-stubs',
        'lightning': false,
        '@grpc/grpc-js': false,
        'grpc': false,
        'protobufjs': false,
        'google-protobuf': false,
        'node-grpc': false,
      };

      // Ignorer complètement les modules Lightning côté client
      config.externals = config.externals || [];
      config.externals.push({
        'lightning': 'lightning',
        '@grpc/grpc-js': '@grpc/grpc-js',
        'grpc': 'grpc',
        'protobufjs': 'protobufjs',
        'google-protobuf': 'google-protobuf',
        'node-grpc': 'node-grpc',
      });
    }

    // Optimisations pour la production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    // Support SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Optimisation des headers pour le cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  // Redirections SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/fr/index.html',
        destination: '/fr',
        permanent: true,
      },
      {
        source: '/en/index.html',
        destination: '/en',
        permanent: true,
      },
    ];
  },
  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Configuration i18n - Supprimée car next-intl gère l'i18n avec App Router
}
const withNextIntl = require('next-intl/plugin')();
module.exports = withNextIntl(nextConfig);
