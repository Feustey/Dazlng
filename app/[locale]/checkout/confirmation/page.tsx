"use client";

export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Check, Clock, Mail, HelpCircle, ChevronLeft } from "lucide-react";

export default function ConfirmationPage() {
  const t = useTranslations("Checkout.Confirmation");
  const params = useParams();
  const locale = params?.locale as string;
  const router = useRouter();
  const orderNumber =
    "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const orderDate = new Date().toLocaleDateString();
  const userEmail = "user@example.com"; // À remplacer par l'email réel de l'utilisateur

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {t("thankYou")}
        </h1>
        <p className="text-muted-foreground">{t("orderProcessing")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-glass border-accent/20 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">{t("orderSummary")}</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-accent/10">
              <div>
                <p className="font-medium">{t("daznode")}</p>
                <p className="text-sm text-muted-foreground">×1</p>
              </div>
              <p className="font-semibold">400,000 sats</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold">{t("total")}</p>
              <p className="text-xl font-bold text-primary">400,000 sats</p>
            </div>
          </div>
        </Card>

        <Card className="card-glass border-accent/20 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">{t("orderNumber")}</h2>
          <div className="space-y-4">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">{orderDate}</span>
            </div>
            <p className="font-mono text-sm bg-card/50 p-2 rounded-md border border-accent/10">
              {orderNumber}
            </p>
          </div>
        </Card>

        <Card className="card-glass border-accent/20 p-6 backdrop-blur-sm md:col-span-2">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">
                {t("setupInstructions")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("emailConfirmation")}{" "}
                <span className="font-medium">{userEmail}</span>
              </p>
              <p className="text-sm text-muted-foreground">{t("setupGuide")}</p>
            </div>
          </div>
        </Card>

        <Card className="card-glass border-accent/20 p-6 backdrop-blur-sm md:col-span-2">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-3">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">{t("questions")}</h2>
              <p className="text-muted-foreground mb-4">{t("support")}</p>
              <Button
                variant="outline"
                className="border-accent/20 hover:bg-accent/10"
                onClick={() => {
                  /* Ajouter la logique pour contacter le support */
                }}
              >
                {t("contactSupport")}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push(`/${locale}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("backToDashboard")}
        </Button>
      </div>
    </div>
  );
}
