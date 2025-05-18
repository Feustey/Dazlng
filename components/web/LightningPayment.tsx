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
  const [invoice, setInvoice] = useState<{ id: string; paymentRequest: string; paymentHash?: string } | null>(null);
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
        if (invoiceData.id) {
          checkPaymentStatus(invoiceData.id);
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
  const checkPaymentStatus = useCallback(async (invoiceId: string) => {
    try {
      const isPaid = await checkPayment(invoiceId);
      if (isPaid) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      } else if (paymentStatus === 'pending') {
        setTimeout(() => checkPaymentStatus(invoiceId), 5000);
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
    if (invoice?.id) {
      checkPaymentStatus(invoice.id);
    }
  }, [checkPaymentStatus, invoice]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-pulse">
        <div className="w-44 h-44 bg-gradient-to-br from-yellow-300 to-purple-400 rounded-2xl mb-6" />
        <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <p className="mt-6 text-lg text-gray-400">Chargement du paiement Lightning...</p>
      </div>
    );
  }

  if (error && error.includes("LIGHTNING_ADDRESS")) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-red-600 mb-2">Configuration manquante</h3>
        <p className="text-red-500 mb-2">La configuration du paiement Lightning n'est pas terminée.<br/>Merci de contacter le support ou l'administrateur du site.</p>
        <p className="text-xs text-gray-500 mb-4">Détail technique : {error}</p>
        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-red-600 mb-2">Erreur de paiement</h3>
        <p className="text-red-500 mb-2">{error}</p>
        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 border border-green-200 rounded-2xl shadow-lg animate-bounceIn">
        <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Paiement réussi !</h3>
        <p className="text-green-700">Merci pour votre achat ⚡️</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/90 rounded-2xl shadow-2xl max-w-md mx-auto">
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 mb-2">Paiement Lightning</h3>
      <p className="text-gray-700 mb-4 text-center">Scanne le QR code ou copie la facture pour payer avec ton wallet Lightning. Paiement instantané, sécurisé et sans frais !</p>
      {invoice && qrUrl && (
        <div className="mb-4 transition-transform hover:scale-105">
          <Image src={qrUrl} alt="QR code Lightning" width={200} height={200} className="rounded-xl shadow-lg border-4 border-yellow-300" />
        </div>
      )}
      {invoice && (
        <div className="w-full flex flex-col items-center">
          <code className="break-all text-xs bg-gray-100 rounded-lg px-4 py-2 mb-2 w-full text-center border border-gray-200 select-all cursor-pointer" onClick={() => {navigator.clipboard.writeText(invoice.paymentRequest); alert('Facture copiée dans le presse-papier !')}}>
            {invoice.paymentRequest}
          </code>
          <button
            className="px-5 py-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white font-bold rounded-lg shadow-md hover:scale-105 transition mb-2"
            onClick={() => {navigator.clipboard.writeText(invoice.paymentRequest); alert('Facture copiée dans le presse-papier !')}}
          >
            Copier la facture
          </button>
          <button
            className="px-5 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition mb-2"
            onClick={() => setShowWalletModal(true)}
          >
            Choisir un wallet de paiement
          </button>
          <button
            className="px-5 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={() => {window.location.href = `lightning:${invoice.paymentRequest}`;}}
          >
            Ouvrir avec un wallet Lightning
          </button>
        </div>
      )}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-center">Choisissez votre wallet</h2>
            {isWebLNAvailable && (
              <button
                className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg mb-2 font-semibold hover:bg-yellow-500 transition"
                onClick={async () => { setShowWalletModal(false); await payWithWebLN(); }}
              >
                Payer avec Alby/WebLN
              </button>
            )}
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg mb-2 font-semibold hover:bg-green-600 transition"
              onClick={() => { setShowWalletModal(false); if (invoice) window.location.href = `lightning:${invoice.paymentRequest}`; }}
            >
              Ouvrir avec un wallet Lightning
            </button>
            <button
              className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg mb-2 font-semibold hover:bg-gray-300 transition"
              onClick={() => { setShowWalletModal(false); if (invoice) { navigator.clipboard.writeText(invoice.paymentRequest); alert('Facture copiée !'); } }}
            >
              Copier la facture Lightning
            </button>
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              onClick={() => setShowWalletModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 