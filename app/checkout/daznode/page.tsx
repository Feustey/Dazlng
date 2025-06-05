"use client";
import React, { useState, useEffect, Suspense } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { getPubkeyError } from '../../../utils/validation';
import Image from 'next/image';

function CheckoutContent(): React.ReactElement {
  const { user, session } = useSupabase();
  const [form, setForm] = useState({
    email: '',
    pubkey: '',
  });
  const [_isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [pubkeyError, setPubkeyError] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [isSigningWithNode, setIsSigningWithNode] = useState(false);
  const router = useRouter();

  // Pré-remplissage automatique pour les utilisateurs connectés
  useEffect(() => {
    const loadUserData = async (): Promise<void> => {
      if (user && session?.access_token) {
        setIsLoadingUserData(true);
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setForm(prev => ({
              ...prev,
              email: userData.email || '',
              pubkey: userData.pubkey || ''
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
          setIsLoadingUserData(false);
        }
      }
    };

    loadUserData();
  }, [user, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePubkeyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setForm({ ...form, pubkey: value });
    setPubkeyError(getPubkeyError(value));
  };

  const isFormValid = (): boolean => {
    return Boolean(
      form.email &&
      form.pubkey &&
      !pubkeyError
    );
  };

  const BASE_PRICE_SATS = 80000;

  const getPrice = (): number => {
    let price = BASE_PRICE_SATS;
    if (isAnnual) {
      price = BASE_PRICE_SATS * 12;
    }
    return price;
  };

  const productDetails = {
    name: 'DazNode',
    priceSats: getPrice(),
    quantity: 1,
    isAnnual: isAnnual
  };

  const handlePaymentSuccess = async (txId: string): Promise<void> => {
    setTransactionId(txId);
    setPaymentSuccess(true);
    const token = session?.access_token;
    const userId = user?.id || null;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_id: userId,
        customer: form,
        product: {
          ...productDetails,
          discountPercentage: 0,
        },
        total: productDetails.priceSats,
        status: 'payée',
        transaction_id: txId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrderId(data.id);
      router.push('/checkout/success');
    }
  };

  // Simule la récupération de la pubkey via signature LN (à remplacer par une vraie intégration plus tard)
  const handleNodeSign = async (): Promise<void> => {
    // Ici, on simule la récupération d'une pubkey après signature
    // Dans la vraie vie, il faudrait ouvrir un modal, générer un message, demander la signature LN, puis vérifier côté serveur
    // Pour la démo, on met une pubkey factice
    const fakePubkey = '02abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefab';
    setForm({ ...form, pubkey: fakePubkey });
    setPubkeyError(null);
    setIsSigningWithNode(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    // ... code existant (à adapter si besoin)
  };

  if (showLightning) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Paiement Lightning</h1>
        <LightningPayment 
          amount={getPrice()} 
          productName={`DazNode${isAnnual ? ' (Abonnement Annuel)' : ''}`}
          onSuccess={(txId: string) => handlePaymentSuccess(txId)}
          onCancel={() => setShowLightning(false)}
        />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Merci pour votre commande !</h1>
        <div className="text-center text-green-500 text-lg bg-green-100/10 rounded-xl p-4 mt-4">
          Paiement réussi ! Merci pour votre commande.<br />
          {orderId && <div>Numéro de commande : <b>{orderId}</b></div>}
          {transactionId && <div>Transaction ID : <b>{transactionId}</b></div>}
          Vous recevrez un email de confirmation sous peu.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 mb-2">Souscrire à DazNode</h1>
          <p className="text-indigo-200">Finalisez votre abonnement en quelques étapes simples</p>
        </div>
        <section className="w-full flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#7c3aed]/10 to-[#a78bfa]/10 rounded-3xl shadow-xl mb-12 p-0 md:p-0 overflow-hidden min-h-[320px] max-h-[420px]">
          <div className="flex-1 flex items-center justify-center h-full min-h-[220px] md:min-h-[320px] max-h-[420px] bg-transparent">
            <Image
              src="/assets/images/dazia-illustration.png"
              alt="Illustration DazNode IA"
              width={340}
              height={260}
              className="object-contain w-auto h-[180px] md:h-[260px] drop-shadow-xl"
              priority
            />
          </div>
          <div className="flex-1 flex flex-col justify-center px-6 py-8 md:py-0 md:px-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#a78bfa] mb-2">DazNode</h1>
            <p className="text-lg md:text-xl text-slate-800 mb-6 max-w-xl">Optimisez votre nœud Lightning avec l'intelligence artificielle</p>
            <ul className="flex flex-col gap-4 mb-6">
              <li className="bg-white rounded-xl px-6 py-4 shadow border-l-4 border-[#a78bfa]">
                <span className="block font-bold text-lg text-[#7c3aed] mb-1">Gratuit</span>
                <span className="block text-slate-700">Statistiques de base et monitoring essentiel</span>
              </li>
              <li className="bg-white rounded-xl px-6 py-4 shadow border-l-4 border-[#38bdf8]">
                <span className="block font-bold text-lg text-[#0ea5e9] mb-1">Premium - 10K sats/mois</span>
                <span className="block text-slate-700">Routing optimisé et analyses avancées</span>
              </li>
              <li className="bg-white rounded-xl px-6 py-4 shadow border-l-4 border-[#f472b6]">
                <span className="block font-bold text-lg text-[#be185d] mb-1">Pro - 30K sats/mois</span>
                <span className="block text-slate-700">Intégration Amboss, Sparkseer, alertes Telegram et auto-rebalancing</span>
              </li>
            </ul>
            <a href="#" className="inline-block mt-2 px-8 py-3 rounded-xl bg-[#a78bfa] text-white font-bold text-lg shadow hover:bg-[#7c3aed] transition">Découvrir DazNode &rarr;</a>
          </div>
        </section>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8 mb-8 border border-white/20">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setIsSigningWithNode(false)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${!isSigningWithNode ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}
            >
              Saisie manuelle
            </button>
            <button
              onClick={() => setIsSigningWithNode(true)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${isSigningWithNode ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}
            >
              Signer avec mon nœud
            </button>
          </div>
          {isSigningWithNode ? (
            <div className="space-y-4">
              <p className="mb-6 text-indigo-200">
                Générez un message à signer avec votre nœud Lightning pour prouver que vous en êtes le propriétaire.
              </p>
              <button
                onClick={handleNodeSign}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg shadow-indigo-700/30 hover:shadow-xl hover:shadow-indigo-700/40 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Récupérer la pubkey via mon nœud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  Email*
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email}
                  onChange={handleChange}
                  required 
                  className="w-full rounded-xl border-0 bg-white/10 focus:ring-2 focus:ring-indigo-500 text-white p-3 placeholder-white/40 focus:bg-white/15 transition-all duration-200" 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  Clé publique Lightning*
                </label>
                <input 
                  type="text" 
                  name="pubkey" 
                  value={form.pubkey}
                  onChange={handlePubkeyChange}
                  required 
                  placeholder="02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className={`w-full rounded-xl border-0 bg-white/10 focus:ring-2 focus:ring-indigo-500 text-white p-3 placeholder-white/40 focus:bg-white/15 transition-all duration-200 ${pubkeyError ? 'ring-2 ring-pink-500' : ''}`}
                />
                {pubkeyError && (
                  <p className="mt-2 text-sm text-pink-400">{pubkeyError}</p>
                )}
                <p className="text-sm text-indigo-300 mt-2">
                  Votre clé publique Lightning Network pour recevoir les paiements
                </p>
              </div>
              <button
                type="submit"
                disabled={!isFormValid()}
                className="w-full bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-400 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>Paiement Lightning</span>
              </button>
              <p className="text-xs text-center mt-4 text-indigo-300 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Paiement 100% sécurisé via Bitcoin Lightning Network
              </p>
            </form>
          )}
        </div>
        <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8 border border-indigo-800/50">
          <h2 className="text-xl font-bold mb-6 border-b border-indigo-700/50 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Résumé</h2>
          <div className="flex items-center mb-6">
            <div className="bg-indigo-600/30 rounded-xl p-3 mr-4">
              <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">DazNode</h3>
              <p className="text-sm text-indigo-300">Votre nœud Lightning dans le cloud</p>
            </div>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-indigo-200">Formule</span>
            <div className="flex flex-col items-end">
              <div className="flex space-x-1 bg-indigo-800/50 rounded-lg p-1">
                <button 
                  onClick={() => setIsAnnual(false)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${!isAnnual ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-700/50'}`}
                >
                  Mensuel
                </button>
                <button 
                  onClick={() => setIsAnnual(true)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${isAnnual ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-700/50'}`}
                >
                  Annuel
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-indigo-700/50">
            <span className="text-indigo-100">Total</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">{getPrice()} sats</span>
              <p className="text-xs text-indigo-300 mt-1">TVA incluse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page(): JSX.Element {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
} 