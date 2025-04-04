"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { HelpCircle, Info, Zap } from "lucide-react";
import SocialLinks from "./SocialLinks";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t dark:border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground/90">
              DazLng
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground/90 max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/help`}
                  className="flex items-center gap-2 text-orange-500 hover:text-blue-500 transition-colors dark:text-orange-400 dark:hover:text-blue-400"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm">{t("links.help")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="flex items-center gap-2 text-orange-500 hover:text-blue-500 transition-colors dark:text-orange-400 dark:hover:text-blue-400"
                >
                  <Info className="h-4 w-4" />
                  <span className="text-sm">{t("links.about")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux et CTA */}
          <div>
            <Link
              href={`/${locale}/daznode`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-orange-500 transition-colors dark:bg-blue-600 dark:hover:bg-orange-600 mb-6"
              prefetch={true}
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium whitespace-nowrap">
                {t("links.getNode")}
              </span>
            </Link>
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground dark:border-border dark:text-muted-foreground/90">
          <p className="text-sm">
            © {new Date().getFullYear()} DazLng. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
