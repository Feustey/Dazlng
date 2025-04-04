"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { HelpCircle, Info, Zap } from "lucide-react";
import SocialLinks from "./SocialLinks";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <div>
            <ul className="flex flex-col space-y-4">
              <li className="relative">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/help`}
                    className="flex items-center gap-2 text-orange-500 hover:text-blue-500 transition-colors"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="text-sm">{t("links.help")}</span>
                  </Link>
                  <div className="absolute left-[100px]">
                    <Link
                      href={`/${locale}/daznode`}
                      className="flex items-center gap-2 text-blue-500 hover:text-orange-500 transition-colors font-bold"
                      prefetch={true}
                    >
                      <Zap className="h-5 w-5" />
                      <span className="text-sm whitespace-nowrap">
                        {t("links.getNode")}
                      </span>
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="flex items-center gap-2 text-orange-500 hover:text-blue-500 transition-colors"
                >
                  <Info className="h-5 w-5" />
                  <span className="text-sm">{t("links.about")}</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <SocialLinks />
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p className="text-sm">
            © {new Date().getFullYear()} DazLng. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
