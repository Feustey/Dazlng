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
  const params = useParams();
  const locale = pathname.split("/")[1];
  const { showAlert } = useAlert();
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginWithAlby } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginWithAlby();
      router.push(`/${params.locale}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
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
                <img src="/alby-logo.svg" alt="Alby" className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Connexion en cours..." : "Se connecter avec Alby"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
