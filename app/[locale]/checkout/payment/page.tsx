"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAlbyService } from "@/services/albyService";

export default function PaymentPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Payment");
  const params = useParams();
  const locale = params?.locale as string;

  const [paymentMethod, setPaymentMethod] = useState("bitcoin");
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("waiting"); // waiting, received, error
  const [invoice, setInvoice] = useState<string | null>(null);
  const [amount] = useState("400000"); // en sats

  useEffect(() => {
    const createInvoice = async () => {
      try {
        const albyService = await getAlbyService();
        const newInvoice = await albyService.createInvoice({
          amount: parseInt(amount),
          memo: "Paiement DazLng",
        });
        setInvoice(newInvoice.payment_request);
      } catch (error) {
        console.error("Erreur lors de la création de la facture:", error);
        setPaymentStatus("error");
        toast.error(t("invoiceError"));
      }
    };

    createInvoice();
  }, [amount, t]);

  const handleCopyAddress = async () => {
    if (!invoice) return;

    try {
      await navigator.clipboard.writeText(invoice);
      setCopied(true);
      toast.success(t("addressCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error(t("copyError"));
    }
  };

  const handleContinue = () => {
    if (paymentStatus === "received") {
      router.push(`/${locale}/checkout/confirmation`);
    }
  };

  // Vérification du paiement via webhook
  useEffect(() => {
    const checkPaymentStatus = async (invoice: string) => {
      try {
        const albyService = await getAlbyService();
        const status = await albyService.checkInvoiceStatus(invoice);
        if (status === "paid") {
          setPaymentStatus("received");
          toast.success(t("paymentReceived"));
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      }
    };

    if (invoice) {
      checkPaymentStatus(invoice);
    }
  }, [invoice, t]);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">{t("title")}</h1>

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
              Bitcoin Lightning
            </label>
          </div>

          <div className="ml-7 p-4 bg-card/50 backdrop-blur-sm rounded-md border border-accent/20">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-foreground">
                {t("amount")}
              </p>
              <p className="text-lg font-bold text-primary">{amount} sats</p>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {t("bitcoinInstructions")}
            </p>

            <div className="bg-white p-4 rounded-lg mb-4 mx-auto w-fit">
              <QRCodeSVG
                value={invoice}
                size={200}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-card/30 rounded-md">
              <code className="text-xs sm:text-sm break-all text-muted-foreground flex-1 mr-2">
                {invoice}
              </code>
              <button
                onClick={handleCopyAddress}
                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent/10 transition-colors"
                title={t("copyAddress")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center text-sm">
              {paymentStatus === "waiting" && (
                <div className="flex items-center text-amber-500">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("waitingPayment")}
                </div>
              )}
              {paymentStatus === "received" && (
                <div className="flex items-center text-green-500">
                  <Check className="h-4 w-4 mr-2" />
                  {t("paymentReceived")}
                </div>
              )}
              {paymentStatus === "error" && (
                <div className="flex items-center text-red-500">
                  <span className="mr-2">⚠️</span>
                  {t("paymentError")}
                  <button
                    onClick={() => {
                      setPaymentStatus("waiting");
                      window.location.reload();
                    }}
                    className="ml-2 underline"
                  >
                    {t("retry")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end animate-slide-up [animation-delay:200ms]">
        <button
          type="button"
          onClick={handleContinue}
          disabled={paymentStatus !== "received"}
          className={`btn-gradient py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 
            ${paymentStatus === "received" ? "hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
