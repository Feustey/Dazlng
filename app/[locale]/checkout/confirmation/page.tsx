"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ConfirmationPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Confirmation");

  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  const handleContinueShopping = () => {
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("thankYou") || "Merci pour votre commande !"}
        </h1>
        <p className="text-gray-600">
          {t("orderConfirmed") ||
            "Votre commande a été confirmée et sera bientôt traitée."}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">
          {t("orderDetails") || "Détails de la commande"}
        </h2>

        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              {t("orderNumber") || "Numéro de commande"}
            </span>
            <span className="text-sm font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">{t("date") || "Date"}</span>
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              {t("status") || "Statut"}
            </span>
            <span className="text-sm font-medium text-green-600">
              {t("processing") || "En traitement"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">
            {t("items") || "Articles commandés"}
          </h3>

          <div className="border-b border-gray-200 pb-3 mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm">DazNode Lightning</span>
              <span className="text-sm font-medium">599 €</span>
            </div>
            <p className="text-xs text-gray-500">
              Nœud Lightning Network complet
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <span>{t("total") || "Total"}</span>
            <span className="font-medium">599 €</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">
            {t("shippingAddress") || "Adresse de livraison"}
          </h3>
          <address className="text-sm not-italic text-gray-600">
            John Doe
            <br />
            123 Rue Principale
            <br />
            75001 Paris
            <br />
            France
          </address>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            {t("paymentMethod") || "Méthode de paiement"}
          </h3>
          <p className="text-sm text-gray-600">Bitcoin (BTC)</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          {t("emailSent") ||
            "Un email de confirmation a été envoyé à votre adresse email."}
        </p>

        <button
          type="button"
          onClick={handleContinueShopping}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t("continueShopping") || "Continuer les achats"}
        </button>
      </div>
    </div>
  );
}
