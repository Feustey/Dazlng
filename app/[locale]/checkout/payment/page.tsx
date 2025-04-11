"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProgressBar from "@components/checkout/ProgressBar";
import Button from "@/app/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createInvoice,
  checkInvoiceStatus,
} from "../../../services/albyService";

interface Invoice {
  payment_request: string;
  checking_id: string;
  payment_hash: string;
  expires_at: string;
}

export default function PaymentPage() {
  const t = useTranslations("Checkout.Payment");
  const params = useParams();
  const locale = params?.locale as string;
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    // Générer la facture
    const generateInvoice = async () => {
      try {
        const res = await fetch("/api/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 400000, // 400,000 sats
            memo: "Commande DazNode",
          }),
        });

        if (!res.ok)
          throw new Error("Erreur lors de la génération de la facture");

        const data = await res.json();
        setInvoice(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la génération de la facture");
        setIsLoading(false);
      }
    };

    generateInvoice();
  }, []);

  useEffect(() => {
    if (!invoice) return;

    const checkPayment = async () => {
      try {
        const res = await fetch(
          `/api/check-payment?payment_hash=${invoice.payment_hash}`
        );
        const data = await res.json();

        if (data.paid) {
          setIsPaid(true);
          // Rediriger vers la page de confirmation après un court délai
          setTimeout(() => {
            router.push(`/${locale}/checkout/confirmation`);
          }, 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement:", error);
      }
    };

    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [invoice, locale, router]);

  const copyToClipboard = async () => {
    if (!invoice) return;
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(invoice.payment_request);
      toast.success("Adresse copiée !");
    } catch (error) {
      toast.error("Erreur lors de la copie");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <ProgressBar />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("bitcoinInstructions")}</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : invoice ? (
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
