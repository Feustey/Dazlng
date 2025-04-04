"use client";

import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import SocialLinks from "./SocialLinks";

export function Footer() {
  const { language: currentLocale, t } = useLanguage();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-muted-foreground">{t("footer.description")}</p>
          </div>
          <div>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/help`}
                  className="text-orange-500 hover:text-blue-500 transition-colors"
                >
                  {t("footer.help")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/about`}
                  className="text-orange-500 hover:text-blue-500 transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/daznode`}
                  className="text-orange-500 hover:text-blue-500 transition-colors font-bold"
                >
                  {t("footer.daznode")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <SocialLinks />
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} DazLng. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
