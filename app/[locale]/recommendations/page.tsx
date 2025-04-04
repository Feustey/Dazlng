"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/app/components/ui/card";

export default function RecommendationsPage() {
  const t = useTranslations("recommendations");
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-blue-400 mb-6">{t("subtitle")}</p>
        <p className="text-gray-300 max-w-3xl mx-auto">{t("intro")}</p>
      </motion.div>

      <div className="grid gap-8 mb-16">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                {t(`recommendations.${index}.title`)}
              </h2>
              <p className="text-xl text-white mb-4">
                {t(`recommendations.${index}.description`)}
              </p>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
                <p className="text-gray-300 mb-2">
                  {t(`recommendations.${index}.details`)}
                </p>
                <p className="text-green-400 font-semibold">
                  {t(`recommendations.${index}.impact`)}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section Upgrade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 border border-blue-700 mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {t("upgrade.title")}
          </h2>
          <p className="text-xl text-blue-200 mb-6">
            {t("upgrade.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
            <ul className="space-y-3">
              {t
                .raw("upgrade.features")
                .map((feature: string, index: number) => (
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

          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl font-bold text-yellow-400 mb-4">
              {t("upgrade.price")}
            </div>
            <Link
              href="/bot-ia"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
            >
              {t("upgrade.cta")}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Section Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {t("feedback.title")}
          </h2>
          <p className="text-gray-300 mb-6">{t("feedback.description")}</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200">
            {t("feedback.button")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
