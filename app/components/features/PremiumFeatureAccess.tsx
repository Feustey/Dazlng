"use client";

import Button from "./ui/button";
import Card from "./ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

interface PremiumFeatureAccessProps {
  nodeId?: string;
  featureName: string;
}

export default function PremiumFeatureAccess({
  nodeId,
  featureName,
}: PremiumFeatureAccessProps) {
  const t = useTranslations("components.premiumAccess");
  const router = useRouter();
  const { data: session } = useSession();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [hasOneTimeAccess, setHasOneTimeAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur a un abonnement ou un accès ponctuel
    async function checkAccess() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Vérifier l'abonnement
        const subsResponse = await fetch("/api/user/subscription");
        const subsData = await subsResponse.json();
        setHasSubscription(subsData.hasActiveSubscription || false);

        // Vérifier l'accès ponctuel si un nodeId est fourni
        if (nodeId) {
          const oneTimeResponse = await fetch(
            `/api/user/one-time-access?nodeId=${nodeId}`
          );
          const oneTimeData = await oneTimeResponse.json();
          setHasOneTimeAccess(oneTimeData.hasAccess || false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'accès:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [session, nodeId]);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  const handleLoginClick = () => {
    router.push("/auth/signin");
  };

  // Rediriger vers la page d'abonnement
  const handleSubscribeClick = () => {
    router.push("/pricing");
  };

  // Rediriger vers la page d'achat d'accès ponctuel
  const handleBuyOneTimeClick = () => {
    if (nodeId) {
      router.push(`/node/${nodeId}/purchase-recommendations`);
    } else {
      router.push("/pricing");
    }
  };

  if (loading) {
    return (
      <Card className="p-6 text-center animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
        <div className="flex justify-center space-x-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </Card>
    );
  }

  // Si l'utilisateur a un abonnement ou un accès ponctuel, ne pas afficher cette barrière
  if (hasSubscription || hasOneTimeAccess) {
    return null;
  }

  return (
    <Card className="p-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <h3 className="text-xl font-bold mb-2 text-center text-amber-700 dark:text-amber-500">
        {t("title")}
      </h3>

      <p className="mb-4 text-center">
        {nodeId
          ? t("messageOneTime", { featureName })
          : t("messageSubscription", { featureName })}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        {!session?.user && (
          <Button variant="outline" onClick={handleLoginClick}>
            {t("loginButton")}
          </Button>
        )}

        {session?.user && nodeId && (
          <Button variant="secondary" onClick={handleBuyOneTimeClick}>
            {t("buyOneTimeButton")}
          </Button>
        )}

        <Button onClick={handleSubscribeClick}>{t("subscribeButton")}</Button>
      </div>
    </Card>
  );
}
