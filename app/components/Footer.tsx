"use client";

import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";

export function Footer() {
  const { language: currentLocale, t } = useLanguage();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{t("footer.about")}</h3>
            <p className="text-muted-foreground">{t("footer.description")}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/help`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("footer.help")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/privacy`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/terms`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/dazlng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/dazlng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Twitter
                </a>
              </li>
            </ul>
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
