"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { useLocale } from 'next-intl';

function AuthErrorContent(): JSX.Element {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const locale = useLocale();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Erreur d'authentification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Impossible de vous connecter. Veuillez réessayer.
            </p>
            <Link
              href="/auth/login"
              locale={locale}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Retour à la connexion
            </Link>
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
