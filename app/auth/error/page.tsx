"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  missing_params: "Paramètres manquants dans la requête",
  callback_error: "Erreur lors du callback d'authentification",
  default: "Une erreur est survenue lors de l'authentification",
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "default";
  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Erreur d'authentification</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/signin">Réessayer</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
