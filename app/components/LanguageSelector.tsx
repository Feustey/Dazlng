"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { locales, localeNames, localeFlags } from "../i18n.config.base";

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (langCode: string) => {
    router.push(pathname.replace(`/${locale}`, `/${langCode}`));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/10 transition-colors"
      >
        <span
          className="text-xl"
          role="img"
          aria-label={`${localeNames[locale as keyof typeof localeNames]} flag`}
        >
          {localeFlags[locale as keyof typeof localeFlags]}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-popover shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1">
              {locales.map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => switchLanguage(langCode)}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-sm ${
                    locale === langCode
                      ? "bg-accent/10 text-accent-foreground"
                      : "text-foreground hover:bg-accent/5"
                  }`}
                >
                  <span
                    className="text-xl"
                    role="img"
                    aria-label={`${localeNames[langCode]} flag`}
                  >
                    {localeFlags[langCode]}
                  </span>
                  <span>{localeNames[langCode]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
