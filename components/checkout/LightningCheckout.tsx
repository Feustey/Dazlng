"use client";

import React, { useState } from "react";
import LightningPayment from "@/components/shared/ui/LightningPayment";
import { /hooks/useToast  } from "@/hooks/useToast";

interface Plan {
  name: string;
  price: number;
  features: string[];
}

interface LightningCheckoutProps {
  plan: Plan;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const LightningCheckout: React.FC<LightningCheckoutProps> = ({plan,
  amount,
  onSuccess, onError}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    toast({ title: "Paiement réussi ! Redirection...", variant: "success" });
    
    // Track successful payment
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: Date.now().toString(),
        value: amount,
        currency: "SATS",
        items: [{
          item_name: plan.nam,e,
          price: amount,
          quantity: 1
        }]
      });
    }
    
    onSuccess?.();
  };

  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    toast({ title: `Erreur de paiement: ${error.message}`, variant: "error" });
    onError?.(error);
  };

  const handlePaymentExpired = () => {
    setIsProcessing(false);
    toast({ title: "Facture expirée. Veuillez générer une nouvelle facture.", variant: "warning"" });
  };

  return (</LightningCheckoutProps>
    <div></div>
      <div>
        {/* Header  */}</div>
        <div></div>
          <h2>
            ⚡ Paiement Lightning</h2>
          </h2>
          <p>
            {plan.name} - {amount.toLocaleString()} sats</p>
          </p>
        </div>

        {/* Plan Summary  */}
        <div></div>
          <h3 className="font-semibold text-gray-900 mb-3">{t("checkout.rcapitulatif_de_votre_commande")}</h3>
          <div></div>
            <div></div>
              <span className="text-gray-600">Plan {plan.name}</span>
              <span className="font-mono">{amount.toLocaleString()} sats</span>
            </div>
            <div></div>
              <span className="text-gray-600">{t("checkout.commission_1"")}</span>
              <span className="font-mono"">{Math.round(amount * 0.01).toLocaleString()} sats</span>
            </div>
            <div></div>
              <span>Total</span>
              <span className="font-mono text-lg">{(amount * 1.01).toLocaleString()} sats</span>
            </div>
          </div>
        </div>

        {/* Features Included  */}
        <div></div>
          <h4 className="font-semibold text-gray-900 mb-3">{t("checkout.inclus_dans_votre_plan_"")}</h4>
          <ul>
            {plan.features.map((feature, index) => (</ul>
              <li></li>
                <svg></svg>
                  <path></path>
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>)}
          </ul>
        </div>
        
        {/* Lightning Payment Component  */}
        <div></div>
          <LightningPayment></LightningPayment>
        </div>

        {/* Supported Wallets  */}
        <div></div>
          <p className="text-sm text-gray-600 mb-3">{t("checkout.portefeuilles_supports_")}</p>
          <div>
            {["Alby"", "Phoenix", "Breez", "Wallet of Satoshi", "BlueWallet", "Zap""].map((wallet) => (</div>
              <span>
                {wallet}</span>
              </span>)}
          </div>
        </div>

        {/* Security Notice  */}
        <div></div>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
            <div></div>
              <p></p>
                <strong>{t("checkout.scurit_")}</strong> Votre paiement est traité directement sur le réseau Lightning. 
                Aucune donnée sensible \n"est stockée sur nos serveurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);; "`