"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import AlbyQRCode from "@/app/components/AlbyQRCode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { OrangeButton } from "@/components/ui/orange-button";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

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
  const t = useTranslations("daznode");
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
  });

  const features = [
    {
      id: 1,
      title: t("features.preconfigured"),
      description: t("features.preconfiguredDesc"),
    },
    {
      id: 2,
      title: t("features.balance"),
      description: t("features.balanceDesc"),
    },
    {
      id: 3,
      title: t("features.support"),
      description: t("features.supportDesc"),
    },
    {
      id: 4,
      title: t("features.delivery"),
      description: t("features.deliveryDesc"),
    },
    {
      id: 5,
      title: t("features.subscription"),
      description: t("features.subscriptionDesc"),
    },
  ];

  const specs = [
    { id: 1, title: t("specs.hardware"), description: t("specs.hardwareDesc") },
    { id: 2, title: t("specs.software"), description: t("specs.softwareDesc") },
    { id: 3, title: t("specs.security"), description: t("specs.securityDesc") },
  ];

  const handleOrder = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
    setTimeout(() => {
      setShowPayment(false);
      setShowShipping(true);
    }, 1000);
  };

  const handleShippingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Envoyer les informations de livraison par email
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

      // Rediriger vers une page de confirmation
      router.push("/order-confirmation");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des informations de livraison:",
        error
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-xl text-muted-foreground">{t("description")}</p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{t("features.preconfigured")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{t("features.support")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{t("features.security")}</span>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t("priceDescription")}
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">400,000</span>
                <span className="text-xl">sats</span>
                <span className="text-muted-foreground line-through">
                  500,000 sats
                </span>
              </div>
              <Button size="lg" onClick={handleOrder}>
                {t("orderButton")}
              </Button>
            </div>
          </div>
          <div className="lg:flex-1">
            <div className="relative aspect-square max-w-[500px] mx-auto">
              <Image
                src="/images/Daznode-PI5.png"
                alt="Raspberry Pi 5"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl object-cover"
                priority
              />
              <div className="absolute -bottom-3 -right-3 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {t("limitedOffer")}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("specsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specs.map((spec) => (
              <Card key={spec.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{spec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("orderTitle")}</CardTitle>
            <CardDescription>{t("orderDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-4">{t("price")}</p>
              <p className="text-muted-foreground">{t("priceDescription")}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <OrangeButton
              size="lg"
              className="w-full md:w-auto"
              onClick={handleOrder}
            >
              {t("orderButton")}
            </OrangeButton>
          </CardFooter>
        </Card>

        {showPayment && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPayment(false);
              }
            }}
          >
            <div className="bg-card rounded-2xl p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowPayment(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
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
              <h3 className="text-2xl font-bold mb-4">{t("payment.title")}</h3>
              <p className="text-muted-foreground mb-6">{t("payment.scan")}</p>
              <div className="bg-white p-4 rounded-lg mb-6">
                <AlbyQRCode amount={500000} plan="Daznode" />
              </div>
              {isProcessing && (
                <div className="text-center">
                  {paymentStatus === "pending" && (
                    <div className="text-muted-foreground">
                      {t("payment.processing")}
                    </div>
                  )}
                  {paymentStatus === "success" && (
                    <div className="text-green-500">
                      {t("shipping.success")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {showShipping && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowShipping(false);
              }
            }}
          >
            <div className="bg-card rounded-2xl p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowShipping(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
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
              <h3 className="text-2xl font-bold mb-4">{t("shipping.title")}</h3>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("shipping.name")}</Label>
                  <Input
                    id="name"
                    value={shippingInfo.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({ ...shippingInfo, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t("shipping.address")}</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">{t("shipping.city")}</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">{t("shipping.zipCode")}</Label>
                  <Input
                    id="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({
                        ...shippingInfo,
                        zipCode: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">{t("shipping.country")}</Label>
                  <Input
                    id="country"
                    value={shippingInfo.country}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({
                        ...shippingInfo,
                        country: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t("shipping.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("shipping.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShippingInfo({
                        ...shippingInfo,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {t("shipping.submit")}
                </Button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
