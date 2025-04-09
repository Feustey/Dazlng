import { useState, useEffect } from "react";

interface CheckoutData {
  delivery?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    deliveryOption: "standard" | "express";
  };
  payment?: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    email: string;
    total: number;
  };
}

interface PaymentSession {
  id: string;
  amount: number;
  paymentUrl: string;
  status: "pending" | "completed" | "failed";
}

export function useCheckoutSession(sessionId?: string) {
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({});

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const response = await fetch(`/api/checkout/session/${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  const saveCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  return {
    session,
    error,
    isLoading,
    checkoutData,
    saveCheckoutData,
  };
}
