"use client";
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutProgress } from "../components/checkout/Progress";
import { OrderSummary } from "../components/checkout/Summary";
import { PaymentForm } from "../components/checkout/Payment";
import { UserInfoForm } from "../components/checkout/UserInfo";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export default function DazBoxCheckout() {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({});
  const { t } = useAdvancedTranslation();

  const steps = [
    { id: 1, name: "Informations" },
    { id: 2, name: "Paiement" },
    { id: 3, name: "Confirmation" }
  ];

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UserInfoForm
              onSubmit={(data) => {
                setOrderData({ ...orderData, ...data });
                setStep(2);
              }}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentForm
              onBack={() => setStep(1)}
              onSuccess={() => setStep(3)}
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-4xl">✔</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mt-6 mb-2">{t("checkout.commande_confirmee")}</h1>
                <p className="text-gray-600">{t("checkout.merci_pour_votre_confiance")}</p>
              </div>
              <div className="text-left max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">{t("checkout.prochaines_etapes")}</h2>
                <ul className="space-y-2">
                  <li>{t("checkout.etape_1_email_confirmation")}</li>
                  <li>{t("checkout.etape_2_preparation_commande")}</li>
                  <li>{t("checkout.etape_3_contact_expert")}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CheckoutProgress currentStep={step} steps={steps} />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>
            
            <div className="lg:col-span-1">
              <OrderSummary orderData={orderData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
