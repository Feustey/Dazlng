import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ["@formatjs/intl-localematcher"],
  },
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
    // Optimisations webpack personnalisées si nécessaire
    return config;
  },
};

export default withNextIntl(nextConfig);
