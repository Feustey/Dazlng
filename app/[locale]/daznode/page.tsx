"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Bitcoin, Shield, Zap, Clock, Cloud, Server } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import AlbyQRCode from "../../components/AlbyQRCode";
import { useRouter, usePathname } from "next/navigation";

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

export default function DaznodePage() {
  const t = useTranslations("Daznode");

  const features = [
    {
      icon: <Bitcoin className="w-12 h-12 text-orange-500 mb-6" />,
      title: "Nœud Bitcoin & Lightning",
      description:
        "Exécutez votre propre nœud Bitcoin et Lightning Network pour une souveraineté financière totale. Validez vos transactions sans dépendre de tiers.",
    },
    {
      icon: <Shield className="w-12 h-12 text-orange-500 mb-6" />,
      title: "Sécurité Maximale",
      description:
        "Protection par mot de passe pour toutes vos applications avec option 2FA. Vos clés, vos coins, en toute sécurité.",
    },
    {
      icon: <Zap className="w-12 h-12 text-orange-500 mb-6" />,
      title: "Performance Optimale",
      description:
        "Raspberry Pi 5 dernière génération avec 8GB de RAM et SSD 1To pour une expérience fluide et rapide.",
    },
    {
      icon: <Clock className="w-12 h-12 text-orange-500 mb-6" />,
      title: "Mises à jour en un clic",
      description:
        "Système de mise à jour automatique pour garder votre nœud à jour avec les dernières fonctionnalités et correctifs de sécurité.",
    },
    {
      icon: <Cloud className="w-12 h-12 text-orange-500 mb-6" />,
      title: "Interface Web Intuitive",
      description:
        "Accédez à votre nœud depuis n'importe quel navigateur. Pas besoin d'écran externe, de souris ou de clavier.",
    },
    {
      icon: <Server className="w-12 h-12 text-orange-500 mb-6" />,
      title: "Apps Pré-installées",
      description:
        "Mempool, Lightning Terminal, et autres applications essentielles pré-configurées pour une expérience clé en main.",
    },
  ];

  const specs = [
    {
      title: "Matériel Premium",
      description:
        "Raspberry Pi 5 (8GB RAM), SSD 1To haute performance, boîtier design et compact avec ventilation optimisée, alimentation officielle.",
    },
    {
      title: "Logiciel Optimisé",
      description:
        "UmbrelOS pré-installé, Bitcoin Core, LND, interface de gestion intuitive, mises à jour automatiques, monitoring système en temps réel.",
    },
    {
      title: "Connectivité",
      description:
        "Port Ethernet Gigabit, Wi-Fi 6, Bluetooth 5.0, 4 ports USB 3.0, sortie HDMI 4K (optionnelle).",
    },
  ];

  // Refs pour l'animation au scroll
  const heroRef = useRef(null);
  const promoRef = useRef(null);
  const featuresRef = useRef(null);
  const specsRef = useRef(null);
  const pricingRef = useRef(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [showPayment, setShowPayment] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
  });

  const handleOrder = () => {
    setShowPayment(true);
  };

  const handleShippingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Envoyer les informations de livraison
      await fetch("/api/shipping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...shippingInfo,
          recipientEmail: "feustey@pm.me",
        }),
      });

      // Rediriger vers la page de confirmation
      router.push(`/${locale}/order-confirmation`);
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des informations de livraison:",
        error
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50 text-foreground"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Daznode-PI5.png"
            alt="Daznode"
            fill
            className="opacity-20 object-cover animate-fade-in"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-slide-up">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up [animation-delay:200ms]">
            Votre nœud Bitcoin & Lightning Network personnel, pré-configuré et
            prêt à l'emploi
          </p>
          <Button
            size="lg"
            className="btn-gradient px-8 py-6 text-xl animate-slide-up [animation-delay:400ms]"
            onClick={() => router.push(`/${locale}/checkout`)}
          >
            {t("orderButton")}
          </Button>
        </div>
      </motion.section>

      {/* Promo Banner */}
      <motion.section
        ref={promoRef}
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-xl py-16 text-foreground border-y border-accent/10"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-card/50 backdrop-blur-sm rounded-full px-6 py-2 mb-4 border border-accent/20">
            🚀 Offre de Lancement
          </div>
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            {t("promoTitle")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("promoDescription")}
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            {t("featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="card-glass p-8 rounded-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-4 text-gradient">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-24 bg-gradient-to-b from-background/50 to-background border-y border-accent/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            {t("specsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.title}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="card-glass p-8 rounded-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                  {spec.title}
                </h3>
                <p className="text-muted-foreground">{spec.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Form Modal */}
      {showShipping && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
          <Card className="card-glass w-full max-w-lg mx-4 animate-fade-in">
            <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                {t("shippingTitle")}
              </h2>
              {Object.entries(shippingInfo).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="text-muted-foreground">
                    {t(`shipping.${key}`)}
                  </Label>
                  <Input
                    id={key}
                    type={key === "email" ? "email" : "text"}
                    required
                    value={value}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full bg-card/50 backdrop-blur-sm border-accent/20"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowShipping(false)}
                  className="hover:bg-accent/20"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  className="btn-gradient"
                  disabled={isProcessing}
                >
                  {isProcessing ? t("processing") : t("submit")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
          <Card className="card-glass w-full max-w-md mx-4 animate-fade-in">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                {t("paymentTitle")}
              </h2>
              <div className="flex justify-center">
                <AlbyQRCode
                  value="lnbc100u1p3xn9vxpp5xv3j8n4k2p3xn9vxpp5xv3j8n4k2p3xn9vxpp5xv3j8n4k2"
                  amount={100000}
                  memo="Daznode Payment"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-muted-foreground">{t("scanQR")}</p>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="hover:bg-accent/20"
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
