"use client";

import React, { useState } from "react";
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
import { Logo } from "./Logo";
import NodeSearch from "./NodeSearch";
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";

const menuItems = [
  { href: "/", label: "Dashboard", Icon: ZapIcon },
  { href: "/channels", label: "Channels", Icon: ActivityIcon },
  { href: "/network", label: "Network", Icon: NetworkIcon },
  { href: "/review", label: "Review", Icon: StarIcon },
  { href: "/bot-ia", label: "Bot IA", Icon: BotIcon },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency } = useSettings();
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <Link href="/">
            <Logo />
          </Link>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex-1 max-w-xl mx-4">
              <NodeSearch />
            </div>

            <Link
              href="/help"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Help"
            >
              <HelpCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>

            <Link
              href="/messages"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Messages"
            >
              <MessageCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                        {t("settings.darkMode")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <SunIcon className="w-5 h-5 text-yellow-500" />
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
                        <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {t("settings.language")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          FR
                        </span>
                        <button
                          onClick={() =>
                            setLanguage(language === "fr" ? "en" : "fr")
                          }
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
                        >
                          <span
                            className={`${
                              language === "en"
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          EN
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {t("settings.currency")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          BTC
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          SATS
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
          {menuItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2 text-sm font-medium text-orange-500 hover:text-blue-500 rounded-md transition-colors mx-1"
            >
              <Icon className="mr-2 h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
