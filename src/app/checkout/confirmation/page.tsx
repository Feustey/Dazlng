"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutSession } from "../../../hooks/useCheckoutSession";
import { createOrder } from "../../../services/order";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ConfirmationPage() {
  const router = useRouter();
  const { checkoutData, clearCheckoutData } = useCheckoutSession();

  useEffect(() => {
    async function processOrder() {
      if (!checkoutData.delivery || !checkoutData.payment) {
        router.push("/checkout/delivery");
        return;
      }

      try {
        const order = await createOrder({
          customerName: `${checkoutData.delivery.firstName} ${checkoutData.delivery.lastName}`,
          deliveryAddress: {
            ...checkoutData.delivery,
            email: checkoutData.payment.email,
          },
          deliveryOption: {
            name:
              checkoutData.delivery.deliveryOption === "standard"
                ? "Livraison standard"
                : "Livraison express",
            estimatedDays:
              checkoutData.delivery.deliveryOption === "standard"
                ? "3-5 jours"
                : "1-2 jours",
            price:
              checkoutData.delivery.deliveryOption === "standard" ? 5.99 : 9.99,
          },
          total: checkoutData.payment.total,
        });

        // Nettoyer les données de la session
        clearCheckoutData();

        // Rediriger vers la page de suivi
        router.push(`/order/${order.orderNumber}`);
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
        // Gérer l'erreur (afficher un message, rediriger vers une page d'erreur, etc.)
      }
    }

    processOrder();
  }, [checkoutData, clearCheckoutData, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Commande confirmée !
        </h2>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Merci pour votre commande de DazNode.
          </p>

          <div className="border-t border-gray-200 py-4">
            <p className="text-gray-600 mb-4">
              Votre commande sera préparée et expédiée dans un délai de 2 à 3
              semaines.
            </p>

            <p className="text-gray-600">
              Vous recevrez un email dès que votre DazNode sera expédié, avec le
              numéro de suivi de votre colis.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour à l'accueil
          </button>

          <p className="text-sm text-gray-500">
            Si vous avez des questions, n'hésitez pas à nous contacter à
            support@daznode.com
          </p>
        </div>
      </div>
    </div>
  );
}
