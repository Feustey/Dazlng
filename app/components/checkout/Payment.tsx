import React, { useState } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface PaymentFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function PaymentForm({ onBack, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useAdvancedTranslation();

  const handlePay = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simuler un paiement réussi
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("checkout.paiement_securise")}</h2>
        <p className="text-gray-600">Montant total : 400 000 sats</p>
      </div>
      
      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Paiement en cours..." : "Payer 400 000 sats"}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300"
        >
          Retour
        </button>
      </div>
      
      {error && <div className="text-red-500 text-center">{error}</div>}
    </form>
  );
}

export const dynamic = "force-dynamic";
