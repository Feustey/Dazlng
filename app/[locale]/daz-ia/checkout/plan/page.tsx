"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import DazIAProgressBar from "@components/daz-ia/ProgressBar";
import Button from "@components/ui/button";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { CheckCircle } from "lucide-react";

export default function PlanPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { updateCheckoutData } = useCheckoutData();
  const [selectedPlan, setSelectedPlan] = useState("standard");

  const handleContinue = () => {
    updateCheckoutData({
      delivery: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        deliveryOption: selectedPlan as "standard" | "express",
      },
    });
    router.push("/daz-ia/checkout/delivery");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <DazIAProgressBar currentStep={1} />

      <h1 className="text-3xl font-bold mt-8 mb-6">{t("choosePlan")}</h1>

      <Tabs
        defaultValue="standard"
        className="w-full"
        onValueChange={(value) => setSelectedPlan(value)}
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="basic">{t("basicPlan")}</TabsTrigger>
          <TabsTrigger value="standard">{t("standardPlan")}</TabsTrigger>
          <TabsTrigger value="premium">{t("premiumPlan")}</TabsTrigger>
        </TabsList>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <Card
            className={`border-2 ${selectedPlan === "basic" ? "border-primary" : "border-border"}`}
          >
            <CardHeader>
              <CardTitle>{t("basicPlan")}</CardTitle>
              <CardDescription>{t("basicPlanDescription")}</CardDescription>
              <div className="text-2xl font-bold">€9.99</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature1")}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature2")}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedPlan === "basic" ? "gradient" : "outline"}
                className="w-full"
                onClick={() => setSelectedPlan("basic")}
              >
                {selectedPlan === "basic" ? t("selected") : t("selectPlan")}
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Plan */}
          <Card
            className={`border-2 ${selectedPlan === "standard" ? "border-primary" : "border-border"}`}
          >
            <CardHeader>
              <CardTitle>{t("standardPlan")}</CardTitle>
              <CardDescription>{t("standardPlanDescription")}</CardDescription>
              <div className="text-2xl font-bold">€19.99</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature1")}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature2")}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature3")}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedPlan === "standard" ? "gradient" : "outline"}
                className="w-full"
                onClick={() => setSelectedPlan("standard")}
              >
                {selectedPlan === "standard" ? t("selected") : t("selectPlan")}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card
            className={`border-2 ${selectedPlan === "premium" ? "border-primary" : "border-border"}`}
          >
            <CardHeader>
              <CardTitle>{t("premiumPlan")}</CardTitle>
              <CardDescription>{t("premiumPlanDescription")}</CardDescription>
              <div className="text-2xl font-bold">€29.99</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature1")}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature2")}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature3")}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{t("feature4")}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedPlan === "premium" ? "gradient" : "outline"}
                className="w-full"
                onClick={() => setSelectedPlan("premium")}
              >
                {selectedPlan === "premium" ? t("selected") : t("selectPlan")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue} variant="gradient" size="lg">
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
