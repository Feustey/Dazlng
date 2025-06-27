import { useState, useCallback } from 'react';
import { daznoApi } from '@/lib/services/dazno-api';
import { InvoiceStatus } from '@/types/lightning';
import { useToast } from '@/hooks/useToast';

interface PaymentHookResult {
  createInvoice: (amount: number, description: string) => Promise<{
    paymentRequest: string;
    paymentHash: string;
  }>;
  checkPayment: (paymentHash: string) => Promise<InvoiceStatus>;
  isLoading: boolean;
  error: string | null;
}

export function usePaymentService(): PaymentHookResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createInvoice = useCallback(async (amount: number, description: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const invoice = await daznoApi.createInvoice({
        amount,
        description,
        expiresIn: 300, // 5 minutes
      });

      return {
        paymentRequest: invoice.paymentRequest,
        paymentHash: invoice.paymentHash,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la facture';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'error',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const checkPayment = useCallback(async (paymentHash: string) => {
    try {
      return await daznoApi.checkPayment(paymentHash);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification du paiement';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'error',
      });
      throw err;
    }
  }, [toast]);

  return {
    createInvoice,
    checkPayment,
    isLoading,
    error,
  };
} 