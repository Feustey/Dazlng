"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAlert } from "../contexts/AlertContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Shield, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Icons } from "./ui/icons";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import Image from "next/image";

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

// Fonction de validation d'email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction de validation de mot de passe
const isValidPassword = (password: string) => {
  return password.length >= 8;
};

export default function AuthForm() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = pathname?.split("/")[1] || "fr";
  const { showAlert } = useAlert();
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginWithAlby } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newsletter: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginWithAlby();
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
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
        ? "L&apos;email est requis"
        : !isValidEmail(formData.email)
          ? "Format d&apos;email invalide"
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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await loginWithAlby();
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
      showAlert(
        "error",
        "Erreur lors de la création du compte. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Connexion avec Alby</CardTitle>
          <CardDescription>
            Connectez-vous en utilisant votre wallet Alby
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Image
                  src="/alby-logo.svg"
                  alt="Alby"
                  width={20}
                  height={20}
                  className="mr-2 h-4 w-4"
                />
              )}
              {isLoading ? "Connexion en cours..." : "Se connecter avec Alby"}
            </Button>
          </form>
          <div className="text-red-500 text-sm mt-2">
            {t("error") || "Erreur l&apos;authentification"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
