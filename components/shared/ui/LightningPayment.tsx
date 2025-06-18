"use client";

import React, { useState, useEffect } from 'react';
import { usePaymentService } from '@/lib/hooks/usePaymentService';
import { Invoice, InvoiceStatus } from '@/types/lightning';
import Button from '@/components/shared/ui/Button';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

interface LightningPaymentProps {
  amount: number;
  description: string;
  onPaid: () => void;
  onExpired: () => void;
  onError: (error: Error) => void;
}

export const LightningPayment: React.FC<LightningPaymentProps> = ({
  amount,
  description,
  onPaid,
  onExpired,
  onError
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const paymentService = usePaymentService();

  useEffect(() => {
    const generateInvoice = async () => {
      try {
        const newInvoice = await paymentService.generateInvoice({
          amount,
          description
        });
        setInvoice(newInvoice);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur génération facture');
        onError(err instanceof Error ? err : new Error('Erreur génération facture'));
      }
    };

    generateInvoice();
  }, [amount, description, paymentService, onError]);

  useEffect(() => {
    if (!invoice) return;

    const watchInvoice = async () => {
      try {
        await paymentService.watchInvoice({
          paymentHash: invoice.id,
          onPaid: () => {
            setStatus('settled' as InvoiceStatus);
            onPaid();
          },
          onExpired: () => {
            setStatus('expired' as InvoiceStatus);
            onExpired();
          },
          onError: (err) => {
            setStatus('error' as InvoiceStatus);
            setError(err.message);
            onError(err);
          }
        });
      } catch (err) {
        setStatus('error' as InvoiceStatus);
        setError(err instanceof Error ? err.message : 'Erreur surveillance facture');
        onError(err instanceof Error ? err : new Error('Erreur surveillance facture'));
      }
    };

    watchInvoice();
  }, [invoice, paymentService, onPaid, onExpired, onError]);

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