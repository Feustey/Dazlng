"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function PaymentPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Payment");

  const [paymentMethod, setPaymentMethod] = useState("bitcoin");

  const handleContinue = () => {
    // Ici vous pourriez enregistrer les informations de paiement
    // puis naviguer à la page de confirmation
    router.push("/checkout/confirmation");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <h1 className="text-2xl font-bold mb-6">
        {t("title") || "Méthode de paiement"}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="payment-bitcoin"
              name="payment-method"
              type="radio"
              className="h-4 w-4 text-indigo-600 border-gray-300"
              checked={true}
              readOnly
            />
            <label
              htmlFor="payment-bitcoin"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Bitcoin (BTC)
            </label>
          </div>

          <div className="ml-7 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 mb-2">
              {t("bitcoinInstructions") ||
                "Scannez le QR code ou copiez l'adresse ci-dessous pour effectuer le paiement"}
            </p>
            <div className="bg-white p-4 rounded-md mb-3 text-center">
              {/* Placeholder for QR code */}
              <div className="w-40 h-40 bg-gray-200 mx-auto mb-2"></div>
              <code className="text-xs break-all">
                bc1q3s8qjy045yvajy0qz2q79cjncku0qf27mhj9r7
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t("continue") || "Confirmer la commande"}
        </button>
      </div>
    </div>
  );
}
