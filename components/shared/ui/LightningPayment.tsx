"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateInvoice, checkPayment } from '../../../lib/lightning';
import Image from 'next/image';
import ProtonPayment from './ProtonPayment';
import type { WebLNProvider } from 'webln';

interface LightningPaymentProps {
  amount: number;
  onSuccess?: () => void;
  productName: string;
  onCancel?: () => void;
}

declare global {
  interface Window {
    webln?: {
      enable: () => Promise<void>;
      sendPayment: (paymentRequest: string) => Promise<{ preimage: string }>;
    };
  }
}

export default function LightningPayment(props: LightningPaymentProps): React.ReactElement {
  const [invoice, setInvoice] = useState<{ id: string; paymentRequest: string; paymentHash?: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isWebLNAvailable, setIsWebLNAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showProtonModal, setShowProtonModal] = useState(false);

  useEffect(() => {
    const checkWebLN = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined' && window.webln) {
          setIsWebLNAvailable(true);
        }
      } catch (err) {
        setIsWebLNAvailable(false);
      }
    };
    
    checkWebLN();
  }, []);

  useEffect(() => {
    const createInvoice = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const invoiceData = await generateInvoice({
          amount: 10,
          memo: `Paiement pour ${props.productName}`,
        });
        setInvoice(invoiceData);
        if (invoiceData.paymentHash) {
          await checkPaymentStatus(invoiceData.paymentHash);
        }
      } catch (err) {
        setError(`Erreur lors de la génération de la facture: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      } finally {
        setIsLoading(false);
      }
    };
    createInvoice();
  }, [props.amount, props.productName]);

  const checkPaymentStatus = useCallback(async (paymentHash: string): Promise<void> => {
    try {
      const isPaid = await checkPayment(paymentHash);
      if (isPaid) {
        setPaymentStatus('success');
        if (props.onSuccess) props.onSuccess();
      } else if (paymentStatus === 'pending') {
        setTimeout(() => checkPaymentStatus(paymentHash), 5000);
      }
    } catch (err) {
      setError(`Erreur lors de la vérification du paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [props.onSuccess, paymentStatus]);

  const payWithWebLN = async (): Promise<void> => {
    if (!invoice || !window.webln) {
      setError("WebLN n'est pas disponible");
      return;
    }
    
    try {
      setIsLoading(true);
      
      await window.webln.enable();
      
      try {
        // getInfo n'existe pas sur le type WebLNProvider utilisé ici
      } catch (infoErr) {
      }
      
      const result = await window.webln.sendPayment(invoice.paymentRequest);
      
      if (result && result.preimage) {
        setPaymentStatus('success');
        if (props.onSuccess) props.onSuccess();
      } else {
        throw new Error("Aucun preimage retourné");
      }
    } catch (err) {
      let errorMessage = "Erreur de paiement WebLN";
      
      if (err instanceof Error) {
        if (err.message.includes("User rejected")) {
          errorMessage = "Le paiement a été rejeté par l'utilisateur";
        } else if (err.message.includes("Request canceled")) {
          errorMessage = "La requête a été annulée";
        } else if (err.message.includes("No route found")) {
          errorMessage = "Aucune route trouvée pour ce paiement";
        } else if (err.message.includes("Invoice expired")) {
          errorMessage = "La facture a expiré";
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Fonds insuffisants pour effectuer ce paiement";
        } else {
          errorMessage = `Erreur WebLN: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoice?.paymentRequest) {
      setQrUrl(`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(invoice.paymentRequest)}`);
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice?.paymentHash) {
      checkPaymentStatus(invoice.paymentHash);
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
    ) as React.ReactElement;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-red-600 mb-2">Erreur de paiement</h3>
        <p className="text-red-500 mb-2">{error}</p>
        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    ) as React.ReactElement;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 border border-green-200 rounded-2xl shadow-lg animate-bounceIn">
        <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Paiement réussi !</h3>
        <p className="text-green-700">Merci pour votre achat ⚡️</p>
      </div>
    ) as React.ReactElement;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 mb-2">Paiement</h3>
      <p className="text-gray-700 mb-4 text-center">Scanne le QR code ou copie la facture pour payer avec ton wallet Lightning. Paiement instantané, sécurisé et sans frais !</p>
      {invoice && qrUrl && (
        <div className="mb-4 transition-transform hover:scale-105 flex flex-col items-center">
          <Image src={qrUrl} alt="QR code Lightning" width={200} height={200} className="rounded-xl shadow-lg border-4 border-yellow-300" />
          <button
            className="bg-none border-none p-0 cursor-pointer flex items-center mt-2 text-gray-500 text-sm hover:text-gray-700 focus:outline-none"
            onClick={() => {navigator.clipboard.writeText(invoice.paymentRequest); alert('Facture copiée dans le presse-papier !')}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 0010.586 2H6a2 2 0 00-2 2v16a2 2 0 002 2h2" /></svg>
            Copier la facture
          </button>
        </div>
      )}
      {invoice && (
        <div className="w-full flex flex-col items-center gap-3">
          <button
            className="w-full px-5 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition mb-1"
            onClick={() => setShowWalletModal(true)}
          >
            Choisir un wallet
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
                onClick={async () => { 
                  setShowWalletModal(false); 
                  await payWithWebLN(); 
                }}
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
          </div>
        </div>
      )}
      {showProtonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Fermer"
              onClick={() => setShowProtonModal(false)}
            >
              &times;
            </button>
            <ProtonPayment
              sats={props.amount}
              promoApplied={false}
              onSuccess={() => { setShowProtonModal(false); if (props.onSuccess) props.onSuccess(); }}
              onCancel={() => setShowProtonModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
} 