"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Temporairement commenter ce composant qui semble ne pas exister
// import OrderStatus from "@/components/payment/OrderStatus";

interface PageProps {
  params: {
    locale: string;
    pageId: string;
  };
}

export default function Page({ params: { locale, pageId } }: PageProps) {
  const router = useRouter();
  const t = useTranslations("Orders");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${pageId}`);
        if (!response.ok) {
          throw new Error(t("errors.notFound"));
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.unknown"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [pageId, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  {t("errors.title")}
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button
                  onClick={() => router.push(`/${locale}/dashboard`)}
                  variant="outline"
                >
                  {t("actions.backToDashboard")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("details.title", { id: pageId })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <OrderStatus id={pageId} /> */}
              <p>ID: {pageId}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
