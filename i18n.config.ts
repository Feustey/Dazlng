import { Pathnames } from "next-intl/navigation";

export const locales = ["fr", "en", "de", "es"] as const;
export const defaultLocale = "fr" as const;

export type Locale = (typeof locales)[number];

export const pathnames = {
  "/": "/",
  "/about": "/about",
  "/contact": "/contact",
  "/help": "/help",
  "/payment": "/payment",
  "/checkout": "/checkout",
  "/profile": "/profile",
  "/settings": "/settings",
} satisfies Pathnames<typeof locales>;

export const localePrefix = "always"; // Default

export type PathnameLocale = typeof pathnames;
