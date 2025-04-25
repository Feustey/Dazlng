"use client";

import { useState, useEffect } from "react";

interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

interface CheckoutData {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  sameAsBilling: boolean;
  paymentMethod: string | null;
  orderId: string | null;
  orderTotal: number;
}

const defaultCheckoutData: CheckoutData = {
  shippingAddress: null,
  billingAddress: null,
  sameAsBilling: true,
  paymentMethod: null,
  orderId: null,
  orderTotal: 0,
};

// Export à la fois comme export par défaut et comme export nommé pour la compatibilité
function useCheckoutData() {
  const [checkoutData, setCheckoutData] =
    useState<CheckoutData>(defaultCheckoutData);

  // Charger les données depuis le stockage local au chargement
  useEffect(() => {
    const savedData = localStorage.getItem("checkoutData");
    if (savedData) {
      try {
        setCheckoutData(JSON.parse(savedData));
      } catch (e) {
        console.error("Erreur lors du chargement des données de checkout:", e);
      }
    }
  }, []);

  // Sauvegarder les données dans le stockage local à chaque mise à jour
  useEffect(() => {
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [checkoutData]);

  // Fonction pour mettre à jour partiellement les données
  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Fonction pour réinitialiser les données
  const resetCheckoutData = () => {
    setCheckoutData(defaultCheckoutData);
    localStorage.removeItem("checkoutData");
  };

  return {
    checkoutData,
    updateCheckoutData,
    resetCheckoutData,
  };
}

export default useCheckoutData;
export { useCheckoutData };
