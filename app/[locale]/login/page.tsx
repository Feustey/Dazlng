"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAlbyLogin = () => {
    // TODO: Implémenter la connexion avec Alby
    console.log("Connexion avec Alby");
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la connexion par email
    console.log("Connexion avec email:", email, password);
  };

  return (
    <div className="min-h-[600px] w-full max-w-md mx-auto p-6 bg-card/80 backdrop-blur-lg rounded-xl border border-accent/20 shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-8 gradient-text">
        {t("connexion")}
      </h2>

      {/* Connexion Alby */}
      <div className="mb-8">
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
          {t("connexionAlby")}
        </h3>
        <button
          onClick={handleAlbyLogin}
          className="w-full btn-gradient py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("connectWithAlby")}
        </button>
      </div>

      {/* Séparateur */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-accent/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card/80 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>

      {/* Connexion Email */}
      <div>
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
          {t("connexionEmail")}
        </h3>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 bg-card/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className="w-full px-4 py-3 bg-card/50 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200"
          >
            {t("login")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push(`/${locale}/register`)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("noAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
