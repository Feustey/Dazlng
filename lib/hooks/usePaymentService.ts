import { useMemo } from 'react';
import { PaymentService } from '@/lib/services/payment-service';

export function usePaymentService(): PaymentService {
  return useMemo(() => new PaymentService(), []);
} 