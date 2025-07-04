"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export default function CheckoutSuccess() {
  const { t } = useAdvancedTranslation("success");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const saveOrder = async (): Promise<void> => {
      try {
        // Récupérer les données stockées dans la page précédente
        const orderDataString = sessionStorage.getItem("dazbox_order_data");
        if (!orderDataString) {
          console.error("Aucune donnée de commande trouvée");
          setIsLoading(false);
          return;
        }
        
        const orderData = JSON.parse(orderDataString);
        
        // Mettre à jour le statut du paiement
        orderData.payment_status = "completed";
        
        // Préparer les en-têtes avec le token d'authentification si disponible
        const headers: HeadersInit = { 
          "Content-Type": "application/json"
        };
        
        if (orderData.token) {
          headers["Authorization"] = `Bearer ${orderData.token}`;
          // Supprimer le token des données à envoyer
          delete orderData.token;
        }
        
        // Convertir metadata en chaîne JSON si c'est un objet
        if (typeof orderData.metadata === "object") {
          orderData.metadata = JSON.stringify(orderData.metadata);
        }
        
        // Enregistrer la commande en base de données
        const res = await fetch("/api/orders", {
          method: "POST",
          headers,
          body: JSON.stringify(orderData)
        });
        
        if (!res.ok) {
          const errorData = await res.text();
          console.error("Erreur lors de l'enregistrement de la commande:", errorData);
          setError("Erreur lors de l'enregistrement de la commande");
        } else {
          // Nettoyer les données temporaires
          sessionStorage.removeItem("dazbox_order_data");
        }
      } catch (err) {
        console.error("Exception lors de l'enregistrement de la commande:", err);
        setError("Une erreur est survenue lors de l'enregistrement de votre commande");
      } finally {
        setIsLoading(false);
      }
    };
    
    saveOrder();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto">
            <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">{t("checkout.finalisation_de_votre_commande")}</h1>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t("checkout.erreur_lors_de_lenregistrement")}</h1>
          <p className="text-red-300 mb-6">{error}</p>
          <p className="text-white mb-6">{t("checkout.votre_paiement_a_bien_ete_recu")}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-300"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{t("checkout.paiement_reussi")}</h1>
        <p className="text-green-300 mb-6">{t("checkout.votre_commande_a_ete_confirmee")}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-300"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";