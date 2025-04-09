"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import AlbyQRCode from "../../components/AlbyQRCode";
import { useRouter, usePathname } from "next/navigation";
import { Tabs } from "../../components/Tabs";
import RecommendationsContent from "../../components/RecommendationsContent";

const mockRecommendations = [
  {
    id: "1",
    title: "Premium Plan",
    description: "Accès illimité à toutes les fonctionnalités",
    price: 1000,
    image: "/images/premium.jpg",
  },
  {
    id: "2",
    title: "Basic Plan",
    description: "Fonctionnalités de base pour débuter",
    price: 500,
    image: "/images/basic.jpg",
  },
];

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
            className="card-glass rounded-2xl p-8 border-accent/20 animate-slide-up"
          >
            <h2 className="text-2xl font-bold mb-4 text-gradient">
              {t("one-shot.title")}
            </h2>
            <div className="text-3xl font-bold mb-6 gradient-text">
              {t("one-shot.price")}
            </div>
            <ul className="space-y-4 mb-8">
              {t
                .raw("one-shot.features")
                .map((feature: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center text-muted-foreground"
                  >
                    <svg
                      className="w-5 h-5 text-primary mr-2"
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
              className="w-full btn-gradient font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {t("one-shot.cta")}
            </button>
          </motion.div>

          {/* Plan Annuel */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-glass rounded-2xl p-8 border-primary/20 relative overflow-hidden animate-slide-up [animation-delay:200ms]"
          >
            <div className="absolute top-0 right-0 bg-primary text-background font-bold px-4 py-1 rounded-bl-lg">
              {t("yearly.highlight")}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gradient">
              {t("yearly.title")}
            </h2>
            <div className="text-3xl font-bold mb-6 gradient-text">
              {t("yearly.price")}
            </div>
            <ul className="space-y-4 mb-8">
              {t
                .raw("yearly.features")
                .map((feature: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center text-muted-foreground"
                  >
                    <svg
                      className="w-5 h-5 text-primary mr-2"
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
              className="w-full btn-gradient font-bold py-3 px-6 rounded-lg transition duration-200"
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
      content: <RecommendationsContent recommendations={mockRecommendations} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground">{t("description")}</p>
        </div>

        <Tabs tabs={tabs} defaultTab="plans" />

        {isProcessing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="card-glass p-8 rounded-lg text-center animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground">
                {paymentStatus === "pending"
                  ? t("processing")
                  : paymentStatus === "success"
                    ? t("success")
                    : t("error")}
              </p>
              {paymentStatus === "success" && (
                <div className="mt-4 animate-slide-up">
                  <AlbyQRCode
                    value="lnbc100u1p3xn9vxpp5xv3j8n4k2p3xn9vxpp5xv3j8n4k2p3xn9vxpp5xv3j8n4k2"
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
