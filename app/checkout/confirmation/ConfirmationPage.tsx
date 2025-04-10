"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCheckoutData } from "@/app/hooks/useCheckoutData";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  params?: {
    sessionId?: string;
  };
}

export default function ConfirmationPage({
  params: pageParams,
}: ConfirmationPageProps) {
  const router = useRouter();
  const { checkoutData, clearCheckoutData } = useCheckoutData();
  const params = useParams();
  const locale = params?.locale as string | undefined;

  useEffect(() => {
    async function processOrder() {
      if (!checkoutData.delivery || !checkoutData.payment) {
        if (locale) {
          router.push(`/${locale}/checkout/delivery`);
        } else {
          router.push("/checkout/delivery");
        }
        return;
      }

      try {
        // Traitement de la commande
        await clearCheckoutData();
        if (locale) {
          router.push(`/${locale}/order-confirmation`);
        } else {
          router.push("/order-confirmation");
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la commande:", error);
      }
    }

    processOrder();
  }, [checkoutData, clearCheckoutData, router, locale]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Commande confirmée
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Votre commande a été traitée avec succès.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
