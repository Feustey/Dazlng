"use client";

import { useState, useEffect } from 'react';
import { usePaymentService } from '@/lib/hooks/usePaymentService';
import { Invoice } from '@/types/lightning';
import QRCode from 'react-qr-code';

interface LightningPaymentProps {
  amount: number;
  description: string;
  onPaid: () => void;
  onError: (error: Error) => void;
}

export const LightningPayment: React.FC<LightningPaymentProps> = ({
  amount,
  description,
  onPaid,
  onError
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [status, setStatus] = useState<'pending' | 'paid' | 'expired' | 'error'>('pending');
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
        setStatus('pending');
        setError(null);

        // Surveiller le paiement
        paymentService.watchInvoice({
          paymentHash: newInvoice.paymentHash,
          onPaid: () => {
            setStatus('paid');
            onPaid();
          },
          onExpired: () => {
            setStatus('expired');
          },
          onError: (error) => {
            setStatus('error');
            setError(error.message);
            onError(error);
          }
        });
      } catch (error) {
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        onError(error instanceof Error ? error : new Error('Erreur inconnue'));
      }
    };

    generateInvoice();
  }, [amount, description, onPaid, onError, paymentService]);

  if (status === 'error') {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Erreur: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-600">La facture a expiré</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Générer une nouvelle facture
        </button>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-green-600">Paiement reçu !</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p>Génération de la facture...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Paiement Lightning</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-xl font-bold mt-2">{amount} sats</p>
      </div>

      <div className="flex justify-center mb-4">
        <QRCode
          value={invoice.paymentRequest}
          size={256}
          level="M"
          className="p-2 bg-white"
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Scannez le QR code ou copiez la facture</p>
        <div className="relative">
          <input
            type="text"
            value={invoice.paymentRequest}
            readOnly
            className="w-full p-2 border rounded text-sm font-mono"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(invoice.paymentRequest);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Copier
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Expire le {new Date(invoice.expiresAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}; 