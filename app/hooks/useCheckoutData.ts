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

const isClient = typeof window !== "undefined";

export function useCheckoutData() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({});

  useEffect(() => {
    if (isClient) {
      const savedData = localStorage.getItem("checkoutData");
      if (savedData) {
        setCheckoutData(JSON.parse(savedData));
      }
    }
  }, []);

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    const newData = { ...checkoutData, ...data };
    setCheckoutData(newData);
    if (isClient) {
      localStorage.setItem("checkoutData", JSON.stringify(newData));
    }
  };

  const clearCheckoutData = () => {
    setCheckoutData({});
    if (isClient) {
      localStorage.removeItem("checkoutData");
    }
  };

  return {
    checkoutData,
    updateCheckoutData,
    clearCheckoutData,
  };
}
