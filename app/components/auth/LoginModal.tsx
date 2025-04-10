"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AlbyLoginButton from "../AlbyLoginButton";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const params = useParams();
  const { loginWithAlby } = useAuth();
  const { addToast } = useToast();
  const t = useTranslations("Auth");

  const handleAlbyLogin = async () => {
    try {
      await loginWithAlby();
      addToast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
        type: "success",
      });
      onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? t("login") : t("register")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "login"
              ? t("loginDescription")
              : t("registerDescription")}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">{t("login")}</TabsTrigger>
            <TabsTrigger value="register">{t("register")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("loginWithAlby")}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <AlbyLoginButton onClick={handleAlbyLogin} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orLoginWithEmail")}
                </span>
              </div>
            </div>

            <LoginForm onSuccess={onClose} />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t("noAccount")} </span>
              <button
                onClick={() => setActiveTab("register")}
                className="text-primary hover:underline focus:outline-none"
              >
                {t("createAccount")}
              </button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("registerWithAlby")}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <AlbyLoginButton onClick={handleAlbyLogin} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orRegisterWithEmail")}
                </span>
              </div>
            </div>

            <RegisterForm onSuccess={onClose} />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {t("alreadyHaveAccount")}{" "}
              </span>
              <button
                onClick={() => setActiveTab("login")}
                className="text-primary hover:underline focus:outline-none"
              >
                {t("login")}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
