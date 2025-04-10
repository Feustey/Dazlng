"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { getAlbyService } from "@/services/albyService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LightningPaymentProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  defaultAmount?: number;
  defaultMemo?: string;
  isSubscription?: boolean;
}

export default function LightningPayment({
  onSuccess,
  onError,
  defaultAmount = 0,
  defaultMemo = "",
  isSubscription = false,
}: LightningPaymentProps) {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [memo, setMemo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setAmount(defaultAmount);
    setMemo(defaultMemo);
  }, [defaultAmount, defaultMemo]);

  const handlePayment = async () => {
    if (!amount || !memo) {
      toast.error("Montant ou description invalide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const albyService = await getAlbyService();
      const invoice = await albyService.createInvoice({
        amount,
        memo,
      });

      const paymentPromise = albyService.sendPayment({
        invoice: invoice.payment_request,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Délai d'attente dépassé (5 minutes)")),
          300000
        );
      });

      await Promise.race([paymentPromise, timeoutPromise]);

      toast.success("Paiement effectué avec succès");
      onSuccess?.();
    } catch (err) {
      console.error("Erreur lors du paiement:", err);
      setError("Erreur lors de la création de la facture");
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (amount === null || memo === null) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="amount">Montant (sats)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          placeholder="Entrez le montant en satoshis"
        />
      </div>
      <div>
        <Label htmlFor="memo">Description</Label>
        <Input
          id="memo"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Description du paiement"
        />
      </div>
      <Button onClick={handlePayment} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          "Payer"
        )}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
