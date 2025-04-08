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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Daznode-PI5.png"
            alt="Daznode"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{t("title")}</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Votre nœud Bitcoin & Lightning Network personnel, pré-configuré et
            prêt à l'emploi
          </p>
          <Button
            size="lg"
            variant="default"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-xl"
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
        className="bg-gradient-to-r from-orange-500 to-red-600 py-16 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 rounded-full px-6 py-2 mb-4">
            🚀 Offre de Lancement
          </div>
          <h2 className="text-4xl font-bold mb-4">
            400,000 sats au lieu de 500,000 sats
          </h2>
          <p className="text-xl mb-6">
            Offre exclusive réservée aux 10 premiers clients !
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <span className="font-bold text-2xl">7</span>
              <span className="block text-sm">commandes restantes</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        ref={featuresRef}
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-24 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Pourquoi choisir Daznode ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                {feature.icon}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Product Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Un concentré de puissance dans un format compact
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                La Dazbox est conçue pour allier performance et élégance. Son
                boîtier en aluminium avec ventilation optimisée assure une
                dissipation thermique parfaite pour un fonctionnement 24/7.
              </p>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">⚡</span>
                  Design compact et élégant
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">⚡</span>
                  Ventilation optimisée
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">⚡</span>
                  Installation plug & play
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-square max-w-[500px] mx-auto">
                <Image
                  src="/images/Daznode-PI5.png"
                  alt="Dazbox"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transform rotate-3">
                  Nouvelle génération
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Technical Specs */}
      <motion.section
        ref={specsRef}
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-24 bg-gray-50 dark:bg-black"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Spécifications Techniques
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {specs.map((spec, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {spec.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {spec.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        ref={pricingRef}
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Commandez votre Daznode
          </h2>
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="text-5xl font-bold text-orange-500 mb-4">
              400,000 sats
            </div>
            <div className="text-lg text-gray-500 dark:text-gray-300 line-through mb-6">
              500,000 sats
            </div>
            <ul className="text-left text-gray-600 dark:text-gray-300 mb-8 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Raspberry Pi 5 (8GB RAM)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                SSD 1To pré-configuré avec UmbrelOS
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                50,000 sats pré-chargés pour vos premiers canaux
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>2 semaines de
                support dédié
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>1 an d'abonnement
                DazIA Premium offert
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Livraison gratuite en France
              </li>
            </ul>
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => router.push(`/${locale}/checkout`)}
            >
              Commander maintenant
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Payment Modal */}
      {showPayment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPayment(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("payment.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("payment.scan")}
            </p>
            <div className="bg-white p-4 rounded-lg mb-6">
              <AlbyQRCode amount={400000} />
            </div>
            {isProcessing && (
              <div className="text-center">
                {paymentStatus === "pending" && (
                  <div className="text-gray-600 dark:text-gray-300">
                    {t("payment.processing")}
                  </div>
                )}
                {paymentStatus === "success" && (
                  <div className="text-green-500">{t("payment.success")}</div>
                )}
              </div>
            )}
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4"
              onClick={() => setShowShipping(true)}
            >
              Continuer vers la livraison
            </Button>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      {showShipping && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowShipping(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowShipping(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("shipping.title")}
            </h3>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("shipping.name")}</Label>
                <Input
                  id="name"
                  value={shippingInfo.name}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, name: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">{t("shipping.address")}</Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">{t("shipping.city")}</Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">{t("shipping.zipCode")}</Label>
                <Input
                  id="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      zipCode: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">{t("shipping.country")}</Label>
                <Input
                  id="country"
                  value={shippingInfo.country}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      country: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("shipping.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, phone: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">{t("shipping.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, email: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6"
                disabled={isProcessing}
              >
                {isProcessing ? "Traitement en cours..." : t("shipping.submit")}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
