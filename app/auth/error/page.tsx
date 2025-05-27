"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthErrorContent(): JSX.Element {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const getErrorMessage = (errorCode: string | null): string => {
    switch (errorCode) {
      case "Configuration":
        return "Erreur de configuration du serveur.";
      case "AccessDenied":
        return "Accès refusé. Vérifiez vos permissions.";
      case "Verification":
        return "Le lien de vérification a expiré ou est invalide.";
      case "Default":
      default:
        return "Une erreur s'est produite lors de la connexion.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur d'authentification
          </h1>
          <p className="text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>
          <div className="space-y-3">
            <a
              href="/auth/login"
              className="block w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Réessayer la connexion
            </a>
            <a
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
} 