"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutSession } from "../../../hooks/useCheckoutSession";

export default function PaymentPage() {
  const router = useRouter();
  const { checkoutData, saveCheckoutData, isDeliveryComplete } =
    useCheckoutSession();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    email: "",
    total: 0,
  });

  // Vérifier si les données de livraison sont complètes
  useEffect(() => {
    if (!isDeliveryComplete()) {
      router.push("/checkout/delivery");
    }
  }, [isDeliveryComplete, router]);

  // Charger les données sauvegardées
  useEffect(() => {
    if (checkoutData.payment) {
      setFormData(checkoutData.payment);
    }
  }, [checkoutData.payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique de la carte
    if (!validateCard(formData)) {
      alert("Veuillez vérifier les informations de votre carte");
      return;
    }

    const total = calculateTotal();
    saveCheckoutData({
      payment: {
        ...formData,
        total,
      },
    });
    router.push("/checkout/confirmation");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Formatage du numéro de carte
    if (e.target.name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Formatage de la date d'expiration
    if (e.target.name === "expiry") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const validateCard = (data: typeof formData) => {
    // Validation du numéro de carte (algorithme de Luhn)
    const cardNumber = data.cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cardNumber)) return false;

    // Validation de la date d'expiration
    const [month, year] = data.expiry.split("/");
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      return false;
    }

    // Validation du CVV
    if (!/^\d{3,4}$/.test(data.cvv)) return false;

    return true;
  };

  const calculateTotal = () => {
    const basePrice = 299;
    const deliveryPrice =
      checkoutData.delivery?.deliveryOption === "express" ? 15 : 0;
    return basePrice + deliveryPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Paiement</h2>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Récapitulatif de la commande
          </h3>
          <div className="border-t border-gray-200 py-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">DazNode</span>
              <span className="text-gray-900">299,00 €</span>
            </div>
            {checkoutData.delivery?.deliveryOption === "express" && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Livraison express</span>
                <span className="text-gray-900">15,00 €</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{calculateTotal().toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Numéro de carte
            </label>
            <input
              type="text"
              name="cardNumber"
              id="cardNumber"
              required
              maxLength={19}
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="cardName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom sur la carte
            </label>
            <input
              type="text"
              name="cardName"
              id="cardName"
              required
              value={formData.cardName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700"
              >
                Date d'expiration
              </label>
              <input
                type="text"
                name="expiry"
                id="expiry"
                required
                maxLength={5}
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700"
              >
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                id="cvv"
                required
                maxLength={3}
                value={formData.cvv}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Payer {calculateTotal().toFixed(2)} €
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
