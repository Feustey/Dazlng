import React from 'react';
"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutSuccess(): React.FC {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const saveOrder = async (): Promise<void> => {
      try {
        // Récupérer les données stockées dans la page précédente
        const orderDataString = sessionStorage.getItem('dazbox_order_data');
        if (!orderDataString) {
          console.error("Aucune donnée de commande trouvée");
          setIsLoading(false);
          return;
        }
        
        const orderData = JSON.parse(orderDataString);
        
        // Mettre à jour le statut du paiement
        orderData.payment_status = 'completed';
        
        // Préparer les en-têtes avec le token d'authentification si disponible
        const headers: HeadersInit = { 
          'Content-Type': 'application/json' 
        };
        
        if (orderData.token) {
          headers['Authorization'] = `Bearer ${orderData.token}`;
          // Supprimer le token des données à envoyer
          delete orderData.token;
        }
        
        // Convertir metadata en chaîne JSON si c'est un objet
        if (typeof orderData.metadata === 'object') {
          orderData.metadata = JSON.stringify(orderData.metadata);
        }
        
        // Enregistrer la commande en base de données
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers,
          body: JSON.stringify(orderData),
        });
        
        if (!res.ok) {
          const errorData = await res.text();
          console.error("Erreur lors de l'enregistrement de la commande:", errorData);
          setError("Erreur lors de l'enregistrement de la commande");
        } else {
          // Nettoyer les données temporaires
          sessionStorage.removeItem('dazbox_order_data');
        }
      } catch (err) {
        console.error("Exception lors de l'enregistrement de la commande:", err);
        setError("Une erreur est survenue lors de l'enregistrement de votre commande");
      } finally {
        setIsLoading(false);
      }
    };
    
    saveOrder();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">Finalisation de votre commande...</h1>
          </div>
        </div>
      </div>
  );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="bg-red-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Erreur lors de l'enregistrement</h1>
            <p className="text-red-300 mb-6">{error}</p>
            <p className="text-white mb-6">Votre paiement a bien été reçu. Notre équipe prendra contact avec vous prochainement.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-300"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Paiement réussi!</h1>
          <p className="text-green-300 mb-6">Votre commande a été confirmée. Merci pour votre achat!</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-300"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
