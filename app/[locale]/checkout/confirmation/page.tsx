"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/app/utils/supabase";
import { Check } from "lucide-react";
import Button from "@/app/components/ui/button";
import { toast } from "sonner";

interface ShippingInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface OrderData {
  shipping: ShippingInfo;
  paymentHash: string;
}

interface SupabaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface SupabaseOrder {
  id: string;
  user_id: string;
  product_type: string;
  amount: number;
  payment_method: string;
  payment_status: string;
}

export default function CheckoutConfirmationPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Confirmation");
  const [isStoring, setIsStoring] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const storeDataInSupabase = useCallback(
    async (shippingInfo: ShippingInfo, paymentHash: string) => {
      try {
        setIsStoring(true);

        // 1. Ajouter l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from("users")
          .upsert(
            {
              name: shippingInfo.name,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
            },
            { onConflict: "email" }
          )
          .select()
          .single();

        if (userError)
          throw new Error(`Erreur utilisateur: ${userError.message}`);

        const userId = (userData as SupabaseUser).id;

        // 2. Créer la commande
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            product_type: "dazenode",
            amount: 400000,
            payment_method: "lightning",
            payment_status: "paid",
          })
          .select()
          .single();

        if (orderError)
          throw new Error(`Erreur commande: ${orderError.message}`);

        const orderId = (orderData as SupabaseOrder).id;

        // 3. Enregistrer la livraison
        const { error: deliveryError } = await supabase
          .from("deliveries")
          .insert({
            order_id: orderId,
            address: shippingInfo.address,
            city: shippingInfo.city,
            zip_code: shippingInfo.zipCode,
            country: shippingInfo.country,
            shipping_status: "pending",
          });

        if (deliveryError)
          throw new Error(`Erreur livraison: ${deliveryError.message}`);

        // 4. Enregistrer le paiement
        const { error: paymentError } = await supabase.from("payments").insert({
          order_id: orderId,
          payment_hash: paymentHash,
          amount: 400000,
          status: "success",
        });

        if (paymentError)
          throw new Error(`Erreur paiement: ${paymentError.message}`);

        setIsStoring(false);
        toast.success(t("success"));
      } catch (error) {
        console.error("Erreur lors de l'enregistrement dans Supabase:", error);
        setIsStoring(false);
        toast.error(t("error.storing"));
      }
    },
    [t]
  );

  useEffect(() => {
    const shippingInfo = localStorage.getItem("shippingInfo");
    const paymentHash = localStorage.getItem("paymentHash");

    if (shippingInfo && paymentHash) {
      try {
        const parsedShippingInfo = JSON.parse(shippingInfo) as ShippingInfo;
        setOrderData({
          shipping: parsedShippingInfo,
          paymentHash,
        });

        storeDataInSupabase(parsedShippingInfo, paymentHash);
      } catch (error) {
        console.error("Erreur lors du parsing des données:", error);
        toast.error(t("error.parsing"));
      }
    }
  }, [storeDataInSupabase, t]);

  if (!orderData || isStoring) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p>{t("orderProcessing")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Check className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-xl mt-2">{t("thankYou")}</p>
          <p className="text-gray-600 mt-2">
            {t("emailConfirmation")} {orderData.shipping.email}
          </p>
        </div>

        <div className="border-t border-b py-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">{t("orderSummary")}</h2>
          <div className="flex justify-between mb-2">
            <span>{t("product")}</span>
            <span>{t("daznode")}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>{t("quantity")}</span>
            <span>1</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>{t("total")}</span>
            <span>400,000 sats</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-4">{t("deliveryAddress")}</h2>
          <p>{orderData.shipping.name}</p>
          <p>{orderData.shipping.address}</p>
          <p>
            {orderData.shipping.city}, {orderData.shipping.zipCode}
          </p>
          <p>{orderData.shipping.country}</p>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => router.push("/")} className="px-6 py-2">
            {t("backToDashboard")}
          </Button>
        </div>
      </div>
    </div>
  );
}
