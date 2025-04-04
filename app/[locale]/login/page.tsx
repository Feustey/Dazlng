"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [pubkey, setPubkey] = useState("");
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes en secondes
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Générer un message unique pour la signature
    const generateMessage = async () => {
      const response = await fetch("/api/auth/generate-message");
      const data = await response.json();
      setMessage(data.message);
    };
    generateMessage();
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Régénérer un nouveau message si le temps est écoulé
      const generateMessage = async () => {
        const response = await fetch("/api/auth/generate-message");
        const data = await response.json();
        setMessage(data.message);
        setRemainingTime(300);
      };
      generateMessage();
    }
  }, [remainingTime]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t("messageCopied"));
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
      toast.error(t("error.copyFailed"));
    }
  };

  const handleSignIn = async () => {
    if (!signature || !pubkey) {
      toast.error(t("error.missingFields"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          signature,
          pubkey,
        }),
      });

      if (response.ok) {
        toast.success(t("signInSuccess"));
        router.push("/dashboard");
      } else {
        const data = await response.json();
        toast.error(t(`error.${data.error}`) || t("error.unknown"));
      }
    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
      toast.error(t("error.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card className="p-6 bg-card">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("signInWithLightning")}</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          {t("signInDescription")}{" "}
          <Link href="/help/signing" className="text-primary hover:underline">
            {t("howToSign")}
          </Link>
        </p>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-mono text-sm break-all">{message}</p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopy}
            disabled={isLoading}
          >
            {copied ? t("copied") : t("copy")}
          </Button>

          <Input
            placeholder={t("pastePubkey")}
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value)}
            className="w-full font-mono"
            disabled={isLoading}
          />

          <Input
            placeholder={t("pasteSignature")}
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full font-mono"
            disabled={isLoading}
          />

          <Button
            className="w-full"
            onClick={handleSignIn}
            disabled={!signature || !pubkey || remainingTime <= 0 || isLoading}
          >
            {isLoading ? t("signingIn") : t("signIn")}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            {t("timeRemaining")}: {formatTime(remainingTime)}
          </p>
        </div>
      </Card>
    </div>
  );
}
