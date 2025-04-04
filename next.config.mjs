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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://dazlng.inoval.io",
          },
        ],
      },
    ];
  },
  env: {
    PORT: 3000,
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
};

export default nextConfig;
