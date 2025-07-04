"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";

export const dynamic = "force-dynamic";

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
    <div>
      <div>
        <div>
          <h2>
            Erreur d'authentification
          </h2>
          <p>
            {getErrorMessage(error)}
          </p>
        </div>
        <div>
          <div>
            <p>
              Impossible de vous connecter. Veuillez réessayer.
            </p>
            <Link href="/auth/login">
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
