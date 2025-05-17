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
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Vérifier si WebLN est disponible (extension Alby installée)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.webln) {
      setIsWebLNAvailable(true);
    }
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

      {/* Bouton pour ouvrir le pop-up de choix de wallet */}
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded font-semibold cursor-pointer mb-2"
        onClick={() => setShowWalletModal(true)}
      >
        Choisir un wallet de paiement
      </button>

      {/* Modal de choix de wallet */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Choisissez votre wallet</h2>
            {isWebLNAvailable && (
              <button
                className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded mb-2"
                onClick={async () => {
                  setShowWalletModal(false);
                  await payWithWebLN();
                }}
              >
                Payer avec Alby/WebLN
              </button>
            )}
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded mb-2"
              onClick={() => {
                setShowWalletModal(false);
                if (invoice) window.location.href = `lightning:${invoice.paymentRequest}`;
              }}
            >
              Ouvrir avec un wallet Lightning
            </button>
            <button
              className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded mb-2"
              onClick={() => {
                setShowWalletModal(false);
                if (invoice) {
                  navigator.clipboard.writeText(invoice.paymentRequest);
                  alert('Facture copiée !');
                }
              }}
            >
              Copier la facture Lightning
            </button>
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowWalletModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Bouton de simulation */}
      <button
        className="bg-green-500 text-white px-6 py-2 rounded font-semibold cursor-pointer mt-2"
        onClick={onSuccess}
      >
        Simuler le paiement
      </button>
    </div>
  );
} 