"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import DazIAProgressBar from "@/app/components/daz-ia/ProgressBar";
import Button from "@components/ui/button";
import { Check, ChevronLeft, Download } from "lucide-react";
import Card from "@/app/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { supabase } from "@/app/utils/supabase";
import { toast } from "sonner";

interface PlanData {
  plan: string;
  billingCycle: string;
  sats: number;
}

interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
}

interface OrderData {
  plan: PlanData;
  deliveryInfo: DeliveryInfo;
  sessionId: string;
}

export default function DazIACheckoutConfirmationPage() {
  const router = useRouter();
  const t = useTranslations("daz-ia-checkout");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isStoring, setIsStoring] = useState(true);

  const storeDataInSupabase = useCallback(
    async (
      planData: PlanData,
      deliveryInfo: DeliveryInfo,
      sessionId: string
    ) => {
      try {
        setIsStoring(true);

        // 1. Ajouter l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from("users")
          .upsert(
            {
              name: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
              email: deliveryInfo.email,
              phone: deliveryInfo.phone,
              company: deliveryInfo.company,
            },
            { onConflict: "email" }
          )
          .select();

        if (userError) throw userError;

        const userId = userData[0].id;

        // 2. Créer la commande
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            product_type: "daz-ia",
            plan: planData.plan,
            billing_cycle: planData.billingCycle,
            amount: planData.sats,
            payment_method: "lightning",
            payment_status: "paid",
          })
          .select();

        if (orderError) throw orderError;

        const orderId = orderData[0].id;

        // 3. Enregistrer le paiement
        const { error: paymentError } = await supabase.from("payments").insert({
          order_id: orderId,
          payment_hash: sessionId,
          amount: planData.sats,
          status: "success",
        });

        if (paymentError) throw paymentError;

        setIsStoring(false);
        toast.success(t("confirmation.success"));
      } catch (error) {
        console.error("Erreur lors de l'enregistrement dans Supabase:", error);
        setIsStoring(false);
        toast.error(t("confirmation.error"));
      }
    },
    [t]
  );

  useEffect(() => {
    // Récupérer les données de la commande depuis localStorage
    const storedPlan = localStorage.getItem("dazIAPlan");
    const storedDeliveryInfo = localStorage.getItem("dazIADeliveryInfo");
    const sessionId = localStorage.getItem("checkoutSessionId");

    if (storedPlan && storedDeliveryInfo) {
      const planData = JSON.parse(storedPlan) as PlanData;
      const deliveryInfo = JSON.parse(storedDeliveryInfo) as DeliveryInfo;

      setOrderData({
        plan: planData,
        deliveryInfo: deliveryInfo,
        sessionId: sessionId || "",
      });

      // Enregistrer les données dans Supabase
      storeDataInSupabase(planData, deliveryInfo, sessionId || "");
    }
  }, [storeDataInSupabase]);

  if (!orderData || isStoring) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p>{t("confirmation.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <DazIAProgressBar currentStep={4} />

      <Card className="mt-8">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 p-2 rounded-full w-12 h-12 flex items-center justify-center">
            <Check className="text-green-600 w-6 h-6" />
          </div>
          <CardTitle className="text-2xl">{t("confirmation.title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-xl font-medium">{t("confirmation.thanks")}</p>
            <p className="text-gray-500 mt-2">
              {t("confirmation.emailSent", {
                email: orderData.deliveryInfo.email,
              })}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("confirmation.backToHome")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
