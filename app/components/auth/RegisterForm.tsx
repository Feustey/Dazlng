"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await register(
        formData.get("email") as string,
        formData.get("password") as string,
        formData.get("name") as string
      );
      handleSuccess();
    } catch (error) {
      // L'erreur est déjà gérée par le contexte d'authentification
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (locale) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Votre nom"
        />
      </div>
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
        S'inscrire
      </Button>
    </form>
  );
}
