'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { generateInvoice, checkPayment } from '../../lib/lightning';
import Image from 'next/image';
import QRCode from 'qrcode';

interface LightningPaymentProps {
  amount: number;
  productName: string;
  onSuccess: (transactionId: string) => void;
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

const LightningPayment: React.FC<LightningPaymentProps> = ({ amount, productName, onSuccess, onCancel }) => {
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
    const createInvoice = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const invoiceData = await generateInvoice({
          amount: amount,
          memo: `Paiement pour ${productName}`,
        });
        setInvoice(invoiceData);
        // Commencer à vérifier l'état du paiement
        if (invoiceData.id) {
          await checkPaymentStatus(invoiceData.id);
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
  const checkPaymentStatus = useCallback(async (invoiceId: string): Promise<void> => {
    try {
      const isPaid = await checkPayment(invoiceId);
      if (isPaid) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess(invoiceId);
      } else if (paymentStatus === 'pending') {
        setTimeout(() => checkPaymentStatus(invoiceId), 5000);
      }
    } catch (err) {
      setError(`Erreur lors de la vérification du paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [onSuccess, paymentStatus]);

  // Fonction pour payer avec WebLN (Alby extension)
  const payWithWebLN = async (): Promise<void> => {
    if (!invoice || !window.webln) return;
    try {
      setIsLoading(true);
      await window.webln.enable();
      const result = await window.webln.sendPayment(invoice.paymentRequest);
      if (result.preimage) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess(invoice.id);
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
    const isWebLNPromptClosed = error.includes("Prompt was closed") || error.includes("User rejected");
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${isWebLNPromptClosed ? 'bg-amber-100' : 'bg-red-100'}`}>
          {isWebLNPromptClosed ? (
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isWebLNPromptClosed ? 'text-amber-700' : 'text-red-600'}`}>{isWebLNPromptClosed ? 'Action interrompue' : 'Erreur de paiement'}</h3>
        {isWebLNPromptClosed ? (
          <div className="text-center mb-4">
            <p className="text-gray-700">Vous avez fermé ou rejeté la fenêtre de paiement.</p>
            <p className="text-gray-600 text-sm mt-1">Cela arrive parfois avec les extensions de portefeuille Lightning.</p>
          </div>
        ) : (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}
        <div className="flex flex-col space-y-2 w-full">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-medium"
            onClick={() => window.location.reload()}
          >
            Réessayer le paiement
          </button>
          {onCancel && (
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              onClick={onCancel}
            >
              Revenir à la commande
            </button>
          )}
          {isWebLNPromptClosed && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Conseil :</strong> Si vous utilisez une extension comme Alby, assurez-vous qu'elle est déverrouillée et autorisez la fenêtre pop-up quand elle apparaît.
              </p>
            </div>
          )}
        </div>
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
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-900/95 to-purple-950/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-indigo-800/30 max-w-md mx-auto">
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 mb-4">Paiement Lightning</h3>
      <div className="w-full">
        {/* Desktop : QR code avec style amélioré */}
        <div className="hidden md:block">
          {invoice && qrUrl && (
            <div className="mb-2 flex flex-col items-center">
              <div className="relative p-2 bg-white rounded-2xl shadow-[0_0_25px_rgb(79,70,229,0.4)] border-4 border-gradient-to-br from-indigo-400 to-purple-500">
                <Image 
                  src={qrUrl} 
                  alt="QR code Lightning" 
                  width={260} 
                  height={260} 
                  className="rounded-xl" 
                />
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-slate-900 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform rotate-12">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
              </div>
              <button
                className="mt-2 flex items-center justify-center text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                onClick={() => {navigator.clipboard.writeText(invoice.paymentRequest); alert('Facture copiée dans le presse-papier !')}}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
                copier
              </button>
            </div>
          )}
          <div className="text-center text-sm text-indigo-300 mb-6">Scannez ce code avec votre wallet mobile Lightning</div>
        </div>
        {/* Mobile : bouton principal avec design amélioré */}
        {invoice && (
          <div className="w-full flex flex-col items-center">
            <button
              className="block md:hidden w-full px-5 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-amber-500/30 transform transition hover:scale-105 mb-4 flex items-center justify-center"
              onClick={() => {window.location.href = `lightning:${invoice.paymentRequest}`;}}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Ouvrir avec un wallet
            </button>
            {/* Mobile : copier la facture en petit */}
            <button
              className="block md:hidden mt-2 flex items-center justify-center text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
              onClick={() => {navigator.clipboard.writeText(invoice.paymentRequest); alert('Facture copiée dans le presse-papier !')}}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
              copier
            </button>
          </div>
        )}
        {/* Informations de paiement avec design amélioré */}
        <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-200">Montant :</span>
            <span className="font-bold text-white">{amount} <span className="text-yellow-400">sats</span></span>
          </div>
          <div className="mt-3 pt-3 border-t border-indigo-800/30">
            <p className="text-xs text-indigo-300 flex items-center">
              <svg className="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              Pas de wallet Lightning ? Essayez <a href="https://getalby.com/products/alby-go/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 ml-1">Alby</a> 
            </p>
          </div>
        </div>
      </div>
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 relative">
            {/* Bouton croix pour fermer la popin */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Fermer"
              onClick={() => {
                setShowWalletModal(false);
                if (onCancel) onCancel();
              }}
            >
              &times;
            </button>
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
              Wallet Lightning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightningPayment; 