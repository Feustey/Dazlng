"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Payment");
  const params = useParams();

  const [paymentMethod, setPaymentMethod] = useState("bitcoin");

  const handleContinue = () => {
    // Ici vous pourriez enregistrer les informations de paiement
    // puis naviguer à la page de confirmation
    router.push(`/${params.locale}/checkout/confirmation`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">
        {t("title") || "Méthode de paiement"}
      </h1>

      <div className="card-glass border-accent/20 rounded-lg p-6 mb-6 animate-slide-up">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="payment-bitcoin"
              name="payment-method"
              type="radio"
              className="h-4 w-4 text-primary border-accent/20"
              checked={true}
              readOnly
            />
            <label
              htmlFor="payment-bitcoin"
              className="ml-3 block text-sm font-medium text-foreground"
            >
              Bitcoin (BTC)
            </label>
          </div>

          <div className="ml-7 p-4 bg-card/50 backdrop-blur-sm rounded-md border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">
              {t("bitcoinInstructions") ||
                "Scannez le QR code ou copiez l'adresse ci-dessous pour effectuer le paiement"}
            </p>
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-md mb-3 text-center border border-accent/20">
              {/* Placeholder for QR code */}
              <div className="w-40 h-40 bg-card mx-auto mb-2 rounded-md animate-pulse"></div>
              <code className="text-xs break-all text-muted-foreground">
                bc1q3s8qjy045yvajy0qz2q79cjncku0qf27mhj9r7
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end animate-slide-up [animation-delay:200ms]">
        <button
          type="button"
          onClick={handleContinue}
          className="btn-gradient py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          {t("continue") || "Confirmer la commande"}
        </button>
      </div>
    </div>
  );
}
