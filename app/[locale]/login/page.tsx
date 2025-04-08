"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message] = useState("Connexion test en local");
  const [pubkey, setPubkey] = useState("");
  const [signature, setSignature] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler un délai de 5 secondes
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Simuler une connexion réussie
      const email = "test@example.com";
      const password = pubkey || "test_pubkey";
      await login(email, password);

      addToast({
        title: t("signInSuccess"),
        description: t("welcomeBack"),
      });

      router.push("/");
    } catch (error) {
      addToast({
        title: t("error.unknown"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("signInWithLightning")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="message">{t("howToSign")}</Label>
              <Input
                id="message"
                value={message}
                readOnly
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pubkey">{t("pastePubkey")}</Label>
              <Input
                id="pubkey"
                value={pubkey}
                onChange={(e) => setPubkey(e.target.value)}
                placeholder="npub..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">{t("pasteSignature")}</Label>
              <Input
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Signature..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
