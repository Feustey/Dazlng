/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@formatjs/intl-localematcher"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@formatjs/intl-localematcher": require.resolve(
        "@formatjs/intl-localematcher"
      ),
    };
    return config;
  },
};

export default nextConfig;
