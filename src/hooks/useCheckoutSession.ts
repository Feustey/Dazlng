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

export function useCheckoutSession() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({});

  // Charger les données de la session au montage
  useEffect(() => {
    const savedData = localStorage.getItem("checkoutData");
    if (savedData) {
      setCheckoutData(JSON.parse(savedData));
    }
  }, []);

  // Sauvegarder les données dans la session
  const saveCheckoutData = (data: Partial<CheckoutData>) => {
    const newData = { ...checkoutData, ...data };
    setCheckoutData(newData);
    localStorage.setItem("checkoutData", JSON.stringify(newData));
  };

  // Effacer les données de la session
  const clearCheckoutData = () => {
    setCheckoutData({});
    localStorage.removeItem("checkoutData");
  };

  // Vérifier si les données de livraison sont complètes
  const isDeliveryComplete = () => {
    const { delivery } = checkoutData;
    return delivery && Object.values(delivery).every((value) => value);
  };

  // Vérifier si les données de paiement sont complètes
  const isPaymentComplete = () => {
    const { payment } = checkoutData;
    return payment && Object.values(payment).every((value) => value);
  };

  return {
    checkoutData,
    saveCheckoutData,
    clearCheckoutData,
    isDeliveryComplete,
    isPaymentComplete,
  };
}
