"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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

export const dynamic = "force-dynamic";

interface PaymentPageProps {
  params: {
    sessionId: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const localeParams = useParams();
  const locale = localeParams?.locale as string | undefined;
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
      if (locale) {
        router.push(`/${locale}/checkout`);
      } else {
        router.push("/checkout");
      }
    }
  }, [error, router, addToast, locale]);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      if (!session?.paymentUrl) return;
      window.location.href = session.paymentUrl;
    } catch (err) {
      addToast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Paiement</CardTitle>
          <CardDescription>
            Finalisez votre commande en effectuant le paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session?.amount && (
            <p className="text-lg font-semibold">
              Montant à payer : {session.amount} sats
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !session?.paymentUrl}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Payer maintenant
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
