"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useParams } from "next/navigation";

interface OrderDetails {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderConfirmationPage() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = searchParams.get("orderId");
        if (!orderId) {
          setError(t("errors.noOrderId"));
          return;
        }

        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(t("errors.fetchFailed"));
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.unknown"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams, t]);

  if (loading) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                {t("errors.title")}
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => router.push(`/${params.locale}/checkout`)}
                variant="outline"
              >
                {t("actions.backToCheckout")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("confirmation.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("confirmation.orderDetails")}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {t("confirmation.orderId")}
                  </span>
                  <span className="text-sm font-medium">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {t("confirmation.date")}
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {t("confirmation.status")}
                  </span>
                  <span className="text-sm font-medium">
                    {orderDetails.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("confirmation.items")}
              </h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {t("confirmation.quantity")}: {item.quantity}
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  {t("confirmation.total")}
                </span>
                <span className="text-sm font-medium">
                  {orderDetails.total.toFixed(2)} €
                </span>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={() =>
                  router.push(`/${params.locale}/orders/${orderDetails.id}`)
                }
              >
                {t("actions.viewOrder")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
