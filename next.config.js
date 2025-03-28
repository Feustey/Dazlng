/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['mcp-c544a464bb52.herokuapp.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  transpilePackages: [
    '@heroicons/react',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-slot',
    '@radix-ui/react-toast',
    'lucide-react',
    'next-themes',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'tailwindcss-animate'
  ]
};

module.exports = nextConfig;
