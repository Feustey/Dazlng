/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: "standalone",
  generateBuildId: async () => {
    return "build";
  },
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs", "argon2"],
    optimizeCss: true,
    turbo: {
      rules: {
        "*.svg": ["@svgr/webpack"],
      },
    },
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "getalby.com",
      "relay.getalby.com",
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "getalby.com",
      },
      {
        protocol: "https",
        hostname: "relay.getalby.com",
      },
    ],
  },
  // Configuration des en-têtes HTTP
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/checkout/:path*",
        destination: "/checkout/:path*",
        has: [
          {
            type: "header",
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer, nextRuntime }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };

    // Optimisations pour le bundle
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Configuration pour Edge Runtime
    if (nextRuntime === "edge") {
      config.resolve.alias = {
        ...config.resolve.alias,
        mongodb: false,
        mongoose: false,
        bcryptjs: false,
        argon2: false,
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      querystring: false,
      child_process: false,
    };
    return config;
  },
  transpilePackages: [
    "@radix-ui/react-dialog",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toast",
  ],
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_ALBY_PUBLIC_KEY: process.env.NEXT_PUBLIC_ALBY_PUBLIC_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WEBHOOK_URL: process.env.NEXT_PUBLIC_WEBHOOK_URL,
  },
  serverRuntimeConfig: {
    ALBY_SECRET: process.env.ALBY_SECRET,
    ALBY_RELAY_URL: process.env.ALBY_RELAY_URL,
    ALBY_LUD16: process.env.ALBY_LUD16,
    ALBY_WEBHOOK_SECRET: process.env.ALBY_WEBHOOK_SECRET,
  },
};

export default withNextIntl(nextConfig);
