import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["localhost", "avatars.githubusercontent.com"],
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  distDir: ".next",
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
      "@app": join(__dirname, "app"),
      "@components": join(__dirname, "app/components"),
      "@ui": join(__dirname, "app/components/ui"),
      "@lib": join(__dirname, "app/lib"),
      "@hooks": join(__dirname, "app/hooks"),
      "@contexts": join(__dirname, "app/contexts"),
      "@types": join(__dirname, "app/types"),
      "@utils": join(__dirname, "app/utils"),
      "@styles": join(__dirname, "app/styles"),
      "@public": join(__dirname, "public"),
      "@api": join(__dirname, "app/api"),
      "@models": join(__dirname, "app/models"),
      "@config": join(__dirname, "app/config"),
      "@locale": join(__dirname, "app/locale"),
    };
    return config;
  },
  transpilePackages: [
    "@heroicons/react",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-label",
    "@radix-ui/react-menubar",
    "@radix-ui/react-navigation-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slider",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toast",
    "@radix-ui/react-toggle",
    "@radix-ui/react-toggle-group",
    "@radix-ui/react-tooltip",
    "cmdk",
    "lucide-react",
    "next-themes",
    "react-day-picker",
    "react-hook-form",
    "react-resizable-panels",
    "sonner",
    "vaul",
    "zod",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "tailwindcss-animate",
  ],
};

export default withNextIntl(nextConfig);
