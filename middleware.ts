import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "fr";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Skip all paths that should not be internationalized
    "/((?!api|_next|.*\\..*).*)",
  ],
};
