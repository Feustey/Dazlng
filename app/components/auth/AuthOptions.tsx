"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AlbyLoginButton from "../AlbyLoginButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/use-toast";
import { Button } from "@/app/components/ui/button";

export default function AuthOptions() {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const { loginWithAlby } = useAuth();
  const { addToast } = useToast();

  const handleAlbyLogin = async () => {
    try {
      await loginWithAlby();
      addToast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
        type: "success",
      });
      if (locale) {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      addToast({
        title: "Erreur de connexion",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        type: "error",
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la connexion");
      }

      addToast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
        type: "success",
      });

      if (locale) {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      addToast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        type: "error",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {activeTab === "login" ? "Connexion" : "Inscription"}
        </CardTitle>
        <CardDescription className="text-center">
          {activeTab === "login"
            ? "Connectez-vous à votre compte"
            : "Créez votre compte pour accéder à toutes les fonctionnalités"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Connexion avec email
                  </span>
                </div>
              </div>
              <LoginForm />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou connectez-vous avec
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleLogin} className="w-full">
                Se connecter avec Alby
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Inscription avec email
                  </span>
                </div>
              </div>
              <RegisterForm />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou inscrivez-vous avec
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleAlbyLogin} className="w-full">
                Se connecter avec Alby
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
