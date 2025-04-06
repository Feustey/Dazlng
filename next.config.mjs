import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [
      "@formatjs/intl-localematcher",
      "@prisma/client",
      "bcryptjs",
      "next-auth",
    ],
    esmExternals: "loose",
  },
  transpilePackages: [
    "next-intl",
    "@getalby/bitcoin-connect",
    "@getalby/sdk",
    "@nostr-dev-kit/ndk",
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
    // Ajout de la configuration pour les modules ES
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx"],
      ".jsx": [".jsx", ".tsx"],
    };

    // Support des modules ES dans node_modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      layers: true,
    };

    return config;
  },
};

export default withNextIntl(nextConfig);
