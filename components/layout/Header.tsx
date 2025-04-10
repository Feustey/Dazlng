"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AccountMenu } from "@/app/components/AccountMenu";

export default function Header() {
  const t = useTranslations("Header");
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative">
        {/* Fond avec flou */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-b border-accent/20" />

        {/* Contenu du header */}
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between h-[80px] px-4">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="text-xl font-bold gradient-text"
            >
              DazLng
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href={`/${locale}/daznode`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("daznode")}
              </Link>
              <Link
                href={`/${locale}/daz-ia`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("dazia")}
              </Link>
              <Link
                href={`/${locale}/network`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("network")}
              </Link>
              <Link
                href={`/${locale}/channels`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("channels")}
              </Link>
              <Link
                href={`/${locale}/learn`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("learn")}
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {session ? (
                <AccountMenu />
              ) : (
                <Link
                  href={`/${locale}/auth/signin`}
                  className="btn-gradient py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
