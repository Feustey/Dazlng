import React from 'react';
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckoutProgress } from '../components/checkout/Progress';
import { OrderSummary } from '../components/checkout/Summary';
import { PaymentForm } from '../components/checkout/Payment';
import { UserInfoForm } from '../components/checkout/UserInfo';

export default function DazBoxCheckout(): React.FC {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({});

  const steps = [
    { id: 1, name: 'Informations' },
    { id: 2, name: 'Paiement' },
    { id: 3, name: 'Confirmation' }
  ];

  const renderStep = (): React.FC => {
    switch(step) {
      case 1:
        return (
          <motion.div
            key="user-info"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UserInfoForm 
              onSubmit={(data: any) => {
                setOrderData({ ...orderData, ...data });
                setStep(2);
              }}
            />
          </motion.div>
  );
      case 2:
        return (
          <motion.div
            key="payment"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
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
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-500 text-4xl">✔</span>
                  </div>
                  <h1 className="text-3xl font-bold mt-6 mb-2">Commande Confirmée !</h1>
                  <p className="text-gray-600">Merci pour votre confiance. Votre DazBox sera bientôt prête.</p>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
                  <ul className="space-y-2 text-left">
                    <li>1. Vous recevrez un email de confirmation</li>
                    <li>2. Notre équipe prépare votre DazBox</li>
                    <li>3. Un expert vous contactera pour l'installation</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
  );
      default:
        return <div />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <CheckoutProgress steps={steps} currentStep={step} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary data={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
}
