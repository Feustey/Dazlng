"use client";

export const dynamic = "force-dynamic";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { useParams } from "next/navigation";
import { MapPin, Phone, User, Building, Globe } from "lucide-react";

export default function DeliveryPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Delivery");
  const params = useParams();
  const locale = params?.locale as string;

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
    router.push(`/${locale}/checkout/payment`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 gradient-text">{t("title")}</h1>

      <Card className="card-glass border-accent/20 p-6 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder={t("name")}
                value={formData.name}
                onChange={handleChange}
                className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <Input
                id="address"
                name="address"
                type="text"
                required
                placeholder={t("address")}
                value={formData.address}
                onChange={handleChange}
                className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder={t("city")}
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  required
                  placeholder={t("zipCode")}
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  required
                  placeholder={t("country")}
                  value={formData.country}
                  onChange={handleChange}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder={t("phone")}
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              className="btn-gradient py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              {t("continue")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
