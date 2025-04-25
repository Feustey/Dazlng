import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin("./app/i18n.config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base simplifiée
  reactStrictMode: true,

  // Configuration des images
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },

  // Packages externes
  transpilePackages: ["next-intl"],

  // Désactiver Edge Runtime pour toute l'application
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  // Configuration spécifique pour le runtime
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },

  // Modifier la configuration webpack pour gérer les modules problématiques
  webpack: (config) => {
    // Ajoute la résolution des alias définis dans tsconfig.json
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "app"),
      "@components": path.resolve(__dirname, "app/components"),
      "@services": path.resolve(__dirname, "app/services"),
      "@lib": path.resolve(__dirname, "app/lib"),
      "@utils": path.resolve(__dirname, "app/utils"),
      "@ui": path.resolve(__dirname, "app/components/ui"),
      "@hooks": path.resolve(__dirname, "app/hooks"),
    };
    // Exclusions existantes
    config.externals = [...config.externals, "bcryptjs"];
    return config;
  },

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

export default withNextIntl(nextConfig);
