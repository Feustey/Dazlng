"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Card from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { useParams } from "next/navigation";
import { MapPin, Phone, User, Building, Globe, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgique" },
  { code: "CH", name: "Suisse" },
  { code: "DE", name: "Allemagne" },
  { code: "ES", name: "Espagne" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PT", name: "Portugal" },
  { code: "LU", name: "Luxembourg" },
  { code: "IT", name: "Italie" },
];

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  zipCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  province: z.string().optional(),
  country: z.string().min(2, "Veuillez sélectionner un pays"),
  phone: z.string().regex(/^\+?[0-9\s-]{10,}$/, "Numéro de téléphone invalide"),
  newsletter: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const ProgressBar = () => {
  const t = useTranslations("Checkout");
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-accent/20 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-primary -translate-y-1/2 transition-all duration-500" />

        {/* Étapes */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-lg">
          <span className="text-sm font-medium">1</span>
        </div>
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent-foreground">
          <span className="text-sm font-medium">2</span>
        </div>
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent-foreground">
          <span className="text-sm font-medium">3</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-sm font-medium text-primary">
          {t("delivery")}
        </span>
        <span className="text-sm text-muted-foreground">{t("payment")}</span>
        <span className="text-sm text-muted-foreground">
          {t("confirmation")}
        </span>
      </div>
    </div>
  );
};

export default function DeliveryPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Delivery");
  const params = useParams();
  const locale = params?.locale as string;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "FR",
      newsletter: false,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Ici vous pourriez enregistrer les données de livraison
    // puis naviguer à la page de paiement
    console.log(data);
    router.push(`/${locale}/checkout/payment`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <ProgressBar />
      <h1 className="text-2xl font-bold mb-6 gradient-text">{t("title")}</h1>

      <Card translucent className="p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="animate-slide-up space-y-6"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  {...register("firstName")}
                  placeholder={t("firstName")}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  {...register("lastName")}
                  placeholder={t("lastName")}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <Input
                {...register("email")}
                type="email"
                placeholder={t("email")}
                className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <Input
                {...register("address")}
                placeholder={t("address")}
                className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  {...register("city")}
                  placeholder={t("city")}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  {...register("zipCode")}
                  placeholder={t("zipCode")}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  {...register("province")}
                  placeholder={t("province")}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Select
                  value={watch("country")}
                  onValueChange={(value) => setValue("country", value)}
                >
                  <SelectTrigger className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <SelectValue placeholder={t("country")} />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder={t("phone")}
                  className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={watch("newsletter")}
                onCheckedChange={(checked) =>
                  setValue("newsletter", checked as boolean)
                }
                className="border-accent/20"
              />
              <label
                htmlFor="newsletter"
                className="text-sm text-muted-foreground"
              >
                {t("newsletter")}
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button type="submit" variant="gradient">
              {t("continue")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
