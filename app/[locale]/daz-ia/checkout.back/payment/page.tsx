"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../../../../components/ui/card";
import DazIAProgressBar from "../../../../components/daz-ia/ProgressBar";
import LightningPayment from "@/app/components/LightningPayment";
import { toast } from "sonner";

export default function PaymentPage() {
  const router = useRouter();
  const t = useTranslations("daz-ia-checkout");
  const [planData, setPlanData] = useState<{
    plan: string;
    billingCycle: string;
    sats: number;
  } | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  useEffect(() => {
    // Récupération des données du plan et de livraison depuis localStorage
    const storedPlan = localStorage.getItem("dazIAPlan");
    const storedDeliveryInfo = localStorage.getItem("dazIADeliveryInfo");

    if (storedPlan) {
      setPlanData(JSON.parse(storedPlan));
    } else {
      // Rediriger vers la page de sélection de plan si aucun plan n'est sélectionné
      router.push("/daz-ia/checkout/plan");
      return;
    }

    if (storedDeliveryInfo) {
      setDeliveryInfo(JSON.parse(storedDeliveryInfo));
    } else {
      // Rediriger vers la page de livraison si aucune info n'est saisie
      router.push("/daz-ia/checkout/delivery");
    }
  }, [router]);

  const handlePaymentSuccess = async () => {
    try {
      // Créer une session de paiement
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planData?.plan,
          billingCycle: planData?.billingCycle,
          amount: planData?.sats,
          deliveryInfo,
          paymentMethod: "lightning",
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la session de paiement");
      }

      const data = await response.json();
      localStorage.setItem("checkoutSessionId", data.sessionId);
      router.push("/daz-ia/checkout/confirmation");
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      toast.error("Erreur lors de la création de la session de paiement");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <DazIAProgressBar currentStep={3} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">{t("payment.title")}</h1>

          <LightningPayment
            defaultAmount={planData?.sats}
            defaultMemo={`Daz-IA ${planData?.plan === "oneshot" ? "One-Shot" : "Abonnement"}`}
            isSubscription={planData?.plan !== "oneshot"}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
              toast.error(error.message);
            }}
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">{t("summary.title")}</h2>

          {planData && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{t("summary.plan")}:</span>
                <span className="font-medium">
                  {planData.plan === "oneshot" ? "One-Shot" : "Abonnement"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t("summary.type")}:</span>
                <span className="font-medium">
                  {planData.billingCycle === "once"
                    ? t("billing.once")
                    : t("billing.yearly")}
                </span>
              </div>

              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">{t("summary.total")}:</span>
                <span className="font-bold">
                  {planData.sats.toLocaleString()} sats
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
