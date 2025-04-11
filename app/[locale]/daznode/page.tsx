"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/components/layout/PageContainer";
import Card from "@/app/components/ui/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import {
  ArrowRight,
  Zap,
  Shield,
  Settings,
  Package,
  Bitcoin,
  Globe,
  CheckCircle2,
  Clock,
  Gift,
} from "lucide-react";
import { useState } from "react";

export default function DaznodePage() {
  const t = useTranslations("daznode");
  const router = useRouter();
  const [language, setLanguage] = useState<"fr" | "en">("fr");

  const features = [
    {
      icon: <Package className="w-8 h-8 text-primary" />,
      title: t("package.question"),
      description: t("package.answer"),
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Nœud Lightning Pré-configuré",
      description:
        "Prêt à l'emploi avec LND, 50 000 sats pré-chargés et interface de gestion intuitive.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Sécurité Garantie",
      description:
        "Boîtier sécurisé, refroidissement optimisé et protection contre les surtensions.",
    },
  ];

  const pricing = [
    {
      name: "Dazbox Basic",
      price: "299€",
      features: [
        "Nœud Lightning pré-configuré",
        "50 000 sats pré-chargés",
        "Interface de gestion",
        "Support technique",
      ],
      popular: false,
    },
    {
      name: "Dazbox Pro",
      price: "499€",
      features: [
        "Tout ce qui est inclus dans Basic",
        "100 000 sats pré-chargés",
        "Support prioritaire",
        "Accès aux fonctionnalités avancées",
      ],
      popular: true,
    },
    {
      name: "Dazbox Enterprise",
      price: "999€",
      features: [
        "Tout ce qui est inclus dans Pro",
        "500 000 sats pré-chargés",
        "Support 24/7",
        "Configuration personnalisée",
      ],
      popular: false,
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <PageContainer
      title="Daznode"
      subtitle="La solution complète pour gérer votre nœud Lightning Network"
    >
      {/* Section principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card
          gradient
          className="p-8 hover:scale-[1.02] transition-transform duration-300"
        >
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gradient">
              Commencez Maintenant
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Obtenez votre Dazbox et rejoignez le réseau Lightning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg text-gray-300">
                    Prix à partir de{" "}
                    <span className="text-gradient font-bold text-3xl">
                      299€
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">Livraison gratuite</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-lg text-gray-300">
                    Livraison en{" "}
                    <span className="text-gradient font-bold">2-3 jours</span>
                  </p>
                  <p className="text-sm text-gray-400">En stock</p>
                </div>
              </div>
              <Button variant="gradient" size="lg" className="w-full text-lg">
                Commander Maintenant <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          gradient
          className="p-8 hover:scale-[1.02] transition-transform duration-300"
        >
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gradient">
              Statistiques du Réseau
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Découvrez la puissance du réseau Lightning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Nœuds Totaux</p>
                <p className="text-4xl font-bold text-gradient">10,000+</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Canaux Actifs</p>
                <p className="text-4xl font-bold text-gradient">50,000+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section des tarifs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {pricing.map((plan, index) => (
          <Card
            key={index}
            className={`p-6 hover:scale-[1.02] transition-transform duration-300 ${
              plan.popular ? "border-2 border-primary" : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gradient">
                  {plan.name}
                </CardTitle>
                {plan.popular && (
                  <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                    Populaire
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gradient">
                  {plan.price}
                </span>
                <span className="text-gray-400">/unité</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.popular ? "gradient" : "outline"}
                className="w-full"
              >
                Choisir {plan.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Section des fonctionnalités */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="p-6 hover:scale-[1.02] transition-transform duration-300"
          >
            <CardHeader>
              <div className="mb-4">{feature.icon}</div>
              <CardTitle className="text-xl font-semibold text-gradient">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
