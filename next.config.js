/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
}

module.exports = nextConfig
