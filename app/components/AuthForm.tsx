"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/app/contexts/AlertContext";

export default function AuthForm() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = isLogin
        ? "login"
        : showVerification
          ? "verify"
          : "register";
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          email,
          password: !showVerification ? password : undefined,
          code: showVerification ? code : undefined,
          name: !isLogin && !showVerification ? name : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      if (action === "register") {
        setShowVerification(true);
        showAlert("success", "Code de vérification envoyé à votre email");
      } else if (action === "verify") {
        showAlert("success", "Email vérifié avec succès");
        document.cookie = `sessionId=${data.sessionId}; path=/`;
        router.push("/dashboard");
      } else if (action === "login") {
        showAlert("success", "Connexion réussie");
        document.cookie = `sessionId=${data.sessionId}; path=/`;
        router.push("/dashboard");
      }
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin
          ? "Connexion"
          : showVerification
            ? "Vérification"
            : "Inscription"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {!showVerification && !isLogin && (
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        {!showVerification && (
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {showVerification && (
          <div>
            <Label htmlFor="code">Code de vérification</Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "Chargement..."
            : isLogin
              ? "Se connecter"
              : showVerification
                ? "Vérifier"
                : "S'inscrire"}
        </Button>

        {!showVerification && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
          </Button>
        )}
      </form>
    </Card>
  );
}
