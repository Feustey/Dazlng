"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AlbyQRCode from "@/app/components/AlbyQRCode";
import { useRouter } from "next/navigation";

export default function BotIAPage() {
  const t = useTranslations("bot-ia");
  const router = useRouter();
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
          router.push("/dashboard");
        }, 1000);
      }, 2000);
    }
  };

  const getPlanAmount = (plan: "one-shot" | "yearly") => {
    return plan === "one-shot" ? 10000 : 100000;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-gray-300">{t("description")}</p>
        </div>

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
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {t("yearly.cta")}
            </button>
          </motion.div>
        </div>

        {/* Modal de paiement */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">{t("payment.title")}</h3>
              {process.env.NODE_ENV === "development" ? (
                <div className="text-center mb-6">
                  <p className="text-yellow-500 mb-2">Mode développement</p>
                  <p className="text-gray-300">
                    Le paiement sera simulé automatiquement
                  </p>
                </div>
              ) : (
                <p className="text-gray-300 mb-6">{t("payment.scan")}</p>
              )}
              <div className="bg-white p-4 rounded-lg mb-6">
                <AlbyQRCode
                  amount={getPlanAmount(selectedPlan)}
                  plan={
                    selectedPlan === "one-shot"
                      ? t("one-shot.title")
                      : t("yearly.title")
                  }
                />
              </div>
              {isProcessing && (
                <div className="text-center">
                  {paymentStatus === "pending" && (
                    <div className="text-gray-300">
                      {process.env.NODE_ENV === "development"
                        ? "Simulation du paiement en cours..."
                        : t("payment.processing")}
                    </div>
                  )}
                  {paymentStatus === "success" && (
                    <div className="text-green-500">
                      Paiement réussi ! Redirection...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
