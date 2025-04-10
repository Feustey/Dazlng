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
      "localhost",
      "avatars.githubusercontent.com",
      "getalby.com",
      "relay.getalby.com",
    ],
  },

  // Packages externes
  transpilePackages: ["next-intl"],

  // Désactiver Edge Runtime pour toute l'application
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "bcryptjs"],
  },

  // Configuration spécifique pour le runtime
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
};

export default withNextIntl(nextConfig);
