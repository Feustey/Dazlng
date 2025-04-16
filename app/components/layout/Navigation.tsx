"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { SimpleLogo } from "./SimpleLogo";
import { useSession } from "next-auth/react";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: session } = useSession();
  const pathname = usePathname() || "";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openLoginModal = () => {
    setLoginModalOpen(true);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname.startsWith(`/${locale}${path}`);

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 flex items-center"
            >
              <SimpleLogo className="h-8 w-auto" />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href={`/${locale}/dashboard`}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/dashboard")
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground"
                }`}
              >
                {t("Header.dashboard")}
              </Link>
              <Link
                href={`/${locale}/network`}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/network")
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground"
                }`}
              >
                {t("Header.network")}
              </Link>
              <Link
                href={`/${locale}/channels`}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/channels")
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground"
                }`}
              >
                {t("Header.channels")}
              </Link>
              <Link
                href={`/${locale}/learn`}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/learn")
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground"
                }`}
              >
                {t("Header.learn")}
              </Link>
              <Link
                href={`/${locale}/daznode`}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/daznode")
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground"
                }`}
              >
                {t("Header.daznode")}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSelector />
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {session ? (
                <AccountMenu />
              ) : (
                <Button
                  onClick={openLoginModal}
                  variant="gradient"
                  className="ml-4"
                >
                  {t("Header.login")}
                </Button>
              )}
            </div>
            <div className="sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">{t("Header.openMenu")}</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`sm:hidden ${
          isMenuOpen ? "block" : "hidden"
        } transition-all duration-200 ease-in-out`}
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href={`/${locale}/dashboard`}
            className={`block px-3 py-2 text-base font-medium ${
              isActive("/dashboard")
                ? "text-primary bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`}
            onClick={toggleMenu}
          >
            {t("Header.dashboard")}
          </Link>
          <Link
            href={`/${locale}/network`}
            className={`block px-3 py-2 text-base font-medium ${
              isActive("/network")
                ? "text-primary bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`}
            onClick={toggleMenu}
          >
            {t("Header.network")}
          </Link>
          <Link
            href={`/${locale}/channels`}
            className={`block px-3 py-2 text-base font-medium ${
              isActive("/channels")
                ? "text-primary bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`}
            onClick={toggleMenu}
          >
            {t("Header.channels")}
          </Link>
          <Link
            href={`/${locale}/learn`}
            className={`block px-3 py-2 text-base font-medium ${
              isActive("/learn")
                ? "text-primary bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`}
            onClick={toggleMenu}
          >
            {t("Header.learn")}
          </Link>
          <Link
            href={`/${locale}/daznode`}
            className={`block px-3 py-2 text-base font-medium ${
              isActive("/daznode")
                ? "text-primary bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`}
            onClick={toggleMenu}
          >
            {t("Header.daznode")}
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-accent/10">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <LanguageSelector />
            </div>
            <div className="ml-3">
              {session ? (
                <AccountMenu />
              ) : (
                <Button
                  onClick={openLoginModal}
                  variant="gradient"
                  className="w-full"
                >
                  {t("Header.login")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
