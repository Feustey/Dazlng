"use client";

import Button from '../../../components/shared/ui/Button';
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const passwordRequirements = [
  { regex: /.{8,}/, text: "Au moins 8 caractères" },
  { regex: /[A-Z]/, text: "Au moins une majuscule" },
  { regex: /[a-z]/, text: "Au moins une minuscule" },
  { regex: /[0-9]/, text: "Au moins un chiffre" },
  { regex: /[^A-Za-z0-9]/, text: "Au moins un caractère spécial" },
];

export default function AuthForm() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "fr";
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newsletter: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Fonction de validation d'email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fonction de validation de mot de passe
  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && value) {
      setErrors((prev) => ({
        ...prev,
        email: isValidEmail(value) ? "" : "Format d'email invalide",
      }));
    } else if (name === "password" && value) {
      setErrors((prev) => ({
        ...prev,
        password: isValidPassword(value)
          ? ""
          : "Le mot de passe doit contenir au moins 8 caractères",
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, newsletter: checked }));
  };

  const validateForm = () => {
    const newErrors = {
      email: !formData.email
        ? "L'email est requis"
        : !isValidEmail(formData.email)
          ? "Format d'email invalide"
          : "",
      password: !formData.password
        ? "Le mot de passe est requis"
        : !isValidPassword(formData.password)
          ? "Le mot de passe doit contenir au moins 8 caractères"
          : "",
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleContinueAsGuest = () => {
    if (formData.email && !isValidEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Veuillez entrer un email valide pour continuer",
      }));
      return;
    }
    router.push(`/${locale}/checkout/delivery`);
  };

  const handlePress = () => { handleSubmit(new Event('submit') as unknown as React.FormEvent); };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {t("error") || "Erreur l'authentification"}
          </div>
        )}
        <Button onPress={handlePress} disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter avec Alby"}
        </Button>
      </form>
    </div>
  );
}
