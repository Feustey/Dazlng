"use client";
import React, { useState, Suspense, useEffect } from 'react';
import LightningPayment from '../../../components/shared/ui/LightningPayment';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { generateInvoice } from '../../../lib/lightning';
import Image from 'next/image';
import ProtonPayment from '../../../components/shared/ui/ProtonPayment';
import type { Invoice } from '../../../lib/lightning';
import { z } from 'zod';

// ✅ Configuration centralisée
const PRODUCT_CONFIG = {
  DAZBOX: {
    name: 'DazBox',
    type: 'dazbox' as const,
    basePriceBTC: 0.004,
    get basePriceSats(): number { return Math.round(this.basePriceBTC * 100000000); }
  }
} as const;

const PROMO_CONFIG = {
  code: 'MEETUPBITCOIN',
  discount: 10
} as const;

// ✅ Validation Zod
const CheckoutFormSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  address: z.string().min(1, 'L\'adresse est requise'),
  address2: z.string().optional(),
  city: z.string().min(1, 'La ville est requise'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().min(1, 'Le pays est requis'),
  phone: z.string().optional(),
});

type CheckoutForm = z.infer<typeof CheckoutFormSchema>;

// ✅ Type pour l'insertion de commande (compatible avec la BDD)
type OrderInsert = {
  user_id: string | null;
  product_type: 'daznode' | 'dazbox' | 'dazpay';
  amount: number;
  payment_status: boolean; // Base de données utilise BOOLEAN
  payment_method: string;
  payment_hash?: string;
  metadata: Record<string, unknown>;
};

