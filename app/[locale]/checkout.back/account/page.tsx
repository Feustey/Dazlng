"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Input, Card, Checkbox } from "@/components/ui";
import { useParams } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const t = useTranslations("Checkout.Account");
  const params = useParams();
  const locale = params?.locale as string;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newsletter: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, newsletter: checked }));
  };

  const handleCreateAccount = (e: FormEvent) => {
    e.preventDefault();
    // Ici vous pourriez enregistrer les informations du compte
    // puis naviguer à la page de livraison
    console.log("Création du compte:", formData);
    router.push(`/${locale}/checkout/delivery`);
  };

  const handleContinueAsGuest = () => {
    // Naviguer directement à la page de livraison
    router.push(`/${locale}/checkout/delivery`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2 gradient-text">{t("title")}</h1>
      <p className="text-muted-foreground mb-6">{t("subtitle")}</p>

      <Card className="card-glass border-accent/20 p-6 backdrop-blur-sm mb-6">
        <form
          onSubmit={handleCreateAccount}
          className="animate-slide-up space-y-6"
        >
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t("email")}
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                className="pl-10 bg-card/50 border-accent/20 focus:border-primary/50 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="newsletter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("newsletterOptin")}
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <a href="#" className="text-primary hover:underline">
                {t("login")}
              </a>
            </p>
            <Button
              type="submit"
              className="btn-gradient py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              {t("createAccount")}
            </Button>
          </div>
        </form>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleContinueAsGuest}
          variant="outline"
          className="border-accent/20 hover:bg-accent/10"
        >
          {t("continueAsGuest")}
        </Button>
      </div>
    </div>
  );
}
