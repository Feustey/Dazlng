'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { generateInvoice, checkPayment } from '../../lib/lightning';
import Image from 'next/image';
import QRCode from 'qrcode';

interface LightningPaymentProps {
  amount: number;
  productName: string;
  onSuccess: () => void;
}

declare global {
  interface Window {
    webln?: {
      enable: () => Promise<void>;
      sendPayment: (paymentRequest: string) => Promise<{ preimage: string }>;
    };
  }
}

export default function LightningPayment({ amount, productName, onSuccess }: LightningPaymentProps) {
  const [invoice, setInvoice] = useState<{ paymentRequest: string; paymentHash: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isWebLNAvailable, setIsWebLNAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  // Vérifier si WebLN est disponible (extension Alby installée)
  useEffect(() => {
    const checkWebLN = async () => {
      try {
        setIsLoading(true);
        if (typeof window !== 'undefined' && window.webln) {
          await window.webln.enable();
          setIsWebLNAvailable(true);
        }
      } catch (err) {
        // SUPPRIMER console.log('WebLN non disponible:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkWebLN();
  }, []);

  // Générer l'invoice au chargement du composant
  useEffect(() => {
    const createInvoice = async () => {
      try {
        setIsLoading(true);
        const invoiceData = await generateInvoice({
          amount: amount,
          memo: `Paiement pour ${productName}`,
        });
        
        setInvoice(invoiceData);
        
        // Commencer à vérifier l'état du paiement
        if (invoiceData.paymentHash) {
          checkPaymentStatus(invoiceData.paymentHash);
        }
      } catch (err) {
        setError(`Erreur lors de la génération de la facture: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      } finally {
        setIsLoading(false);
      }
    };

    createInvoice();
  }, [amount, productName]);

  // Fonction pour vérifier l'état du paiement
  const checkPaymentStatus = useCallback(async (paymentHash: string) => {
    try {
      const isPaid = await checkPayment(paymentHash);
      if (isPaid) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      } else if (paymentStatus === 'pending') {
        setTimeout(() => checkPaymentStatus(paymentHash), 5000);
      }
    } catch (err) {
      setError(`Erreur lors de la vérification du paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [onSuccess, paymentStatus]);

  // Fonction pour payer avec WebLN (Alby extension)
  const payWithWebLN = async () => {
    if (!invoice || !window.webln) return;

    try {
      setIsLoading(true);
      await window.webln.enable();
      
      const result = await window.webln.sendPayment(invoice.paymentRequest);
      
      if (result.preimage) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(`Erreur de paiement WebLN: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Génère le QR code quand l'invoice change
  useEffect(() => {
    if (invoice?.paymentRequest) {
      QRCode.toDataURL(invoice.paymentRequest)
        .then((url: string) => setQrUrl(url));
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice?.paymentHash) {
      checkPaymentStatus(invoice.paymentHash);
    }
  }, [checkPaymentStatus, invoice]);

  if (isLoading) {
    return <div className="text-center p-4">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-4 text-green-500">
        Paiement réussi! Merci pour votre achat.
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg text-center">
      <p>Paiement Lightning pour <b>{productName}</b> ({amount} sats)</p>

      {invoice && (
        <div className="my-4">
          <p>
            <b>Invoice Lightning :</b>
          </p>
          <code className="break-all text-xs block mb-3">
            {invoice.paymentRequest}
          </code>
          {qrUrl && (
            <div className="flex justify-center mb-3">
              <Image src={qrUrl} alt="QR code Lightning" width={180} height={180} className="w-44 h-44" />
            </div>
          )}
        </div>
      )}

      {isWebLNAvailable && invoice && (
        <button
          className="bg-yellow-400 text-gray-900 px-6 py-2 rounded font-semibold cursor-pointer mr-2"
          onClick={payWithWebLN}
        >
          Payer avec WebLN (Alby)
        </button>
      )}

      <button
        className="bg-green-500 text-white px-6 py-2 rounded font-semibold cursor-pointer"
        onClick={onSuccess}
      >
        Simuler le paiement
      </button>
    </div>
  );
} 