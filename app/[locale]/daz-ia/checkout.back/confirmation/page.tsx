"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCheckoutData } from "@/app/hooks/useCheckoutData";
import DazIAProgressBar from "@/app/components/daz-ia/ProgressBar";
import { Button } from "@components/ui/button";
import { Check, ChevronLeft, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { formatPrice } from "@/app/lib/utils";

export default function DazIACheckoutConfirmationPage() {
  const router = useRouter();
  const t = useTranslations("daz-ia-checkout");
  const [orderData, setOrderData] = useState<{
    plan: string;
    billingCycle: string;
    price: number;
    deliveryInfo: {
      name: string;
      email: string;
    };
  } | null>(null);

  useEffect(() => {
    // Récupérer les données de la commande depuis localStorage
    const storedOrderData = localStorage.getItem("dazIAOrderData");
    if (storedOrderData) {
      try {
        setOrderData(JSON.parse(storedOrderData));
      } catch (error) {
        console.error("Failed to parse order data", error);
      }
    }
  }, []);

  if (!orderData) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p>{t("confirmation.loading")}</p>
        </div>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    // Logique pour télécharger la facture
    alert(t("confirmation.invoice-download-started"));
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="container py-10">
      <DazIAProgressBar currentStep={4} />

      <div className="max-w-3xl mx-auto mt-12">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center bg-green-50 dark:bg-green-900/20 rounded-t-lg">
            <div className="mx-auto mb-4 bg-green-100 dark:bg-green-800 w-16 h-16 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-300">
              {t("confirmation.thank-you")}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              {t("confirmation.order-processed")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">
                  {t("confirmation.order-details")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    {t("confirmation.plan")}
                  </div>
                  <div className="text-sm font-medium">{orderData.plan}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("confirmation.billing-cycle")}
                  </div>
                  <div className="text-sm font-medium">
                    {orderData.billingCycle}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("confirmation.price")}
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(orderData.price)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("confirmation.delivery-info")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    {t("confirmation.name")}
                  </div>
                  <div className="text-sm font-medium">
                    {orderData.deliveryInfo.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("confirmation.email")}
                  </div>
                  <div className="text-sm font-medium">
                    {orderData.deliveryInfo.email}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleBackToHome}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("confirmation.back-to-home")}
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleDownloadInvoice}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("confirmation.download-invoice")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
