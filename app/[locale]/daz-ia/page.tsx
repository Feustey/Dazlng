"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import AlbyQRCode from "../../components/AlbyQRCode";
import { useRouter, usePathname } from "next/navigation";
import { Tabs } from "../../components/Tabs";
import { RecommendationsContent } from "../../components/RecommendationsContent";

export default function DazIAPage() {
  const t = useTranslations("daz-ia");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [selectedPlan, setSelectedPlan] = useState<
    "one-shot" | "yearly" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  const handlePlanSelection = (plan: "one-shot" | "yearly") => {
    setSelectedPlan(plan);
    setIsProcessing(true);
    setPaymentStatus("pending");

    // En développement, on simule un paiement réussi après 2 secondes
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        setPaymentStatus("success");
        // Redirection vers la page de succès après 1 seconde
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 1000);
      }, 2000);
    }
  };

  const getPlanAmount = (plan: "one-shot" | "yearly") => {
    return plan === "one-shot" ? 10000 : 100000;
  };

  const tabs = [
    {
      id: "plans",
      label: t("tabs.plans"),
      content: (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plan One-Shot */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-4">{t("one-shot.title")}</h2>
            <div className="text-3xl font-bold mb-6">{t("one-shot.price")}</div>
            <ul className="space-y-4 mb-8">
              {t
                .raw("one-shot.features")
                .map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
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
                    {feature}
                  </li>
                ))}
            </ul>
            <button
              onClick={() => handlePlanSelection("one-shot")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {t("one-shot.cta")}
            </button>
          </motion.div>

          {/* Plan Annuel */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-blue-900 rounded-2xl p-8 border border-blue-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold px-4 py-1 rounded-bl-lg">
              {t("yearly.highlight")}
            </div>
            <h2 className="text-2xl font-bold mb-4">{t("yearly.title")}</h2>
            <div className="text-3xl font-bold mb-6">{t("yearly.price")}</div>
            <ul className="space-y-4 mb-8">
              {t
                .raw("yearly.features")
                .map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
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
                    {feature}
                  </li>
                ))}
            </ul>
            <button
              onClick={() => handlePlanSelection("yearly")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {t("yearly.cta")}
            </button>
          </motion.div>
        </div>
      ),
    },
    {
      id: "recommendations",
      label: t("tabs.recommendations"),
      content: <RecommendationsContent />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-gray-300">{t("description")}</p>
        </div>

        <Tabs tabs={tabs} defaultTab="plans" />

        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">
                {paymentStatus === "pending"
                  ? t("processing")
                  : paymentStatus === "success"
                    ? t("success")
                    : t("error")}
              </p>
              {paymentStatus === "success" && (
                <div className="mt-4">
                  <AlbyQRCode
                    amount={getPlanAmount(selectedPlan!)}
                    memo={`Daz-IA ${selectedPlan === "yearly" ? "Yearly" : "One-Shot"}`}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
