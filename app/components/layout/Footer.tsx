"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  HelpCircle,
  Info,
  Shield,
  FileText,
} from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  const links = [
    {
      title: t("about"),
      href: "/about",
      icon: <Info className="w-5 h-5" />,
    },
    {
      title: t("help"),
      href: "/help",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      title: t("privacy"),
      href: "/privacy",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: t("terms"),
      href: "/terms",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const socialLinks = [
    {
      title: "GitHub",
      href: "https://github.com/dazlng",
      icon: <Github className="w-5 h-5" />,
    },
    {
      title: "Twitter",
      href: "https://twitter.com/dazlng",
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      title: "LinkedIn",
      href: "https://linkedin.com/company/dazlng",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      title: "Contact",
      href: "mailto:contact@dazlng.com",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  return (
    <footer className="border-t border-gray-800 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient">DazLng</span>
            </Link>
            <p className="text-gray-400">{t("description")}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Produits */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("products")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/daznode"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Daznode
                </Link>
              </li>
              <li>
                <Link
                  href="/daz-ia"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Daz IA
                </Link>
              </li>
              <li>
                <Link
                  href="/network"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Network
                </Link>
              </li>
              <li>
                <Link
                  href="/channels"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Channels
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("newsletter")}
            </h3>
            <p className="text-gray-400 mb-4">{t("newsletterDescription")}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {t("subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} DazLng. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
