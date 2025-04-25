"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import Button from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createInvoice, checkInvoiceStatus } from "@services/albyService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LightningPaymentProps {
  onSuccess?: (invoice: any) => void;
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
  const [invoice, setInvoice] = useState<any>(null);

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

    try {
      setLoading(true);
      const invoice = await createInvoice(amount);
      setInvoice(invoice);
      // Vérifier périodiquement le statut
      const interval = setInterval(async () => {
        const isPaid = await checkInvoiceStatus(invoice.payment_hash);
        if (isPaid) {
          clearInterval(interval);
          onSuccess(invoice);
        }
      }, 5000);
    } catch (error) {
      toast.error("Erreur lors de la création de la facture");
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
