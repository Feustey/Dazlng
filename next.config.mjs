import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./app/i18n.config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: [
    "next-intl",
    "@getalby/bitcoin-connect",
    "@getalby/sdk",
    "@nostr-dev-kit/ndk",
    "mongodb",
  ],
  env: {
    PORT: "3000",
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // Optimisations de performance
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // Configuration du cache
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Configuration de la compilation
  webpack: (config, { dev, isServer }) => {
    // Support des modules ES dans node_modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      layers: true,
    };

    // Ajout de la configuration pour gérer les modules CommonJS
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.m?js$/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    };

    // Configuration pour les modules Node.js natifs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        "fs/promises": false,
        child_process: false,
        crypto: false,
        stream: false,
        util: false,
        zlib: false,
      };
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
