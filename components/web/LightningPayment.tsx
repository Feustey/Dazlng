'use client';

import { useState, useEffect } from 'react';
import { generateInvoice, checkPayment } from '../../lib/lightning';

interface LightningPaymentProps {
  amount: number;
  onSuccess?: () => void;
  productName: string;
}

declare global {
  interface Window {
    webln?: {
      enable: () => Promise<void>;
      sendPayment: (paymentRequest: string) => Promise<{ preimage: string }>;
    };
  }
}

export default function LightningPayment({ amount, onSuccess, productName }: LightningPaymentProps) {
  const [invoice, setInvoice] = useState<{ paymentRequest: string; paymentHash: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isWebLNAvailable, setIsWebLNAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log('WebLN non disponible:', err);
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
  const checkPaymentStatus = async (paymentHash: string) => {
    try {
      const isPaid = await checkPayment(paymentHash);
      
      if (isPaid) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      } else if (paymentStatus === 'pending') {
        // Réessayer dans 5 secondes
        setTimeout(() => checkPaymentStatus(paymentHash), 5000);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du paiement:', err);
      setError(`Erreur lors de la vérification du paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

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
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">Paiement Bitcoin Lightning</h3>
      <p className="mb-4">Montant: {amount} sats</p>
      
      {invoice && (
        <>
          {/* QR Code pour paiement mobile */}
          <div className="mb-4 text-center">
            <img 
              src={`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(invoice.paymentRequest)}`} 
              alt="QR Code Lightning" 
              className="mx-auto"
            />
          </div>
          
          {/* Bouton WebLN pour desktop avec Alby */}
          {isWebLNAvailable && (
            <button 
              onClick={payWithWebLN}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full mb-4"
            >
              Payer avec Alby
            </button>
          )}
          
          {/* Bouton pour copier l'invoice */}
          <button 
            onClick={() => {
              navigator.clipboard.writeText(invoice.paymentRequest);
              alert('Facture copiée dans le presse-papier');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
          >
            Copier la facture Lightning
          </button>
          
          {/* Lien de secours pour ouvrir avec un wallet Lightning */}
          <a 
            href={`lightning:${invoice.paymentRequest}`}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded block text-center"
          >
            Ouvrir avec un Wallet Lightning
          </a>
        </>
      )}
    </div>
  );
} 