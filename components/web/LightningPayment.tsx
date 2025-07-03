'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { usePaymentService } from '@/hooks/usePaymentService';
import { Button } from '@/components/shared/ui';
import QRCode from 'qrcode.react';

declare global {
  interface Window {
    webln?: {
      enable: () => Promise<void>;
      sendPayment: (paymentRequest: string) => Promise<void>;
    };
  }
}

interface LightningPaymentProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const LightningPayment: React.FC<LightningPaymentProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  className = '',
}) => {
  const [paymentRequest, setPaymentRequest] = useState<string>('');
  const [paymentHash, setPaymentHash] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'loading' | 'paid' | 'error'>('loading');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const { toast } = useToast();
  const { createInvoice, checkPayment, isLoading, error: paymentError } = usePaymentService();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const invoice = await createInvoice(amount, description);
        setPaymentRequest(invoice.paymentRequest);
        setPaymentHash(invoice.paymentHash);
        setStatus('pending');
      } catch (error) {
        console.error('Failed to create invoice:', error);
        setStatus('error');
        onError?.(error as Error);
      }
    };

    initializePayment();
  }, [amount, description, createInvoice, onError]);

  useEffect(() => {
    if (!paymentHash || status !== 'pending') return;

    const checkInterval = setInterval(async () => {
      try {
        const invoiceStatus = await checkPayment(paymentHash);
        
        if ((invoiceStatus as unknown as string) === 'settled' || (invoiceStatus as unknown as string) === 'paid') {
          setStatus('paid');
          toast({
            title: 'Succès',
            description: 'Paiement reçu !',
            variant: 'success',
          });
          onSuccess?.();
          clearInterval(checkInterval);
        } else if ((invoiceStatus as unknown as string) === 'expired') {
          setStatus('error');
          toast({
            title: 'Erreur',
            description: 'La facture a expiré',
            variant: 'error',
          });
          clearInterval(checkInterval);
        }
      } catch (error) {
        console.error('Failed to check payment:', error);
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [paymentHash, status, checkPayment, onSuccess, toast]);

  useEffect(() => {
    if (status !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('error');
          toast({
            title: 'Erreur',
            description: 'La facture a expiré',
            variant: 'error',
          });
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, toast]);

  if (isLoading || status === 'loading') {
    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (paymentError || status === 'error') {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-red-500 mb-4">{paymentError || 'Une erreur est survenue'}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-green-500 mb-2">Paiement reçu !</p>
        <p className="text-sm text-gray-600">Merci pour votre paiement</p>
      </div>
    );
  }

  return (
    <div className={`text-center p-4 ${className}`}>
      <div className="mb-4">
        <QRCode
          value={paymentRequest}
          size={256}
          level="L"
          includeMargin={true}
          className="mx-auto"
        />
      </div>
      
      <p className="mb-2 font-medium">
        {amount.toLocaleString()} sats
      </p>
      
      <p className="text-sm text-gray-600 mb-4">
        Expire dans {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </p>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(paymentRequest);
            toast({
              title: 'Succès',
              description: 'Facture copiée !',
              variant: 'success',
            });
          }}
          variant="outline"
          className="w-full"
        >
          Copier la facture
        </Button>

        {window.webln && (
          <Button
            onClick={async () => {
              try {
                await window.webln?.enable();
                await window.webln?.sendPayment(paymentRequest);
                toast({
                  title: 'Succès',
                  description: 'Paiement envoyé !',
                  variant: 'success',
                });
              } catch (error) {
                console.error('WebLN payment failed:', error);
                toast({
                  title: 'Erreur',
                  description: 'Erreur lors du paiement',
                  variant: 'error',
                });
              }
            }}
            variant="default"
            className="w-full"
          >
            Payer avec WebLN
          </Button>
        )}
      </div>
    </div>
  );
};

export default LightningPayment; 