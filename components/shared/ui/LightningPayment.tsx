"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';
import type { InvoiceStatus } from '@/types/lightning';
import { Button } from '@/components/shared/ui';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { Loader2 } from '@/components/shared/ui/IconRegistry';


interface LightningPaymentProps {
  amount: number;
  description: string;
  onSuccess?: (paymentHash: string) => void;
  onError?: (error: Error) => void;
  onExpired?: () => void;
  orderId?: string;
  className?: string;
}

const LightningPayment: React.FC<LightningPaymentProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  onExpired,
  orderId,
  className = ''
}) => {
  const [status, setStatus] = useState<InvoiceStatus['status']>('pending');
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [paymentRequest, setPaymentRequest] = useState<string>('');
  const [paymentHash, setPaymentHash] = useState<string>('');
  const { toast: showToast } = useToast();

  useEffect(() => {
    createInvoice();
  }, []);

  useEffect(() => {
    if (status === 'pending' && paymentHash) {
      const interval = setInterval(checkPaymentStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [status, paymentHash]);

  useEffect(() => {
    if (timeLeft > 0 && status === 'pending') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus('expired');
            onExpired?.();
            showToast({ title: 'Paiement expiré', variant: 'error' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, status, onExpired, showToast]);

  const createInvoice = async () => {
    try {
      setStatus('pending');
      setError(null);

      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          "LightningPayment.lightningpaymentlightningpayme": 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          metadata: { orderId }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la facture');
      }

      const data = await response.json();
      
      if (data.success) {
        setPaymentRequest(data.data.payment_request);
        setPaymentHash(data.data.payment_hash);
        showToast({ title: 'Facture créée avec succès', variant: 'success' });
      } else {
        throw new Error(data.error?.message || 'Erreur lors de la création de la facture');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error.message);
      setStatus('expired');
      onError?.(error);
      showToast({ title: error.message, variant: 'error' });
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId || status !== 'pending') return;

    try {
      const response = await fetch('/api/check-invoice', {
        method: 'POST',
        headers: {
          "LightningPayment.lightningpaymentlightningpayme": 'application/json',
        },
        body: JSON.stringify({ payment_hash: paymentHash }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          if (data.data.status === 'settled') {
            setStatus('settled');
            onSuccess?.(paymentHash);
            showToast({ title: 'Paiement confirmé !', variant: 'success' });
          } else if (data.data.status === 'expired') {
            setStatus('expired');
            onExpired?.();
            showToast({ title: 'Paiement expiré', variant: 'error' });
          }
        }
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du paiement:', err);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentRequest);
      showToast({ title: 'Adresse copiée dans le presse-papiers', variant: 'success' });
    } catch (err) {
      showToast({ title: 'Erreur lors de la copie', variant: 'error' });
    }
  };

  const handleRetry = () => {
    setTimeLeft(300);
    setError(null);
    createInvoice();
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg flex flex-col items-center space-y-4">
        <p>{error}</p>
        <Button onClick={handleRetry} disabled={status === 'settled' || status === 'expired'}>
          {status === 'settled' || status === 'expired' ? null : (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Réessayer
        </Button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className={`lightning-payment ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Paiement Lightning
            </h3>
            <p className="text-gray-600">
              {amount} sats - {description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-500">{t('LightningPayment.temps_restant')}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">{t('LightningPayment.adresse_de_paiement_')}</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={paymentRequest}
                  readOnly
                  className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Copier
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">{t('LightningPayment.en_attente_du_paiement')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'settled') {
    return (
      <div className="text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h4 className="text-lg font-semibold text-green-800 mb-2">
          Paiement confirmé !
        </h4>
        <p className="text-green-600">
          Votre paiement a été traité avec succès.
        </p>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="text-center">
        <div className="text-red-600 text-4xl mb-4">✗</div>
        <h4 className="text-lg font-semibold text-red-800 mb-2">
          Paiement expiré
        </h4>
        <p className="text-red-600 mb-4">
          Le délai de paiement a expiré.
        </p>
        <Button onClick={handleRetry}>
          Créer une nouvelle facture
        </Button>
      </div>
    );
  }

  return null;
};

export default LightningPayment;
