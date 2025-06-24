"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { LightningPayment } from '@/components/shared/ui/LightningPayment';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import 'aos/dist/aos.css';

// Configuration dynamique des plans DazBox
const DAZBOX_PLANS = {
  starter: {
    name: 'DazBox Starter',
    type: 'dazbox',
    priceSats: 400000,
    description: 'Parfait pour débuter sur Lightning Network'
  },
  pro: {
    name: 'DazBox Pro',
    type: 'dazbox',
    priceSats: 500000,
    description: 'Solution complète pour maximiser vos revenus'
  }
} as const;

type Plan = keyof typeof DAZBOX_PLANS;

export interface CustomerForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CheckoutState {
  step: 'form' | 'payment' | 'success';
  error?: string;
  orderId?: string;
  transactionId?: string;
}

function CheckoutContent(): React.FC {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session } = useSupabase();
  const planParam = searchParams.get('plan') as Plan;
  const plan = DAZBOX_PLANS[planParam] ? planParam : 'starter';
  const selectedPlan = DAZBOX_PLANS[plan];
  
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ step: 'form' });
  const [form, setForm] = useState<CustomerForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<CustomerForm>>({});

  useEffect(() => {
    const initAOS = async () => {
      if (typeof window !== 'undefined') {
        const aos = await import('aos');
        aos.init({ 
          once: true,
          duration: 800,
          easing: 'ease-out-cubic',
        });
      }
    };
    initAOS();
  }, []);

  // Pré-remplissage automatique pour les utilisateurs connectés
  useEffect(() => {
    const loadUserData = async (): Promise<void> => {
      if (user && session?.access_token) {
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
              firstName: userData.prenom || '',
              lastName: userData.nom || ''
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        }
      }
    };

    loadUserData();
  }, [user, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (formErrors[name as keyof CustomerForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CustomerForm> = {};
    
    if (!form.email) errors.email = 'Email requis';
    if (!form.firstName) errors.firstName = 'Prénom requis';
    if (!form.lastName) errors.lastName = 'Nom requis';
    if (!form.address) errors.address = 'Adresse requise';
    if (!form.city) errors.city = 'Ville requise';
    if (!form.postalCode) errors.postalCode = 'Code postal requis';
    if (!form.country) errors.country = 'Pays requis';

    // Validation email
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email invalide';
    }

    // Validation code postal France
    if (form.country === 'France' && !/^[0-9]{5}$/.test(form.postalCode)) {
      errors.postalCode = 'Code postal invalide (5 chiffres)';
    }

    // Validation adresse minimale
    if (form.address && form.address.length < 10) {
      errors.address = 'Adresse trop courte (minimum 10 caractères)';
    }

    // Validation téléphone
    if (form.phone && !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(form.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCheckoutState({ step: 'payment' });
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Créer la commande avec les templates d'emails existants
      const orderData = {
        user_id: user?.id || null,
        product_type: 'dazbox',
        plan: plan,
        amount: selectedPlan.priceSats,
        payment_method: 'lightning',
        customer: form,
        product: {
          name: selectedPlan.name,
          quantity: 1,
          priceSats: selectedPlan.priceSats
        },
        metadata: {
          delivery_address: `${form.address}, ${form.city} ${form.postalCode}, ${form.country}`,
          city: form.city,
          zip_code: form.postalCode,
          country: form.country,
          phone: form.phone,
          email: form.email
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const data = await response.json();
        setCheckoutState({ 
          step: 'success', 
          orderId: data.data?.id
        });
        toast.success('Commande confirmée ! Vous allez recevoir un email de confirmation.');
      } else {
        throw new Error('Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la finalisation de la commande');
      setCheckoutState({ step: 'form', error: 'Erreur lors de la finalisation' });
    }
  };

  const handlePaymentError = (error: Error) => {
    toast.error(error.message || 'Une erreur est survenue lors du paiement.');
    setCheckoutState({ step: 'form', error: error.message });
  };

  const handlePaymentExpired = () => {
    toast.error('La facture a expiré. Veuillez réessayer.');
    setCheckoutState({ step: 'form' });
  };

  // Étape du formulaire
  if (checkoutState.step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Commander votre {selectedPlan.name}
            </h1>
            <p className="text-gray-600">{selectedPlan.description}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold mb-6">Informations de livraison</h2>
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre prénom"
                      />
                      {formErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre nom"
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="votre@email.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Numéro et nom de rue"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre ville"
                      />
                      {formErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Code postal"
                      />
                      {formErrors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays *
                    </label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        formErrors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Canada">Canada</option>
                      <option value="Autre">Autre (nous contacter)</option>
                    </select>
                    {formErrors.country && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>

                  {checkoutState.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{checkoutState.error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-md"
                  >
                    Procéder au paiement
                  </button>
                </form>
              </div>
            </div>

            {/* Résumé de commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Résumé de commande</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedPlan.name}</span>
                    <span className="font-semibold">{selectedPlan.priceSats.toLocaleString()} sats</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold text-green-600">Gratuite</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{selectedPlan.priceSats.toLocaleString()} sats</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Inclus dans votre DazBox :</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>✅ Nœud Lightning pré-configuré</li>
                    <li>✅ Interface web intuitive</li>
                    <li>✅ Support technique inclus</li>
                    <li>✅ Mises à jour automatiques</li>
                    <li>✅ Configuration par nos experts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
  }

  // Étape de paiement
  if (checkoutState.step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full mx-auto" data-aos="fade-up">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Paiement {selectedPlan.name}
                </h1>
                <p className="text-gray-500">
                  Finalisez votre commande en procédant au paiement via le Lightning Network.
                </p>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p><strong>Livraison à :</strong></p>
                    <p>{form.firstName} {form.lastName}</p>
                    <p>{form.address}</p>
                    <p>{form.city} {form.postalCode}</p>
                    <p>{form.country}</p>
                  </div>
                  <button
                    onClick={() => setCheckoutState({ step: 'form' })}
                    className="mt-2 text-sm text-orange-600 hover:underline"
                  >
                    Modifier l'adresse
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <LightningPayment
                  amount={selectedPlan.priceSats}
                  description={`${selectedPlan.name} - Livraison à ${form.city}`}
                  metadata={{
                    product_type: 'dazbox',
                    plan: plan,
                    customer: form,
                    delivery_address: `${form.address}, ${form.city} ${form.postalCode}, ${form.country}`,
                    city: form.city,
                    zip_code: form.postalCode,
                    country: form.country,
                    phone: form.phone,
                    email: form.email
                  }}
                  onPaid={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onExpired={handlePaymentExpired}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
  }

  // Étape de succès
  if (checkoutState.step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Commande confirmée !
            </h1>
            
            <p className="text-gray-600 mb-6">
              Merci pour votre commande ! Votre {selectedPlan.name} sera préparée et expédiée dans les plus brefs délais.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-sm">
                <div>
                  <span className="text-gray-500">Numéro de commande :</span>
                  <p className="font-semibold">{checkoutState.orderId}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 text-left">
              <h3 className="font-semibold">Prochaines étapes :</h3>
              <ul className="space-y-2 text-gray-600">
                <li>📧 Vous recevrez un email de confirmation</li>
                <li>📦 Notre équipe prépare votre DazBox</li>
                <li>🚚 Expédition sous 2-3 jours ouvrés</li>
                <li>🔧 Un expert vous contactera pour l'installation</li>
              </ul>
            </div>
            
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => router.push('/user/dashboard')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Accéder à mon tableau de bord
              </button>
              <button
                onClick={() => router.push('/')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
  );
  }

  return null;
}

export default function CheckoutPage(): React.FC {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>Chargement...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
