"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { useParams } from "next/navigation";

export default function DeliveryPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Delivery");
  const params = useParams();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Ici vous pourriez enregistrer les données de livraison
    // puis naviguer à la page de paiement
    router.push(`/${params.locale}/checkout/payment`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">
        {t("title") || "Informations de livraison"}
      </h1>

      <Card className="card-glass border-accent/20 p-6">
        <form onSubmit={handleSubmit} className="animate-slide-up">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-1"
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
                className="bg-card/50 backdrop-blur-sm border-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-muted-foreground mb-1"
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
                className="bg-card/50 backdrop-blur-sm border-accent/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-muted-foreground mb-1"
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
                  className="bg-card/50 backdrop-blur-sm border-accent/20"
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-muted-foreground mb-1"
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
                  className="bg-card/50 backdrop-blur-sm border-accent/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-muted-foreground mb-1"
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
                  className="bg-card/50 backdrop-blur-sm border-accent/20"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-muted-foreground mb-1"
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
                  className="bg-card/50 backdrop-blur-sm border-accent/20"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" className="btn-gradient">
              {t("continue") || "Continuer vers le paiement"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
