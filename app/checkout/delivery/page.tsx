"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCheckoutSession } from "../../hooks/useCheckoutSession";

type DeliveryOption = "standard" | "express";

const deliveryOptions = [
  {
    id: "standard" as DeliveryOption,
    name: "Livraison standard",
    price: 0,
    estimatedDays: "2-3 semaines",
  },
  {
    id: "express" as DeliveryOption,
    name: "Livraison express",
    price: 15,
    estimatedDays: "1-2 semaines",
  },
];

export default function DeliveryPage() {
  const router = useRouter();
  const params = useParams();
  const { checkoutData, saveCheckoutData } = useCheckoutSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
  });
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryOption>("standard");

  // Charger les données sauvegardées
  useEffect(() => {
    if (checkoutData?.delivery) {
      setFormData(checkoutData.delivery);
      setSelectedDelivery(checkoutData.delivery.deliveryOption);
    }
  }, [checkoutData?.delivery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveCheckoutData({
      delivery: {
        ...formData,
        deliveryOption: selectedDelivery,
      },
    });
    router.push(`/${params.locale}/checkout/payment`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Informations de livraison
        </h2>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Options de livraison
          </h3>
          <div className="space-y-4">
            {deliveryOptions.map((option) => (
              <div
                key={option.id}
                className={`relative border rounded-lg p-4 cursor-pointer ${
                  selectedDelivery === option.id
                    ? "border-indigo-600 ring-2 ring-indigo-600"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedDelivery(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {option.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Délai estimé : {option.estimatedDays}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {option.price === 0 ? "Gratuit" : `${option.price} €`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse
            </label>
            <input
              type="text"
              name="address"
              id="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Ville
              </label>
              <input
                type="text"
                name="city"
                id="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Code postal
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continuer vers le paiement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
