import React, { useState } from "react";

export interface PaymentFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function PaymentForm({ onBack, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <form onSubmit={handlePay} className="space-y-4">
      <div className="font-bold">{t('checkout.paiement_scuris')}</div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Paiement en cours..." : "Payer 400 000 sats"}
      </button>
      <button type="button" className="btn-secondary w-full" onClick={onBack} disabled={loading}>
        Retour
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}
export const dynamic = "force-dynamic";
