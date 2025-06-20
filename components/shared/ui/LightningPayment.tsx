"use client";

import React, { useState, useEffect } from 'react';
// import { usePaymentService } from '@/lib/hooks/usePaymentService';
import { InvoiceStatus } from '@/types/lightning';
import Button from '@/components/shared/ui/Button';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

interface LightningPaymentProps {
  amount: number;
  description: string;
  metadata?: Record<string, any>;
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

  // Générer la facture via l'API
  useEffect(() => {
    const generateInvoice = async () => {
      try {
        const res = await fetch('/api/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ amount, description, metadata })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.message || 'Erreur création facture');
        setInvoice(data.data.invoice);
        setOrderId(data.data.order?.id || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur génération facture');
        onError(err instanceof Error ? err : new Error('Erreur génération facture'));
      }
    };
    generateInvoice();
  }, [amount, description, metadata, onError]);

  // Polling pour vérifier le paiement
  useEffect(() => {
    if (!orderId) return;
    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/check-payment?order=${orderId}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.data.status === 'settled') {
          setStatus('settled');
          onPaid();
        } else if (data.success && data.data.status === 'expired') {
          setStatus('expired');
          onExpired();
        }
      } catch (err) {
        // Optionnel: afficher une erreur de polling
      }
    };
    const interval = setInterval(checkPayment, 4000);
    return () => clearInterval(interval);
  }, [orderId, onPaid, onExpired]);

  const copyToClipboard = async () => {
    if (!invoice) return;
    try {
      await navigator.clipboard.writeText(invoice.paymentRequest);
      toast.success('Facture copiée dans le presse-papiers');
    } catch (err) {
      toast.error('Erreur copie facture');
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-4 text-gray-500">
        <p>Génération de la facture...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center">
        <QRCode
          value={invoice.paymentRequest}
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Montant: {amount} sats</p>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex justify-center space-x-2">
          <Button onClick={copyToClipboard} variant="outline">
            Copier la facture
          </Button>
        </div>
      </div>
      {status === 'pending' && (
        <p className="text-center text-yellow-500">En attente du paiement...</p>
      )}
      {status === 'settled' && (
        <p className="text-center text-green-500">Paiement reçu !</p>
      )}
      {status === 'expired' && (
        <p className="text-center text-red-500">Facture expirée</p>
      )}
    </div>
  );
}; 