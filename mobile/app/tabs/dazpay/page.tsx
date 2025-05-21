'use client';

import React, { useState } from 'react';
import ProductCard from 'components/shared/ui/ProductCard';
import LightningPayment from 'components/web/LightningPayment';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  features: { text: string }[];
  amount: number;
}

const DazPayPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const products: Product[] = [
    {
      id: 'standard',
      title: "DazPay - Standard",
      subtitle: "Solution simple pour accepter le Bitcoin",
      price: "1% par transaction",
      amount: 100000, // 100,000 sats = ~30€
      features: [
        { text: "✓ 0€ de frais d'installation" },
        { text: "✓ 1% de frais par transaction" },
        { text: "✓ Interface d'encaissement simple" },
        { text: "✓ Dashboard marchand" },
        { text: "✓ Support technique" }
      ]
    },
    {
      id: 'subscription',
      title: "DazPay - Abonnement",
      subtitle: "Pour les commerces à fort volume",
      price: "15€/mois + 0.5% par transaction",
      amount: 500000, // 500,000 sats = ~150€
      features: [
        { text: "✓ 15€/mois d'abonnement" },
        { text: "✓ 0.5% de frais par transaction" },
        { text: "✓ Interface d'encaissement avancée" },
        { text: "✓ Dashboard marchand premium" },
        { text: "✓ Support prioritaire" }
      ]
    },
    {
      id: 'conversion',
      title: "Option - Conversion BTC/EUR",
      subtitle: "Recevez directement en euros",
      price: "Sur devis",
      amount: 1000000, // 1,000,000 sats = ~300€
      features: [
        { text: "✓ Conversion instantanée BTC > EUR" },
        { text: "✓ Intégration avec Strike" },
        { text: "✓ Intégration avec River" },
        { text: "✓ Intégration avec BTCPay" },
        { text: "✓ Node de liquidité dédié" }
      ]
    }
  ];

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Ici, vous pourriez ajouter la logique pour enregistrer le paiement,
    // créer le compte marchand, envoyer un email de confirmation, etc.
    setShowPayment(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!showPayment ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ProductCard
                  title={product.title}
                  subtitle={product.subtitle}
                  price={product.price}
                  features={product.features}
                />
                <div className="p-6 bg-gray-50">
                  <button
                    onClick={() => handleProductSelect(product)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                  >
                    Souscrire maintenant
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : selectedProduct ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">
              Paiement pour {selectedProduct.title}
            </h2>
            <LightningPayment
              amount={selectedProduct.amount}
              productName={selectedProduct.title}
              onSuccess={handlePaymentSuccess}
            />
    
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DazPayPage; 