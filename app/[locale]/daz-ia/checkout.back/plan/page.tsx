"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCheckoutData } from "../../../../hooks/useCheckoutData";
import DazIAProgressBar from "@/components/daz-ia/ProgressBar";
import Button from "@/components/ui/button";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";

export default function PlanSelectionPage() {
  const router = useRouter();
  const t = useTranslations("daz-ia-checkout");

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = {
    oneshot: {
      name: "One-Shot",
      sats: 10000,
      features: [
        "Accès à l'IA générative",
        "Génération de contenu limité",
        "Accès aux modèles de base",
        "Support par email",
      ],
    },
    subscription: {
      name: "Abonnement",
      sats: 100000,
      features: [
        "Accès illimité à tous les modèles d'IA",
        "Génération de contenu avancé",
        "Modèles personnalisés",
        "API d'accès",
        "Support prioritaire 24/7",
      ],
    },
  };

  const handleContinue = () => {
    if (!selectedPlan) return;

    // Store selected plan in localStorage
    localStorage.setItem(
      "dazIAPlan",
      JSON.stringify({
        plan: selectedPlan,
        billingCycle: selectedPlan === "oneshot" ? "once" : "yearly",
        sats: plans[selectedPlan as keyof typeof plans].sats,
      })
    );

    router.push("/daz-ia/checkout/delivery");
  };

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="text-3xl font-bold text-center mb-8">{t("selectPlan")}</h1>

      <DazIAProgressBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 max-w-4xl mx-auto">
        {Object.entries(plans).map(([id, plan]) => {
          return (
            <Card
              key={id}
              className={`cursor-pointer transition-all ${selectedPlan === id ? "border-primary shadow-lg" : "border-border"}`}
              onClick={() => setSelectedPlan(id)}
            >
              <CardHeader>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {plan.sats.toLocaleString()} sats
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {id === "oneshot" ? "" : "/ an"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => setSelectedPlan(id)}
                >
                  {selectedPlan === id
                    ? t("buttons.selected")
                    : t("buttons.select")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <Button size="lg" disabled={!selectedPlan} onClick={handleContinue}>
          {t("buttons.continue")}
        </Button>
      </div>
    </div>
  );
}
