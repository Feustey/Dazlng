"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import AlbyLoginButton from "@/app/components/AlbyLoginButton";

export default function SignIn() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous avec votre wallet Alby pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlbyLoginButton />
        </CardContent>
      </Card>
    </div>
  );
}
