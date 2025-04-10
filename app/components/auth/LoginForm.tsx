"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onSuccess) onSuccess();
        if (locale) {
          router.push(`/${locale}/dashboard`);
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error(data.error || "Erreur de connexion");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="votre@email.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" className="w-full">
        Se connecter
      </Button>
    </form>
  );
}
