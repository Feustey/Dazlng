"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/app/contexts/AlertContext";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AuthForm() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const { showAlert } = useAlert();
  const t = useTranslations("Auth");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [nodePubkey, setNodePubkey] = useState("");
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
          nodePubkey: !isLogin && !showVerification ? nodePubkey : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      if (action === "register") {
        setShowVerification(true);
        showAlert(
          "success",
          "Super ! Vérifiez votre email pour finaliser votre inscription."
        );
      } else if (action === "verify") {
        showAlert("success", "Bienvenue dans la communauté DazNode ! 🎉");
        router.push(`/${locale}/dashboard`);
      } else if (action === "login") {
        showAlert("success", "Ravi de vous revoir ! 👋");
        router.push(`/${locale}/dashboard`);
      }
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {isLogin
            ? "Bon retour parmi nous !"
            : showVerification
              ? "Dernière étape !"
              : "Rejoignez l'aventure"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
            />
          </div>

          {!showVerification && !isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom"
              />
            </div>
          )}

          {!showVerification && (
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          )}

          {!isLogin && !showVerification && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nodePubkey">{t("nodePubkey")}</Label>
                <Input
                  id="nodePubkey"
                  type="text"
                  value={nodePubkey}
                  onChange={(e) => setNodePubkey(e.target.value)}
                  placeholder="03..."
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {t("nodePubkeyHelp")}
                </p>
              </div>
            </>
          )}

          {showVerification && (
            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Code de vérification
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                Vérifiez votre boîte mail, nous vous avons envoyé un code à 6
                chiffres
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 flex items-center justify-center gap-2 py-6"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {isLogin
                  ? "Se connecter"
                  : showVerification
                    ? "Finaliser l'inscription"
                    : "Créer mon compte"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {!showVerification && (
            <Button
              type="button"
              variant="ghost"
              className="w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Nouveau ? Créez votre compte"
                : "Déjà membre ? Connectez-vous"}
            </Button>
          )}
        </form>

        {!showVerification && !isLogin && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="text-blue-600 hover:underline">
              conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-blue-600 hover:underline">
              politique de confidentialité
            </a>
          </p>
        )}
      </motion.div>
    </div>
  );
}
