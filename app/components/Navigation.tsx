"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { SimpleLogo } from "./SimpleLogo";
import { useAuth } from "@/app/hooks/useAuth";
import { UserMenu } from "./UserMenu";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-[var(--header-height)] flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center">
          <SimpleLogo className="h-8 w-auto animate-fade-in" />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href={`/${locale}/daznode`}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Daznode
          </Link>
          <Link
            href={`/${locale}/network`}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Network
          </Link>
          <Link
            href={`/${locale}/channels`}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            {t("channels")}
          </Link>
          <Link
            href={`/${locale}/daz-ia`}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Daz-IA
          </Link>
          <Link
            href={`/${locale}/learn`}
            className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            {t("learn")}
          </Link>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link href={`/${locale}/login`} className="btn-gradient">
              {t("login")}
            </Link>
          )}
        </nav>

        {/* Menu Mobile Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent text-foreground transition-colors duration-200"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[var(--header-height)] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href={`/${locale}/daznode`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-2 font-medium"
              onClick={toggleMenu}
            >
              Daznode
            </Link>
            <Link
              href={`/${locale}/network`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-2 font-medium"
              onClick={toggleMenu}
            >
              Network
            </Link>
            <Link
              href={`/${locale}/channels`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-2 font-medium"
              onClick={toggleMenu}
            >
              {t("channels")}
            </Link>
            <Link
              href={`/${locale}/daz-ia`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-2 font-medium"
              onClick={toggleMenu}
            >
              Daz-IA
            </Link>
            <Link
              href={`/${locale}/learn`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-2 font-medium"
              onClick={toggleMenu}
            >
              {t("learn")}
            </Link>
            {isAuthenticated ? (
              <div className="py-2">
                <UserMenu />
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="btn-gradient w-full text-center"
                onClick={toggleMenu}
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
