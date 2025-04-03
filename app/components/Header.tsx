"use client";

import React, { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import {
  MoonIcon,
  SunIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Zap as ZapIcon,
  Activity as ActivityIcon,
  Network as NetworkIcon,
  MessageCircle as MessageCircleIcon,
  Bot as BotIcon,
  Star as StarIcon,
  Settings as SettingsIconMenu,
  HelpCircle as HelpCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Logo } from "./Logo";
import NodeSearch from "./NodeSearch";
import { useSettings } from "../contexts/SettingsContext";

const menuItems = [
  { key: "dashboard", href: "/", Icon: ZapIcon },
  { key: "channels", href: "/channels", Icon: ActivityIcon },
  { key: "network", href: "/network", Icon: NetworkIcon },
  { key: "review", href: "/review", Icon: StarIcon },
  { key: "botIA", href: "/bot-ia", Icon: BotIcon },
];

const Header = () => {
  const t = useTranslations("Header");
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : "en";

  const handleLanguageChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname.replace(`/${currentLocale}`, `/${nextLocale}`));
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <Link href="/">
            <Logo />
          </Link>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex-1 max-w-xl mx-4">
              <NodeSearch placeholder={t("searchPlaceholder")} />
            </div>

            <Link
              href="/help"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t("help")}
            >
              <HelpCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>

            <Link
              href="/messages"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t("messages")}
            >
              <MessageCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t("settings")}
              >
                <Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <ChevronDownIcon
                  className={`w-4 h-4 text-gray-600 dark:text-gray-300 transform transition-transform ${
                    isSettingsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {t("theme")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {t("light")}
                        </span>
                        <button
                          onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                          }
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
                        >
                          <span
                            className={`${
                              theme === "dark"
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {t("dark")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {t("language")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            currentLocale === "fr"
                              ? "text-orange-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          FR
                        </span>
                        <button
                          onClick={() =>
                            handleLanguageChange(
                              currentLocale === "fr" ? "en" : "fr"
                            )
                          }
                          disabled={isPending}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none disabled:opacity-50"
                        >
                          <span
                            className={`${
                              currentLocale === "en"
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                        <span
                          className={`text-sm font-medium ${
                            currentLocale === "en"
                              ? "text-orange-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          EN
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {t("currency")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            currency === "btc"
                              ? "text-orange-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {t("btc")}
                        </span>
                        <button
                          onClick={() =>
                            setCurrency(currency === "btc" ? "sats" : "btc")
                          }
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
                        >
                          <span
                            className={`${
                              currency === "sats"
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                        <span
                          className={`text-sm font-medium ${
                            currency === "sats"
                              ? "text-orange-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {t("sats")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="flex justify-center items-center border-t pt-2">
          {menuItems.map(({ key, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2 text-sm font-medium text-orange-500 hover:text-blue-500 rounded-md transition-colors mx-1"
            >
              <Icon className="mr-2 h-5 w-5" />
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
