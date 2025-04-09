"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCheckoutSession } from "../../hooks/useCheckoutSession";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentPageProps {
  params: {
    sessionId: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const localeParams = useParams();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    session,
    error,
    isLoading: isSessionLoading,
  } = useCheckoutSession(params.sessionId);

  useEffect(() => {
    if (error) {
      addToast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors du chargement de la session de paiement.",
        type: "error",
      });
      router.push(`/${localeParams.locale}/checkout`);
    }
  }, [error, router, addToast, localeParams.locale]);

  const handlePayment = async () => {
    if (!session?.paymentUrl) return;
    setIsLoading(true);
    window.location.href = session.paymentUrl;
  };

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Paiement</CardTitle>
          <CardDescription>
            Montant à payer : {session.amount} sats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Vous allez être redirigé vers la page de paiement. Veuillez ne pas
            fermer cette fenêtre.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !session.paymentUrl}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </>
            ) : (
              "Payer maintenant"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
