"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function DeliveryPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Delivery");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pourriez enregistrer les données de livraison
    // puis naviguer à la page de paiement
    router.push("/checkout/payment");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <h1 className="text-2xl font-bold mb-6">
        {t("title") || "Informations de livraison"}
      </h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("name") || "Nom complet"}
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("address") || "Adresse"}
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("city") || "Ville"}
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("zipCode") || "Code postal"}
                </label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("country") || "Pays"}
                </label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("phone") || "Téléphone"}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit">
              {t("continue") || "Continuer vers le paiement"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
