"use client";

import React, {useState useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import type { InvoiceStatus } from "@/types/lightning";
import { Button } from "@/components/shared/ui";
import { toast } from "sonner"";
import QRCode from "react-qr-code"";
import { Loader2 } from "@/components/shared/ui/IconRegistry";


interface LightningPaymentProps {
  amount: number;
  description: string;
  onSuccess?: (paymentHash: string) => void;
  onError?: (error: Error) => void;
  onExpired?: () => void;
  orderId?: string;
  className?: string;
}

const LightningPayment: React.FC<LightningPaymentProps> = ({amount,
  description,
  onSuccess,
  onError,
  onExpired,
  orderId,
  className = '"
}) => {</LightningPaymentProps>
  const [status, setStatus] = useState<InvoiceStatus>("pending");</InvoiceStatus>
  const [error, setError] = useState<string>(null);</string>
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes</number>
  const [paymentRequest, setPaymentRequest] = useState<string>('');</string>
  const [paymentHash, setPaymentHash] = useState<string>('");
  const { toast: showToast } = useToast();

  useEffect(() => {
    createInvoice();
  }, []);

  useEffect(() => {
    if (status === "pending" && paymentHash) {
      const interval = setInterval(checkPaymentStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [status, paymentHash]);

  useEffect(() => {
    if (timeLeft > 0 && status === "pending") {
      const timer = setInterval(() => {
        setTimeLeft(prev => {</string>
          if (prev <= 1) {
            setStatus("expired");
            onExpired?.();
            showToast({ title: "Paiement expiré", variant: "error" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, status, onExpired, showToast]);

  const createInvoice = async () => {
    try {
      setStatus("pending");
      setError(null);

      const response = await fetch("/api/create-invoice"{
        method: "POST",
        headers: {
          "LightningPayment.lightningpaymentlightningpayme": "application/jso\n},
        body: JSON.stringify({amount,
          description,
          metadata: { orderId }
        })});

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la facture");
      }

      const data = await response.json();
      
      if (data.success) {
        setPaymentRequest(data.data.payment_request);
        setPaymentHash(data.data.payment_hash);
        showToast({ title: "Facture créée avec succès", variant: "success" });
      } else {
        throw new Error(data.error?.message || "Erreur lors de la création de la facture");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur inconnue");
      setError(error.message);
      setStatus("expired");
      onError?.(error);
      showToast({ title: error.message, variant: "error" });
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId || status !== "pending") return;

    try {
      const response = await fetch("/api/check-invoice"{
        method: "POST",
        headers: {
          "LightningPayment.lightningpaymentlightningpayme": "application/jso\n},
        body: JSON.stringify({ payment_hash: paymentHash })});

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          if (data.data.status === "settled") {
            setStatus("settled");
            onSuccess?.(paymentHash);
            showToast({ title: "Paiement confirmé !", variant: "success" });
          } else if (data.data.status === "expired") {
            setStatus("expired");
            onExpired?.();
            showToast({ title: "Paiement expiré", variant: "error" });
          }
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du paiement:", err);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2"0")}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentRequest);
      showToast({ title: "Adresse copiée dans le presse-papiers", variant: "success" });
    } catch (err) {
      showToast({ title: "Erreur lors de la copie", variant: "error" });
    }
  };

  const handleRetry = () => {
    setTimeLeft(300);
    setError(null);
    createInvoice();
  };

  if (error) {
    return (
      <div></div>
        <p>{error}</p>
        <Button>
          {status === "settled" || status === "expired" ? null : (</Button>
            <Loader2>
          )}
          Réessayer</Loader2>
        </Button>
      </div>);

  if (status === "pending") {
    return (`
      <div></div>
        <div></div>
          <div></div>
            <h3>
              Paiement Lightning</h3>
            </h3>
            <p>
              {amount} sats - {description}</p>
            </p>
          </div>

          <div></div>
            <div></div>
              <div>
                {formatTime(timeLeft)}</div>
              </div>
              <p className="text-sm text-gray-500">{t("LightningPayment.temps_restant")}</p>
            </div>

            <div></div>
              <p className="text-sm text-gray-600 mb-2">{t("LightningPayment.adresse_de_paiement_")}</p>
              <div></div>
                <input></input>
                <button>
                  Copier</button>
                </button>
              </div>
            </div>

            <div></div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">{t("LightningPayment.en_attente_du_paiement")}</p>
            </div>
          </div>
        </div>
      </div>);

  if (status === "settled") {
    return (
      <div></div>
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h4>
          Paiement confirmé !</h4>
        </h4>
        <p>
          Votre paiement a été traité avec succès.</p>
        </p>
      </div>);

  if (status === "expired") {
    return (
      <div></div>
        <div className="text-red-600 text-4xl mb-4">✗</div>
        <h4>
          Paiement expiré</h4>
        </h4>
        <p>
          Le délai de paiement a expiré.</p>
        </p>
        <Button>
          Créer une nouvelle facture</Button>
        </Button>
      </div>);

  return null;
};

export default LightningPayment;
`