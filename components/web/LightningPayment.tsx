'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import Button from '@/components/shared/ui/Button';
import { useToast } from '@/hooks/useToast';

export interface LightningPaymentProps {
  paymentRequest: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const LightningPayment: React.FC<LightningPaymentProps> = ({
  paymentRequest,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState(paymentRequest);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { showToast } = useToast();

  const handleWebLNPay = async () => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const webln = window.webln;
      if (!webln) {
        throw new Error('WebLN non disponible');
      }
      await webln.enable();
      await webln.sendPayment(paymentRequest);
      showToast('Paiement réussi !', 'success');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erreur paiement WebLN:', error);
      showToast(error instanceof Error ? error.message : 'Erreur de paiement', 'error');
      onError?.(error instanceof Error ? error : new Error('Erreur de paiement'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(paymentRequest);
    showToast('Facture copiée !', 'success');
  };

  const handleOpenWallet = () => {
    setShowWalletModal(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow">
      <div className="bg-white p-4 rounded-lg">
        <QRCode value={qrUrl} size={256} level="H" />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Button
          onClick={handleWebLNPay}
          disabled={isLoading}
          className="w-full"
          variant="primary"
        >
          {isLoading ? 'Paiement en cours...' : 'Payer avec WebLN'}
        </Button>

        <Button
          onClick={handleCopyInvoice}
          className="w-full"
          variant="outline"
        >
          Copier la facture
        </Button>

        <Button
          onClick={handleOpenWallet}
          className="w-full"
          variant="outline"
        >
          Ouvrir le portefeuille
        </Button>
      </div>
    </div>
};
};

export default LightningPayment; 