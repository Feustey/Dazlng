'use client';

import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { LightningPayment } from '@/components/web/LightningPayment';
import Button from '@/components/shared/ui/button';
import { CheckCircle, Zap, Shield, TrendingUp, Star } from 'lucide-react';

// Schéma de validation
const checkoutSchema = z.object({
  email: z.string().email('Email invalide'),
  pubkey: z.string().min(66, 'Clé publique invalide').max(66, 'Clé publique invalide'),
  plan_type: z.enum(['monthly', 'yearly']),
  yearly_discount: z.boolean()
});

interface DazNodeCheckoutData {
  email: string;
  pubkey: string;
  plan_type: 'monthly' | 'yearly';
  yearly_discount: boolean;
}

const DAZNODE_PLANS = {
  starter: {
    name: "Starter",
    price: 50000,
    yearly_price: 500000, // 10 mois
    features: [
      "1 node Lightning",
      "Monitoring IA 24/7",
      "Prédiction force-close",
      "Dashboard temps réel",
      "Support email",
      "Recommandations personnalisées"
    ]
  }
};

export const DazNodeCheckout = () => {
  const [formData, setFormData] = useState<DazNodeCheckoutData>({
    email: '',
    pubkey: '',
    plan_type: 'monthly',
    yearly_discount: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHash, setPaymentHash] = useState<string>();
  const [step, setStep] = useState<'form' | 'payment'>('form');

  const selectedPlan = DAZNODE_PLANS.starter;
  const amount = formData.yearly_discount ? selectedPlan.yearly_price : selectedPlan.price;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
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
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/daznode/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erreur lors de la souscription');
      }

      setPaymentHash(result.data.payment_hash);
      setStep('payment');
      toast.success('Facture créée avec succès !');
    } catch (err) {
      console.error('❌ Erreur souscription DazNode:', err);
      toast.error(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setIsLoading(false);
    }
  };

  const onPaymentSuccess = async () => {
    try {
      const response = await fetch('/api/daznode/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_hash: paymentHash })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la confirmation du paiement');
      }

      toast.success('Abonnement activé avec succès !');
      window.location.href = '/checkout/success?type=daznode';
    } catch (err) {
      console.error('❌ Erreur confirmation paiement:', err);
      toast.error(err instanceof Error ? err.message : 'Erreur inattendue');
    }
  };

  const handleInputChange = (field: keyof DazNodeCheckoutData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (step === 'payment' && paymentHash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Paiement Lightning
              </h1>
              <p className="text-gray-600">
                Scannez le QR code ou copiez la facture pour payer
              </p>
            </div>

            <LightningPayment
              amount={amount}
              description={`DazNode ${formData.yearly_discount ? 'Annuel' : 'Mensuel'} - ${formData.email}`}
              onSuccess={onPaymentSuccess}
              onError={(err) => toast.error(err.message)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Optimisez votre nœud Lightning
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoignez DazNode et bénéficiez de l'IA pour maximiser vos revenus Lightning Network
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informations d'abonnement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-amber-500'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Clé publique Lightning
                </label>
                <input
                  type="text"
                  value={formData.pubkey}
                  onChange={(e) => handleInputChange('pubkey', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors ${
                    errors.pubkey 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-amber-500'
                  }`}
                  placeholder="02abc..."
                />
                {errors.pubkey && (
                  <p className="mt-1 text-sm text-red-600">{errors.pubkey}</p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="yearly_discount"
                    checked={formData.yearly_discount}
                    onChange={(e) => handleInputChange('yearly_discount', e.target.checked)}
                    className="h-5 w-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <label htmlFor="yearly_discount" className="ml-3 text-sm font-medium text-amber-800">
                    Payer un an au prix de 10 mois
                  </label>
                </div>
                <p className="text-sm text-amber-700">
                  Économisez 2 mois de paiement en souscrivant à l'annuel !
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                className="w-full py-4 text-lg"
              >
                {isLoading ? 'Création de la facture...' : `Payer ${amount.toLocaleString()} sats`}
              </Button>
            </form>
          </div>

          {/* Plan et avantages */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Plan Starter
                </h3>
                <div className="text-4xl font-bold text-amber-600 mb-1">
                  {amount.toLocaleString()} sats
                </div>
                <p className="text-gray-600">
                  {formData.yearly_discount ? 'par an (10 mois)' : 'par mois'}
                </p>
              </div>

              <div className="space-y-4">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avantages */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Pourquoi choisir DazNode ?</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <span>Augmentation moyenne de 40% des revenus</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3" />
                  <span>Protection contre les force-close</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-3" />
                  <span>Recommandations IA personnalisées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  );
}; 