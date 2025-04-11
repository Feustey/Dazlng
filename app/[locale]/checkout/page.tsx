"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import PageContainer from "@/app/components/layout/PageContainer";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import { ArrowRight, Check, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Marquer cette page comme dynamique
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(
    searchParams.get("plan") || "one-shot"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    "one-shot": {
      price: 10000,
      title: t("plans.one-shot.title"),
      description: t("plans.one-shot.description"),
    },
    subscription: {
      price: 100000,
      title: t("plans.subscription.title"),
      description: t("plans.subscription.description"),
    },
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plans[selectedPlan as keyof typeof plans].price,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();
      if (data.paymentRequest) {
        router.push(
          `/${searchParams.get("locale")}/payment/${data.paymentRequest}`
        );
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageContainer title={t("title")} subtitle={t("subtitle")}>
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient">
              {t("select_plan")}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {t("select_plan_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? "border-primary bg-primary/5"
                      : "border-gray-700 hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {plan.title}
                      </h3>
                      <p className="text-gray-300">{plan.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gradient">
                        {plan.price.toLocaleString()} sats
                      </span>
                      {selectedPlan === key && (
                        <Check className="ml-2 w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPlan === "one-shot" && (
              <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-primary mr-2" />
                  <p className="text-gray-300">
                    {t("subscription_suggestion")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => setSelectedPlan("subscription")}
                >
                  {t("switch_to_subscription")}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="gradient"
              size="lg"
              className="w-full group"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? t("processing") : t("proceed_to_payment")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
