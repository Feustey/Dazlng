"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  createInvoice,
  checkInvoiceStatus,
  AlbyInvoice,
} from "@/services/albyService";

interface Invoice extends AlbyInvoice {
  expires_at?: string;
  payment_hash: string;
  payment_request: string;
  amount: number;
}

export default function PaymentPage() {
  const t = useTranslations("payment");
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.invoice as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoice = async () => {
      try {
        const invoiceData = await createInvoice(1000, "Paiement de test");
        setInvoice(invoiceData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de la facture:", error);
        addToast({
          title: t("erreurPaiement"),
          description: error instanceof Error ? error.message : String(error),
          type: "error",
        });
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, t, addToast]);

  useEffect(() => {
    if (!invoice) return;

    const checkPayment = async () => {
      try {
        const isPaid = await checkInvoiceStatus(invoice.payment_hash);
        if (isPaid) {
          setIsPaid(true);
          addToast({
            title: t("copySuccess"),
            description: t("paiementReussi"),
            type: "success",
          });
          setTimeout(() => {
            router.push(`/${params.locale}/checkout/confirmation`);
          }, 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement:", error);
      }
    };

    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [invoice, params.locale, router, t, addToast]);

  useEffect(() => {
    if (invoice) {
      // Calculer le temps restant avant expiration
      const calculateExpiry = () => {
        const expiryDate = new Date(invoice.expires_at);
        const now = new Date();
        const diff = expiryDate.getTime() - now.getTime();
        setExpiryTime(Math.max(0, Math.floor(diff / 1000 / 60)));
      };

      calculateExpiry();
      const interval = setInterval(calculateExpiry, 60000);
      return () => clearInterval(interval);
    }
  }, [invoice]);

  const copyInvoice = async () => {
    if (!invoice) return;
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(invoice.payment_request);
      addToast({
        title: t("copySuccess"),
        description: t("copied"),
        type: "success",
      });
    } catch (error) {
      addToast({
        title: t("erreurPaiement"),
        description: error instanceof Error ? error.message : String(error),
        type: "error",
      });
    } finally {
      setIsCopying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">{t("not_found")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="bg-card p-6 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{t("amount")}</p>
          <p className="text-lg font-bold text-primary">
            {invoice.amount.toLocaleString()} sats
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg mx-auto w-fit">
          <QRCodeSVG
            value={invoice.payment_request}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("invoice")}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm overflow-x-auto">
              {invoice.payment_request}
            </code>
            <button
              onClick={copyInvoice}
              disabled={isCopying}
              className="p-2 hover:bg-muted rounded"
            >
              {isCopying ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {expiryTime !== null && (
          <p className="text-sm text-muted-foreground text-center">
            {t("expiry", { minutes: expiryTime })}
          </p>
        )}

        {isPaid ? (
          <div className="flex items-center justify-center gap-2 text-primary">
            <Check className="w-5 h-5" />
            <p>{t("paid")}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>{t("waiting")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
