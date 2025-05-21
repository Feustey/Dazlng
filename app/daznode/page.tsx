"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LightningPayment from '../../components/shared/ui/LightningPayment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateInvoice } from '../../lib/lightning';

export default function DaznodePage(): React.ReactElement {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('aos').then(AOS => {
        AOS.init({ 
          once: false,
          duration: 800,
          easing: 'ease-out-cubic',
          mirror: true,
          anchorPlacement: 'top-bottom'
        });
      });
    }
  }, []);

  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  const [paymentHash, setPaymentHash] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const BASIC_PRICE_SATS = 120000;
  const PREMIUM_PRICE_SATS = 360000;
  const PROMO_CODE = 'BITCOINWEEK';
  const DISCOUNT_PERCENTAGE = 10;

  const getPrice = (): number => {
    const basePrice = selectedPlan === 'basic' ? BASIC_PRICE_SATS : PREMIUM_PRICE_SATS;
    if (promoApplied) {
      return Math.round(basePrice * (1 - DISCOUNT_PERCENTAGE / 100));
    }
    return basePrice;
  };

  const productDetails = {
    name: `DazNode ${selectedPlan === 'basic' ? 'Basic' : 'Premium'}`,
    priceSats: getPrice(),
    quantity: 1,
  };

  const applyPromoCode = (): void => {
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
    }
  };

  const handleLightningClick = async (plan: 'basic' | 'premium'): Promise<void> => {
    setSelectedPlan(plan);
    try {
      const invoiceData = await generateInvoice({ amount: getPrice(), memo: `Paiement pour DazNode ${plan === 'basic' ? 'Basic' : 'Premium'}` });
      setPaymentHash(invoiceData.paymentHash || null);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      sessionStorage.setItem('daznode_order_data', JSON.stringify({
        product_type: productDetails.name,
        amount: productDetails.priceSats,
        payment_status: 'pending',
        payment_method: 'lightning',
        payment_hash: invoiceData.paymentHash,
        metadata: {
          product: productDetails,
          invoice: invoiceData.paymentRequest
        },
        token: token,
      }));
      
      setShowLightning(true);
    } catch (e) {
    }
  };

  if (showLightning && paymentHash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full" data-aos="zoom-in">
          <div className="text-center mb-6">
            <Image 
              src="/assets/images/logo-daznode-white.svg" 
              alt="DazNode Logo" 
              width={150} 
              height={40} 
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-2">Paiement Lightning</h1>
            <p className="text-blue-100">Montant: {getPrice().toLocaleString('fr-FR')} sats</p>
          </div>
          <LightningPayment 
            amount={getPrice()} 
            productName={productDetails.name}
            onSuccess={() => router.push('/checkout/success')}
            onCancel={() => setShowLightning(false)}
          />
          <button
            onClick={() => setShowLightning(false)}
            className="mt-6 w-full py-2 px-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-950">
      {/* Section Hero */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300">DazNode</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100 mb-8">La puissance de l'IA au service de votre nœud Lightning</p>
            <div className="flex flex-wrap gap-6 justify-center">
              <a href="#features" className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                Découvrir
              </a>
              <a href="#pricing" className="px-8 py-3 bg-yellow-400 text-indigo-900 font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                S'abonner
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Caractéristiques */}
      <div id="features" className="py-20 px-4 bg-indigo-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-white mb-6">Toute la puissance de notre IA et son heuristic</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">Une plateforme intégrant Intelligence Artificielle (IA), notamment via des systèmes RAG (Retrieval-Augmented Generation), pour la gestion des connaissances et l'optimisation du Réseau Lightning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-indigo-900/60 p-8 rounded-2xl shadow-xl border border-indigo-700/50" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Architecture Avancée</h3>
              <p className="text-indigo-200">Organisation intelligente des routes, gestion optimisée des composants et des données pour un réseau Lightning performant.</p>
            </div>
            
            <div className="bg-indigo-900/60 p-8 rounded-2xl shadow-xl border border-indigo-700/50" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Routing optimisé et analyses avancées</h3>
              <p className="text-indigo-200">Analysez la performance de vos canaux et optimisez votre routage Lightning grâce à nos algorithmes d'IA.</p>
            </div>
            
            <div className="bg-indigo-900/60 p-8 rounded-2xl shadow-xl border border-indigo-700/50" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-gradient-to-br from-amber-500 to-red-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Technologie de Pointe</h3>
              <p className="text-indigo-200">Utilisation de MongoDB, Redis, et OpenAI intégrés dans une architecture sécurisée et évolutive.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-800/70 to-purple-800/70 p-8 rounded-2xl shadow-2xl border border-indigo-600/30 mb-16" data-aos="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Métaheuristiques d'Optimisation</h3>
                <p className="text-indigo-200 mb-6">Nos algorithmes avancés utilisent des métaheuristiques spécialisées pour l'optimisation combinatoire, parfaitement adaptées aux problèmes complexes des réseaux Lightning.</p>
                <ul className="text-indigo-200 space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Recherche par mots-clés, embeddings et approche hybride</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>GraphRAG pour une compréhension contextuelle profonde</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Évaluation continue et auto-optimisation des performances</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl transform rotate-3 opacity-30 blur-lg"></div>
                  <Image 
                    src="/assets/images/dazia-illustration.png"
                    alt="DazNode IA Illustration" 
                    width={500} 
                    height={400}
                    className="relative z-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tarifs */}
      <div id="pricing" className="py-20 px-4 bg-gradient-to-br from-purple-950 to-indigo-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-white mb-6">Nos Formules d'Abonnement</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">Choisissez l'offre qui correspond à vos besoins et boostez les performances de votre nœud Lightning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan Basic */}
            <div className="bg-gradient-to-br from-indigo-900/80 to-indigo-800/80 rounded-3xl shadow-2xl overflow-hidden border border-indigo-700/50" data-aos="fade-up" data-aos-delay="100">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Abonnement Annuel Basic</h3>
                    <p className="text-indigo-300 text-lg mt-1">10K sats/mois</p>
                  </div>
                  <div className="bg-indigo-600/50 px-4 py-1 rounded-full">
                    <span className="text-white font-medium">Popular</span>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{promoApplied ? Math.round(BASIC_PRICE_SATS * 0.9).toLocaleString('fr-FR') : BASIC_PRICE_SATS.toLocaleString('fr-FR')}</span>
                    <span className="text-indigo-300 ml-2">sats/an</span>
                  </div>
                  {promoApplied && (
                    <div className="mt-2 flex items-center">
                      <span className="text-amber-400 font-medium">BITCOINWEEK (-10%)</span>
                      <span className="ml-2 line-through text-indigo-400">{BASIC_PRICE_SATS.toLocaleString('fr-FR')} sats</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Routing optimisé et analyses avancées</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Analyses détaillées de performance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Alertes et notifications</span>
                  </li>
                  <li className="flex items-start text-indigo-400">
                    <svg className="w-5 h-5 text-indigo-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Intégration avec Amboss et Sparkseer</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handleLightningClick('basic')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  S'abonner
                </button>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="bg-gradient-to-br from-purple-900/80 to-indigo-800/80 rounded-3xl shadow-2xl overflow-hidden border border-purple-700/50 relative" data-aos="fade-up" data-aos-delay="200">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 px-6 py-1 font-bold text-sm transform translate-x-8 translate-y-4 rotate-45">PREMIUM</div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Abonnement Annuel Premium</h3>
                    <p className="text-indigo-300 text-lg mt-1">30K sats/mois</p>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{promoApplied ? Math.round(PREMIUM_PRICE_SATS * 0.9).toLocaleString('fr-FR') : PREMIUM_PRICE_SATS.toLocaleString('fr-FR')}</span>
                    <span className="text-indigo-300 ml-2">sats/an</span>
                  </div>
                  {promoApplied && (
                    <div className="mt-2 flex items-center">
                      <span className="text-amber-400 font-medium">BITCOINWEEK (-10%)</span>
                      <span className="ml-2 line-through text-indigo-400">{PREMIUM_PRICE_SATS.toLocaleString('fr-FR')} sats</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Tout ce qui est inclus dans Basic</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Intégration avec Amboss et Sparkseer</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Alertes Telegram personnalisées</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-indigo-100">Auto-rebalancing intelligent par IA</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handleLightningClick('premium')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  S'abonner
                </button>
              </div>
            </div>
          </div>
          
          {/* Promo Code Section */}
          <div className="mt-12 max-w-md mx-auto" data-aos="fade-up">
            <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-800/50">
              <h3 className="text-lg font-medium text-white mb-4">Vous avez un code promo?</h3>
              <div className="flex">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code"
                  className="flex-grow px-4 py-2 bg-white/10 border border-indigo-700/50 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors"
                >
                  Appliquer
                </button>
              </div>
              {promoApplied && (
                <div className="mt-3 text-sm text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Code promo BITCOINWEEK appliqué (-10%)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
