'use client';

import React, { useState } from 'react';
import LightningPayment from '@/components/shared/ui/LightningPayment';
import { useToast } from '@/hooks/useToast';

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

export const LightningCheckout: React.FC<LightningCheckoutProps> = ({
  plan,
  amount,
  onSuccess,
  onError
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    toast({ title: 'Paiement réussi ! Redirection...', variant: 'success' });
    
    // Track successful payment
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: amount,
        currency: 'SATS',
        items: [{
          item_name: plan.name,
          price: amount,
          quantity: 1
        }]
      });
    }
    
    onSuccess?.();
  };

  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    toast({ title: `Erreur de paiement: ${error.message}`, variant: 'error' });
    onError?.(error);
  };

  const handlePaymentExpired = () => {
    setIsProcessing(false);
    toast({ title: 'Facture expirée. Veuillez générer une nouvelle facture.', variant: 'warning' });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ⚡ Paiement Lightning
          </h2>
          <p className="text-gray-600">
            {plan.name} - {amount.toLocaleString()} sats
          </p>
        </div>

        {/* Plan Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">{t('checkout.rcapitulatif_de_votre_commande')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan {plan.name}</span>
              <span className="font-mono">{amount.toLocaleString()} sats</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('checkout.commission_1')}</span>
              <span className="font-mono">{Math.round(amount * 0.01).toLocaleString()} sats</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-mono text-lg">{(amount * 1.01).toLocaleString()} sats</span>
            </div>
          </div>
        </div>

        {/* Features Included */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">{t('checkout.inclus_dans_votre_plan_')}</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Lightning Payment Component */}
        <div className="bg-gray-50 rounded-xl p-6">
          <LightningPayment
            amount={Math.round(amount * 1.01)} // Include commission
            description={`${plan.name} - DazNode`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onExpired={handlePaymentExpired}
          />
        </div>

        {/* Supported Wallets */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-3">{t('checkout.portefeuilles_supports_')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Alby', 'Phoenix', 'Breez', 'Wallet of Satoshi', 'BlueWallet', 'Zap'].map((wallet) => (
              <span key={wallet} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {wallet}
              </span>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-yellow-800">
                <strong>{t('checkout.scurit_')}</strong> Votre paiement est traité directement sur le réseau Lightning. 
                Aucune donnée sensible n'est stockée sur nos serveurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 