function CheckoutContent(): React.ReactElement {
  const { user: _user, session: _session } = useSupabase();
  const supabase = createClientComponentClient();
  
  // ✅ Initialiser AOS une seule fois
  useEffect(() => {
    let aos: typeof import('aos') | undefined;
    const initAOS = async (): Promise<void> => {
      if (typeof window !== 'undefined') {
        aos = await import('aos');
        aos.init({ 
          once: true, // ✅ Animer une seule fois
          duration: 800,
          easing: 'ease-out-cubic',
          mirror: false, // ✅ Pas de re-animation
          anchorPlacement: 'top-bottom'
        });
      }
    };
    
    initAOS();
    
    return () => {
      if (aos) {
        aos.refresh?.();
      }
    };
  }, []);

  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'France',
    phone: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [useAsBilling, setUseAsBilling] = useState(true);
  const [showLightning, setShowLightning] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter(); // ✅ Utiliser Next.js router
  const [_btcCopied, _setBtcCopied] = useState(false);
  const _btcAddress = 'bc1p0vyqda9uv7kad4lsfzx5s9ndawhm3e3fd5vw7pnsem22n7dpfgxq48kht7';

  // ✅ Validation améliorée avec Zod
  const isFormValid = (showErrors: boolean = false): boolean => {
    try {
      CheckoutFormSchema.parse(form);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError && showErrors) {
        setError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur commence à corriger
    if (error) setError(null);
    // Si le formulaire a déjà été soumis, valider en temps réel
    if (formSubmitted) {
      isFormValid(false);
    }
  };

  // ✅ Prix calculé avec la configuration centralisée
  const getPrice = (): number => {
    const basePrice = PRODUCT_CONFIG.DAZBOX.basePriceSats;
    if (promoApplied) {
      return Math.round(basePrice * (1 - PROMO_CONFIG.discount / 100));
    }
    return basePrice;
  };

  const _productDetails = {
    name: PRODUCT_CONFIG.DAZBOX.name,
    type: PRODUCT_CONFIG.DAZBOX.type,
    priceSats: getPrice(),
    quantity: 1,
  };

  // ✅ Amélioration de la gestion de succès
  const handlePaymentSuccess = async (): Promise<void> => {
    try {
      // Mettre à jour le statut de la commande
      const orderId = sessionStorage.getItem('current_order_id');
      if (orderId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: true }) // Temporaire : utiliser true au lieu de 'paid' pour la compatibilité
          .eq('id', orderId);
        
        if (updateError) {
          console.error('Erreur lors de la mise à jour du paiement:', updateError);
        }
      }
      
      // ✅ Utiliser Next.js router au lieu de window.location
      router.push('/checkout/success');
    } catch (error) {
      console.error('Erreur lors de la finalisation du paiement:', error);
      setError('Erreur lors de la finalisation du paiement');
    }
  };

  const applyPromoCode = (): void => {
    if (promoCode.trim().toUpperCase() === PROMO_CONFIG.code) {
      setPromoApplied(true);
      setError(null);
    } else {
      setError('Code promo invalide');
    }
  };

  // Note: Fonction supprimée car on utilise maintenant l'API /api/orders

  // ✅ Fonction pour créer une session de checkout
  const createCheckoutSession = async (orderData: OrderInsert): Promise<string | null> => {
    try {
      const { data: session, error } = await supabase
        .from('checkout_sessions')
        .insert([{
          user_id: orderData.user_id,
          amount: orderData.amount,
          currency: 'BTC',
          payment_method: 'lightning',
          status: 'pending',
          metadata: orderData.metadata
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la session de checkout:', error);
        // Si la table checkout_sessions n'existe pas encore, ce n'est pas critique
        if (error.message?.includes('relation "checkout_sessions" does not exist')) {
          console.log('Table checkout_sessions pas encore créée, continuons sans session de checkout');
          return null;
        }
        return null;
      }
      return session.id;
    } catch (error) {
      console.error('Erreur lors de la création de la session de checkout:', error);
      return null;
    }
  };

  const handleLightningClick = async (): Promise<void> => {
    setFormSubmitted(true);
    
    // ✅ Validation avec affichage des erreurs
    if (!isFormValid(true)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setInvoice(null);
    
    try {
      console.log('Début génération facture Lightning pour montant:', getPrice());
      
      const invoiceData = await generateInvoice({ 
        amount: getPrice(), 
        memo: `Paiement pour ${PRODUCT_CONFIG.DAZBOX.name}` 
      });
      
      if (!invoiceData || !invoiceData.paymentRequest) {
        throw new Error('Facture invalide reçue de l\'API');
      }

      // Récupérer les infos de session
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      let userId: string | null = null;
      if (token) {
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      }
      
      // ✅ Créer la commande via l'API pour respecter les validations
      const orderPayload = {
        user_id: userId,
        product_type: PRODUCT_CONFIG.DAZBOX.type,
        amount: getPrice(),
        payment_method: 'lightning',
        customer: form,
        product: {
          name: PRODUCT_CONFIG.DAZBOX.name,
          quantity: 1,
          priceSats: getPrice()
        },
        metadata: {
          promoApplied,
          promoCode: promoApplied ? promoCode : null,
          discountPercentage: promoApplied ? PROMO_CONFIG.discount : 0,
          invoice: invoiceData.paymentRequest
        }
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
        },
        body: JSON.stringify(orderPayload)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(`Erreur lors de la création de la commande: ${errorData.message || 'Erreur inconnue'}`);
      }

      const { data: order } = await orderResponse.json();

      // Stocker l'ID de la commande pour la mise à jour après paiement
      sessionStorage.setItem('current_order_id', order.id);
      
      // ✅ Créer une session de checkout (pour tracking optionnel)
      const sessionId = await createCheckoutSession({
        user_id: userId,
        product_type: PRODUCT_CONFIG.DAZBOX.type,
        amount: getPrice(),
        payment_status: false,
        payment_method: 'lightning',
        payment_hash: invoiceData.paymentHash,
        metadata: orderPayload.metadata
      });
      if (sessionId) {
        sessionStorage.setItem('current_checkout_session_id', sessionId);
      }
      
      setInvoice(invoiceData);
      setShowLightning(true);
      
    } catch (e) {
      console.error('Erreur lors de la génération de la facture:', e);
      setError(e instanceof Error ? e.message : 'Erreur lors de la génération de la facture');
      
      // Si erreur de génération de facture, envoyer un email
      if (form.email) {
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: 'contact@dazno.de',
              subject: 'Échec de génération de facture Lightning',
              text: `Un client a rencontré un problème lors de la génération de facture Lightning.
              
Email client: ${form.email}
Erreur: ${e instanceof Error ? e.message : 'Erreur inconnue'}

Le client devrait être recontacté pour un paiement via Wallet of Satoshi.`
            })
          });
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showLightning) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800">
          <div className="text-white text-xl animate-pulse">Génération de la facture Lightning...</div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800">
          <div className="bg-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Erreur</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <button onClick={() => { setShowLightning(false); setInvoice(null); setError(null); }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl">Retour</button>
          </div>
        </div>
      );
    }

    // Vérifier que la facture est bien disponible avant d'afficher le composant
    if (!invoice || !invoice.paymentRequest) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800">
          <div className="bg-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Chargement de la facture...</h2>
            <p className="text-yellow-200 mb-6">Veuillez patienter pendant la génération de votre facture Lightning</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          </div>
        </div>
      );
    }
    
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
            invoiceData={invoice}
            amount={getPrice()} 
            productName={PRODUCT_CONFIG.DAZBOX.name}
            onSuccess={handlePaymentSuccess}
            onCancel={() => { setShowLightning(false); setInvoice(null); setError(null); }}
          />
          <button
            onClick={() => { setShowLightning(false); setInvoice(null); setError(null); }}
            className="mt-6 w-full py-2 px-4 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au formulaire
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg w-full" data-aos="zoom-in">
          <div className="text-center mb-6">
            <div className="bg-red-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-300"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Commander votre <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">DazBox</span></h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">Votre nœud Lightning personnel, prêt à l'emploi en quelques minutes. Optimisez votre expérience Bitcoin.</p>
          </div>
        </div>
      </div>
      {/* Formulaire de commande */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative" style={{ marginTop: "-60px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de commande - 2/3 de l'écran sur desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-8 mb-6" data-aos="fade-up">
              <h2 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-base font-medium text-indigo-700 mb-1">Prénom*</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3" 
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-indigo-700 mb-1">Nom*</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-base font-medium text-indigo-700 mb-1">Email*</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                  placeholder="votre@email.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-base font-medium text-indigo-700 mb-1">Téléphone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                  placeholder="+33 6 XX XX XX XX"
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-8" data-aos="fade-up" data-aos-delay="100">
              <h2 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                Adresse de livraison
              </h2>
              <div className="mb-6">
                <label className="block text-base font-medium text-indigo-700 mb-1">Adresse*</label>
                <input 
                  type="text" 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                  placeholder="Numéro et rue"
                />
              </div>
              <div className="mb-6">
                <label className="block text-base font-medium text-indigo-700 mb-1">Complément d'adresse</label>
                <input 
                  type="text" 
                  name="address2" 
                  value={form.address2} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                  placeholder="Appartement, bâtiment, étage, etc."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-base font-medium text-indigo-700 mb-1">Ville*</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                    placeholder="Votre ville"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-indigo-700 mb-1">Code postal*</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={form.postalCode} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3"
                    placeholder="Code postal"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-base font-medium text-indigo-700 mb-1">Pays*</label>
                <select 
                  name="country" 
                  value={form.country} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-3 bg-white"
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="billing" 
                  name="useAsBilling" 
                  checked={useAsBilling} 
                  onChange={(e) => setUseAsBilling(e.target.checked)} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="billing" className="ml-2 block text-base text-indigo-700">
                  Utiliser comme adresse de facturation
                </label>
              </div>
            </div>
          </div>
          {/* Récapitulatif commande - 1/3 de l'écran sur desktop */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl p-8 sticky top-8" data-aos="fade-left">
              <h2 className="text-xl font-bold mb-6 border-b border-white/20 pb-4 flex items-center">
                <span className="bg-white/20 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </span>
                Récapitulatif de commande
              </h2>
              <div className="flex items-center mb-6 bg-white/10 p-4 rounded-xl">
                <div className="bg-white/20 rounded-lg p-2 mr-4">
                  <Image
                    src="/assets/images/dazbox.png"
                    alt="DazBox"
                    width={60}
                    height={60}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{PRODUCT_CONFIG.DAZBOX.name}</h3>
                  <p className="text-sm text-white/80">Votre nœud Lightning personnel</p>
                  <div className="flex items-center mt-1">
                    <span className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-1 rounded-full">✓ 3 mois de DazNode Premium inclus</span>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-4">
                <div className="flex justify-between mb-2">
                  <span>Prix</span>
                  <span className="font-semibold">{PRODUCT_CONFIG.DAZBOX.basePriceSats.toLocaleString('fr-FR')} sats</span>
                </div>
                <div className="mb-4">
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Code promo"
                      className="w-full rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50 pr-24 p-3 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <button 
                      onClick={() => applyPromoCode()} 
                      className="absolute right-1 top-1 bg-yellow-400 text-gray-800 px-3 py-2 rounded-lg font-medium text-sm hover:bg-yellow-500 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                  <p className="text-sm text-yellow-300 mt-1">Essayez "{PROMO_CONFIG.code}" pour -{PROMO_CONFIG.discount}% !</p>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span>Réduction</span>
                    <span className="text-yellow-300">-{PROMO_CONFIG.discount}%</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t border-white/20 pt-4 mt-4">
                  <span>Total</span>
                  <span className="text-yellow-300">{getPrice().toLocaleString('fr-FR')} sats</span>
                </div>
                <button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleLightningClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-gray-900" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                      Payer avec Lightning
                    </>
                  )}
                </button>
                <div className="bg-white/10 p-4 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Caractéristiques
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Installation plug & play en 5 minutes
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    3 mois d'abonnement DazNode Premium inclus
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Support technique 24/7
                  </li>
                </ul>
              </div>
               
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtonPayModalManager({ amount }: { amount: number }): React.ReactElement | null {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (): void => setShow(true);
    window.addEventListener('openProtonPay', handler);
    return () => window.removeEventListener('openProtonPay', handler);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Fermer"
          onClick={() => setShow(false)}
        >
          &times;
        </button>
        <ProtonPayment
          sats={amount}
          onSuccess={() => setShow(false)}
          onCancel={() => setShow(false)}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage(): React.ReactElement {
  // ✅ Utiliser la configuration centralisée
  const price = PRODUCT_CONFIG.DAZBOX.basePriceSats;
  return (
    <Suspense>
      <CheckoutContent />
      <ProtonPayModalManager amount={price} />
    </Suspense>
  );
} 