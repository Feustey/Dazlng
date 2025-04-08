"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const locale = pathname.split("/")[1];
  const { showAlert } = useAlert();
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const { login, register, verify } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  useEffect(() => {
    if (formData.password) {
      const strength = passwordRequirements.filter((req) =>
        req.regex.test(formData.password)
      ).length;
      setPasswordStrength((strength / passwordRequirements.length) * 100);
    }
  }, [formData.password]);

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};

    if (name === "email") {
      if (!value) {
        errors.email = "L'email est requis";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = "Format d'email invalide";
      }
    }

    if (name === "password") {
      if (!value) {
        errors.password = "Le mot de passe est requis";
      } else if (passwordStrength < 60) {
        errors.password = "Le mot de passe est trop faible";
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        errors.confirmPassword = "La confirmation est requise";
      } else if (value !== formData.password) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    if (name === "verificationCode") {
      if (!value) {
        errors.verificationCode = "Le code est requis";
      } else if (!/^\d{6}$/.test(value)) {
        errors.verificationCode = "Le code doit contenir 6 chiffres";
      }
    }

    setValidationErrors((prev) => ({ ...prev, [name]: errors[name] }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (activeTab === "login") {
        if (
          !validateField("email", formData.email) ||
          !validateField("password", formData.password)
        ) {
          throw new Error("Veuillez corriger les erreurs de validation");
        }
        await login(formData.email, formData.password);
        router.push("/dashboard");
      } else if (activeTab === "register") {
        if (
          !validateField("email", formData.email) ||
          !validateField("password", formData.password) ||
          !validateField("confirmPassword", formData.confirmPassword)
        ) {
          throw new Error("Veuillez corriger les erreurs de validation");
        }
        await register(formData.email, formData.password);
        setActiveTab("verify");
      } else if (activeTab === "verify") {
        if (
          !validateField("email", formData.email) ||
          !validateField("verificationCode", formData.verificationCode)
        ) {
          throw new Error("Veuillez corriger les erreurs de validation");
        }
        await verify(formData.email, formData.verificationCode);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger
          value="login"
          className="data-[state=active]:bg-primary/10 transition-all duration-300"
        >
          <Mail className="w-4 h-4 mr-2" />
          Connexion
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="data-[state=active]:bg-primary/10 transition-all duration-300"
        >
          <Lock className="w-4 h-4 mr-2" />
          Inscription
        </TabsTrigger>
        <TabsTrigger
          value="verify"
          className="data-[state=active]:bg-primary/10 transition-all duration-300"
        >
          <Shield className="w-4 h-4 mr-2" />
          Vérification
        </TabsTrigger>
      </TabsList>

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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.email ? "border-destructive" : ""
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.password ? "border-destructive" : ""
                  }`}
                />
                {formData.password && (
                  <div className="space-y-2">
                    <Progress value={passwordStrength} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.regex.test(formData.password) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-destructive" />
                          )}
                          <span className="text-muted-foreground">
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {validationErrors.password && (
                  <p className="text-sm text-destructive">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.email ? "border-destructive" : ""
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.password ? "border-destructive" : ""
                  }`}
                />
                {formData.password && (
                  <div className="space-y-2">
                    <Progress value={passwordStrength} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.regex.test(formData.password) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-destructive" />
                          )}
                          <span className="text-muted-foreground">
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {validationErrors.password && (
                  <p className="text-sm text-destructive">
                    {validationErrors.password}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.confirmPassword ? "border-destructive" : ""
                  }`}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="verify" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-email">Email</Label>
                <Input
                  id="verify-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 ${
                    validationErrors.email ? "border-destructive" : ""
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-code">Code de vérification</Label>
                <Input
                  id="verification-code"
                  name="verificationCode"
                  type="text"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  required
                  className={`transition-all duration-300 focus:ring-2 focus:ring-primary/20 text-center tracking-widest ${
                    validationErrors.verificationCode
                      ? "border-destructive"
                      : ""
                  }`}
                  placeholder="000000"
                  maxLength={6}
                />
                {validationErrors.verificationCode && (
                  <p className="text-sm text-destructive">
                    {validationErrors.verificationCode}
                  </p>
                )}
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Vérifiez votre boîte mail, nous vous avons envoyé un code à 6
                  chiffres
                </p>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 text-white transition-all duration-300 group"
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
          {activeTab === "login" && "Se connecter"}
          {activeTab === "register" && "S'inscrire"}
          {activeTab === "verify" && "Vérifier"}
        </Button>
      </form>
    </Tabs>
  );
}
