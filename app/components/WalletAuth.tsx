"use client";

import * as React from "react";
import { WebLNProvider } from "@webbtc/webln-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    webln?: WebLNProvider;
  }
}

export default function WalletAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (!window.webln) {
          setError("Veuillez installer l'extension Alby pour continuer");
          return;
        }

        try {
          await window.webln.enable();
        } catch (error) {
          setError("Veuillez autoriser l'accès à votre portefeuille Alby");
          return;
        }

        const { node } = await window.webln.getInfo();
        const message = "Authentification DazLng " + new Date().toISOString();

        if (!window.webln.signMessage) {
          setError(
            "Votre portefeuille ne supporte pas la signature de messages"
          );
          return;
        }

        const { signature } = await window.webln.signMessage(message);

        // Vérifier si l'utilisateur a déjà payé
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

        if (response.ok) {
          const { redirectUrl } = await response.json();
          router.push(redirectUrl);
        } else {
          setError(
            "Veuillez d'abord effectuer un paiement pour accéder à cette fonctionnalité"
          );
        }
      } catch (err) {
        setError("Une erreur est survenue lors de l'authentification");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkWallet();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push("/bot-ia")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retour à la page de paiement
        </button>
      </div>
    );
  }

  return null;
}
