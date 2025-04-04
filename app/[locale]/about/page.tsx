"use client";

import React from "react";
import { Card } from "@/app/components/ui/card";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center"
      >
        {t("title")}
      </motion.h1>
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {t.raw("sections").map((section: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {section.content}
                </p>
              )}
              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 border border-blue-700 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-blue-200 mb-6">{t("cta.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              {t("cta.oneShot")}
            </h3>
            <ul className="space-y-3 mb-6">
              {t.raw("cta.features").map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-200">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold px-4 py-1 rounded-bl-lg">
              {t("cta.bestValue")}
            </div>
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              {t("cta.yearly")}
            </h3>
            <ul className="space-y-3 mb-6">
              {t.raw("cta.features").map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-200">{feature}</span>
                </li>
              ))}
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-200">
                  {t("cta.unlimitedAccess")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/daz-ia"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
          >
            {t("cta.button")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
