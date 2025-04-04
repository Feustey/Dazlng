"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Zap as ZapIcon,
  Activity as ActivityIcon,
  Network as NetworkIcon,
  Star as StarIcon,
  Bot as BotIcon,
  HelpCircle as HelpIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { SettingsMenu } from "./SettingsMenu";
import { useAuth } from "@/app/contexts/AuthContext";

const menuItems = [
  { key: "channels", href: "/channels", Icon: ActivityIcon },
  { key: "network", href: "/network", Icon: NetworkIcon },
  { key: "review", href: "/review", Icon: StarIcon },
  { key: "dazIA", href: "/daz-ia", Icon: BotIcon },
];

const Header = () => {
  const t = useTranslations("Header");
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : "en";

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-2">
          <div className="flex-shrink-0">
            <Link href={`/${currentLocale}`}>
              <Logo className="h-8" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {menuItems.map(({ key, href, Icon }) => (
                <Link
                  key={href}
                  href={`/${currentLocale}${href}`}
                  className="flex items-center px-3 py-2 text-sm font-medium text-orange-500 hover:text-blue-500 rounded-md transition-colors"
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {t(key)}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/${currentLocale}/help`}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t("help")}
              >
                <HelpIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <SettingsMenu />
            </div>
            {!isAuthenticated && (
              <div>
                <Link
                  href={`/${currentLocale}/login`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-black bg-white hover:bg-gray-100 transition-colors"
                >
                  {t("login")}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
