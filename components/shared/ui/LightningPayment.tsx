"use client";

import React, { useState, useEffect, useCallback } from 'react';
// import { usePaymentService } from '@/lib/hooks/usePaymentService';
import { InvoiceStatus } from '@/types/lightning';
import { Button } from '@/components/shared/ui';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { Loader2 } from 'lucide-react';

export interface LightningPaymentProps {
  amount: number;
  description: string;
  metadata?: Record<string, unknown>;
  onPaid: () => void;
  onExpired: () => void;
  onError: (error: Error) => void;
}

export const LightningPayment: React.FC<LightningPaymentProps> = ({
  amount,
  description,
  metadata,
  onPaid,
  onExpired,
  onError
}) => {
  const [invoice, setInvoice] = useState<any | null>(null);
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoice = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, description, metadata })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Erreur lors de la création de la facture');
      }
      setInvoice(data.data.invoice);
      setOrderId(data.data.order?.id || null);
      setStatus('pending');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la génération de la facture';
      setError(errorMessage);
      onError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsGenerating(false);
    }
  }, [amount, description, metadata, onError]);

  useEffect(() => {
    if (!orderId || status !== 'pending') return;

    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/check-payment?order=${orderId}`, {
          credentials: 'include'
        });
        if (!res.ok) return;

        const data = await res.json();
        if (data.success) {
          if (data.data.status === 'settled') {
            setStatus('settled');
            onPaid();
            clearInterval(interval);
          } else if (data.data.status === 'expired') {
            setStatus('expired');
            onExpired();
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du paiement:", err);
      }
    };

    const interval = setInterval(checkPayment, 4000);
    return () => clearInterval(interval);
  }, [orderId, onPaid, onExpired, status]);

  const copyToClipboard = async () => {
    if (!invoice?.paymentRequest) return;
    try {
      await navigator.clipboard.writeText(invoice.paymentRequest);
      toast.success('Facture copiée dans le presse-papiers');
    } catch (err) {
      toast.error('Erreur lors de la copie de la facture');
    }
  };
  
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg flex flex-col items-center space-y-4">
        <p>{error}</p>
        <Button onClick={() => generateInvoice()} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Réessayer
        </Button>
      </div>
  );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center p-4">
        <Button onClick={() => generateInvoice()} disabled={isGenerating} size="large">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            'Générer la facture de paiement'
          )}
        </Button>
      </div>
  );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center">
        <QRCode
          value={invoice.paymentRequest}
          size={256}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="L"
          style={{ height: "auto", maxWidth: "100%", width: "256px" }}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Montant: {amount} sats</p>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex justify-center space-x-2">
          <Button onClick={copyToClipboard} variant="outline">
            Copier la facture
          </Button>
          <a href={`lightning:${invoice.paymentRequest}`}>
            <Button variant="default">Ouvrir dans le Wallet</Button>
          </a>
        </div>
      </div>
      {status === 'pending' && (
        <p className="text-center text-yellow-500 animate-pulse">En attente du paiement...</p>
      )}
      {status === 'settled' && (
        <p className="text-center text-green-500 font-bold">Paiement reçu !</p>
      )}
      {status === 'expired' && (
        <p className="text-center text-red-500">Facture expirée</p>
      )}
    </div>
  );
}
