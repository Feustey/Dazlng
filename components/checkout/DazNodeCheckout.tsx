"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { LightningPayment } from "@/components/web/LightningPayment";
import { Button } from "@/components/shared/ui/Button";
import { CheckCircle, Zap, Shield, TrendingUp, Star } from "lucide-react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

// Schéma de validation
const checkoutSchema = z.object({
  email: z.string().email("Email invalide"),
  pubkey: z.string().min(66, "Clé publique invalide").max(66, "Clé publique invalide"),
  plan_type: z.enum(["monthly", "yearly"]),
  yearly_discount: z.boolean()
});

interface DazNodeCheckoutData {
  email: string;
  pubkey: string;
  plan_type: "monthly" | "yearly";
  yearly_discount: boolean;
}

const DAZNODE_PLANS = {
  starter: {
    name: "Starter",
    price: 5000.0,
    yearly_price: 50000.0, // 10 mois
    features: [
      "1 node Lightning", "Monitoring IA 24/7", "Prédiction force-close", "Dashboard temps réel", "Support email", "Recommandations personnalisées"
    ]
  }
};

export const DazNodeCheckout = () => {
  const { t } = useAdvancedTranslation("checkout");

  const [formData, setFormData] = useState<DazNodeCheckoutData>({
    email: '',
    pubkey: '',
    plan_type: "monthly",
    yearly_discount: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHash, setPaymentHash] = useState<string>();
  const [step, setStep] = useState<"form" | "payment">("form");

  const selectedPlan = DAZNODE_PLANS.starter;
  const amount = formData.yearly_discount ? selectedPlan.yearly_price : selectedPlan.price;

  const validateForm = (): boolean => {
    const newErrors: Record<string, any> = {};
    
    try {
      checkoutSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/daznode/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Erreur lors de la souscription");
      }

      setPaymentHash(result.data.payment_hash);
      setStep("payment");
      toast.success("Facture créée avec succès !");
    } catch (err) {
      console.error("❌ Erreur souscription DazNode:", err);
      toast.error(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  const onPaymentSuccess = async () => {
    try {
      const response = await fetch("/api/daznode/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_hash: paymentHash })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la confirmation du paiement");
      }

      toast.success("Abonnement activé avec succès !");
      window.location.href = "/checkout/success?type=daznode";
    } catch (err) {
      console.error("❌ Erreur confirmation paiement:", err);
      toast.error(err instanceof Error ? err.message : "Erreur inattendue");
    }
  };

  const handleInputChange = (field: keyof DazNodeCheckoutData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (step === "payment" && paymentHash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Paiement Lightning
            </h1>
            <p className="text-gray-600">
              Scannez le QR code ou copiez la facture pour payer
            </p>
          </div>

          <LightningPayment
            amount={amount}
            description="Abonnement DazNode"
            onSuccess={onPaymentSuccess}
            onError={(err) => toast.error(err.message)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Optimisez votre nœud Lightning
          </h1>
          <p className="text-gray-600 text-lg">
            Rejoignez DazNode et bénéficiez de l'IA pour maximiser vos revenus Lightning Network
          </p>
        </div>

        <div className="space-y-6">
          {/* Formulaire */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informations d'abonnement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors ${
                    errors.email 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-amber-500"
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé publique Lightning
                </label>
                <input
                  type="text"
                  value={formData.pubkey}
                  onChange={(e) => handleInputChange("pubkey", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors ${
                    errors.pubkey 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-amber-500"
                  }`}
                  placeholder="02a1b2c3d4e5f6..."
                />
                {errors.pubkey && (
                  <p className="mt-1 text-sm text-red-600">{errors.pubkey}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan d'abonnement
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange("plan_type", "monthly")}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.plan_type === "monthly"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Mensuel</div>
                    <div className="text-2xl font-bold text-amber-600">
                      {selectedPlan.price.toLocaleString()} sats
                    </div>
                    <div className="text-sm text-gray-500">par mois</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange("plan_type", "yearly")}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.plan_type === "yearly"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Annuel</div>
                    <div className="text-2xl font-bold text-amber-600">
                      {selectedPlan.yearly_price.toLocaleString()} sats
                    </div>
                    <div className="text-sm text-gray-500">par an (2 mois offerts)</div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg font-semibold"
              >
                {isLoading ? "Création de la facture..." : "Payer maintenant"}
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ce qui est inclus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};