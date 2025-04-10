"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent } from "@/app/components/ui/card";
import DazIAProgressBar from "@/app/components/daz-ia/ProgressBar";

export default function DeliveryPage() {
  const router = useRouter();
  const t = useTranslations("daz-ia-checkout");
  const [planData, setPlanData] = useState<{
    plan: string;
    billingCycle: string;
    sats: number;
  } | null>(null);

  useEffect(() => {
    // Récupération des données du plan depuis localStorage
    const storedPlan = localStorage.getItem("dazIAPlan");
    if (storedPlan) {
      setPlanData(JSON.parse(storedPlan));
    } else {
      // Rediriger vers la page de sélection de plan si aucun plan n'est sélectionné
      router.push("/daz-ia/checkout/plan");
    }
  }, [router]);

  // Schéma de validation pour le formulaire
  const formSchema = z.object({
    fullName: z.string().min(3, t("validation.fullNameRequired")),
    email: z.string().email(t("validation.invalidEmail")),
    address: z.string().min(5, t("validation.addressRequired")),
    city: z.string().min(2, t("validation.cityRequired")),
    postalCode: z.string().min(4, t("validation.postalCodeRequired")),
    country: z.string().min(1, t("validation.countryRequired")),
    phoneNumber: z.string().optional(),
    specialInstructions: z.string().optional(),
  });

  // Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      phoneNumber: "",
      specialInstructions: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Enregistrement des données de livraison
    localStorage.setItem("dazIADeliveryInfo", JSON.stringify(values));

    // Redirection vers la page de paiement
    router.push("/daz-ia/checkout/payment");
  };

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        {t("deliveryInfo")}
      </h1>

      <DazIAProgressBar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("delivery.fullName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("delivery.fullNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("delivery.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("delivery.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("delivery.address")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("delivery.addressPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("delivery.city")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("delivery.cityPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("delivery.postalCode")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("delivery.postalCodePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("delivery.country")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("delivery.countryPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Belgium">Belgique</SelectItem>
                        <SelectItem value="Switzerland">Suisse</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("delivery.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("delivery.phoneNumberPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("delivery.specialInstructions")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "delivery.specialInstructionsPlaceholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/daz-ia/checkout/plan")}
                >
                  {t("buttons.back")}
                </Button>
                <Button type="submit">{t("buttons.continue")}</Button>
              </div>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">
                {t("orderSummary")}
              </h3>

              {planData && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("summary.plan")}:</span>
                    <span className="font-medium">
                      {planData.plan === "oneshot" ? "One-Shot" : "Abonnement"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t("summary.type")}:</span>
                    <span className="font-medium">
                      {planData.billingCycle === "once"
                        ? t("billing.once")
                        : t("billing.yearly")}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold">{t("summary.total")}:</span>
                    <span className="font-bold">
                      {planData.sats.toLocaleString()} sats
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
