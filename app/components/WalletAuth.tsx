"use client";

import * as React from "react";
import { WebLNProvider } from "@webbtc/webln-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

declare global {
  interface Window {
    webln?: WebLNProvider;
  }
}

export default function WalletAuth() {
  const router = useRouter();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      console.log("=== WalletAuth Debug ===");
      console.log("Locale actuelle:", locale);
      console.log("État initial:", { isLoading, error });

      try {
        if (!window.webln) {
          console.log("Extension Alby non détectée");
          setError("Veuillez installer l'extension Alby pour continuer");
          return;
        }

        console.log("Tentative d'activation de l'extension Alby");
        try {
          await window.webln.enable();
          console.log("Extension Alby activée avec succès");
        } catch (error) {
          console.error("Erreur lors de l'activation de l'extension:", error);
          setError("Veuillez autoriser l'accès à votre portefeuille Alby");
          return;
        }

        console.log("Récupération des informations du nœud");
        const { node } = await window.webln.getInfo();
        console.log("Informations du nœud:", node);

        const message = "Authentification DazNode " + new Date().toISOString();
        console.log("Message à signer:", message);

        if (!window.webln.signMessage) {
          console.log("La signature de messages n'est pas supportée");
          setError(
            "Votre portefeuille ne supporte pas la signature de messages"
          );
          return;
        }

        console.log("Tentative de signature du message");
        const { signature } = await window.webln.signMessage(message);
        console.log("Message signé avec succès");

        console.log("Vérification du paiement");
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pubkey: node.pubkey,
            signature,
            message,
          }),
        });

        console.log("Statut de la réponse:", response.status);
        if (response.ok) {
          const { redirectUrl } = await response.json();
          console.log("Redirection vers:", redirectUrl);
          router.push(`/${locale}${redirectUrl}`);
        } else {
          console.log("Paiement non vérifié");
          setError(
            "Veuillez d'abord effectuer un paiement pour accéder à cette fonctionnalité"
          );
        }
      } catch (err) {
        console.error("Erreur générale:", err);
        setError("Une erreur est survenue lors de l'authentification");
      } finally {
        console.log("Fin du processus d'authentification");
        setIsLoading(false);
      }
    };

    checkWallet();
  }, [router, locale]);

  if (isLoading) {
    console.log("Affichage du loader");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.log("Affichage de l'erreur:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push(`/${locale}/bot-ia`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retour à la page de paiement
        </button>
      </div>
    );
  }

  console.log("Rendu null (authentification réussie)");
  return null;
}
