"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DazpayCheckoutPage(): React.FC {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/contact');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-[600px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl text-center">
      <div className="mb-6">
        <span className="inline-block bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm">À venir</span>
      </div>
      <h1 className="text-3xl font-extrabold mb-6 text-white">DazPay - Bientôt disponible</h1>
      <div className="bg-white/10 p-6 rounded-xl mb-8">
        <p className="text-lg text-white/90 mb-6">
          DazPay est actuellement en phase finale de développement et sera bientôt disponible.
          Notre solution de paiement Lightning intégrée pour votre commerce ou site web.
        </p>
        <p className="text-base text-white/80 mb-4">
          Vous êtes intéressé par DazPay pour votre entreprise ? 
          Contactez-nous pour être parmi les premiers à en bénéficier dès son lancement.
        </p>
      </div>
      <div className="flex flex-col space-y-4">
        <a href="/contact" className="block w-full p-4 rounded-xl bg-[#5d5dfc] text-white font-semibold text-lg hover:bg-[#4a3dfc] transition-colors">
          Contactez-nous pour plus d'informations
        </a>
        <a href="/" className="block w-full p-4 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
          Retour à l'accueil
        </a>
      </div>
      <p className="mt-8 text-white/60 text-sm">
        Vous serez redirigé vers la page de contact dans quelques secondes...
      </p>
    </div>
  );
}
