"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCheckoutData } from "../../../hooks/useCheckoutData";
import ProgressBar from "@/components/checkout/ProgressBar";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Invoice {
  payment_request: string;
  payment_hash: string;
  expires_at: number;
}

export default function PaymentPage() {
  const t = useTranslations("pages.checkout.payment");
  const router = useRouter();
  const { checkoutData } = useCheckoutData();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const generateInvoice = useCallback(async () => {
    try {
      const response = await fetch("/api/payment/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: checkoutData.payment?.total,
          description: "Paiement Daz'IA",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }

      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error(t("error.generateInvoice"));
    }
  }, [checkoutData.payment?.total, t]);

  useEffect(() => {
    if (!checkoutData.payment) {
      router.push("/checkout/delivery");
      return;
    }

    // Générer une facture Lightning
    generateInvoice();
  }, [checkoutData.payment, generateInvoice, router]);

  const checkPaymentStatus = async (paymentHash: string) => {
    try {
      const response = await fetch(`/api/payment/status/${paymentHash}`);
      const data = await response.json();

      if (data.paid) {
        setIsPaid(true);
        toast.success("Paiement reçu !");
        setTimeout(() => {
          router.push("/checkout/confirmation");
        }, 2000);
      } else if (!data.expired) {
        // Vérifier à nouveau dans 2 secondes
        setTimeout(() => checkPaymentStatus(paymentHash), 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error);
    }
  };

  const copyToClipboard = async () => {
    if (!invoice) return;

    try {
      await navigator.clipboard.writeText(invoice.payment_request);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
      toast.success("Facture copiée !");
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      toast.error("Erreur lors de la copie de la facture");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <ProgressBar />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {invoice ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${invoice.payment_request}`}
                alt="QR Code de paiement"
                width={192}
                height={192}
                className="w-48 h-48"
              />
            </div>

            <div className="flex items-center space-x-2">
              <code className="bg-muted px-4 py-2 rounded-md text-sm">
                {invoice.payment_request}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={isCopying}
              >
                {isCopying ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isPaid && (
              <div className="flex items-center space-x-2 text-green-500">
                <Check className="h-5 w-5" />
                <span>Paiement reçu ! Redirection en cours...</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            Erreur lors de la génération de la facture
          </div>
        )}
      </div>
    </div>
  );
}
