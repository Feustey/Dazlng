import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n.config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "next-intl",
    "@getalby/bitcoin-connect",
    "@getalby/sdk",
    "@nostr-dev-kit/ndk",
    "mongodb",
  ],
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // Optimisations de performance
  poweredByHeader: false,
  compress: true,
};

export default withNextIntl(nextConfig);
