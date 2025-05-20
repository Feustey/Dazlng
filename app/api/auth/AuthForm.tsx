"use client";

import Button from '../../../components/shared/ui/Button';
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AuthForm(): React.ReactElement {
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handlePress = (): void => { handleSubmit(new Event('submit') as unknown as React.FormEvent); };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {t("error") || "Erreur l'authentification"}
          </div>
        )}
        <Button onClick={handlePress} disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter avec Alby"}
        </Button>
      </form>
    </div>
  );
}
