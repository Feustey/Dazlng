'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GradientLayout from '../../components/shared/layout/GradientLayout';

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    pubkey: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validation de l'email
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Envoyer le code OTP pour l'inscription
      const res = await fetch('/api/otp/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          pubkey: formData.pubkey || undefined // Inclure la pubkey si fournie
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep('verification');
        setInfo('Un code de vérification vient de vous être envoyé par email (valide 15 minutes).');
      } else if (res.status === 429) {
        setError(`${data.error} Réessayez dans quelques minutes.`);
      } else {
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
    }
    
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Veuillez saisir le code reçu');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('/api/otp/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: verificationCode,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          pubkey: formData.pubkey || undefined
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Stocker le token JWT
        localStorage.setItem('jwt', data.token);
        
        // Afficher un message de succès et rediriger
        setInfo('Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          router.push('/user/dashboard');
        }, 1500);
      } else if (res.status === 429) {
        setError(`${data.error} Réessayez dans quelques minutes.`);
      } else {
        setError(data.error || 'Code invalide ou expiré');
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
    }
    
    setLoading(false);
  };

  const handleBackToHome = (): void => {
    router.push('/');
  };

  return (
    <GradientLayout>
      <div className="max-w-2xl mx-auto py-20 px-4">
        {/* Logo avec retour accueil */}
        <div className="flex justify-center mb-8 cursor-pointer" onClick={handleBackToHome}>
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={200}
            height={80}
            className="h-16 w-auto hover:scale-105 transition-transform"
            priority
          />
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Créez votre compte{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text">
              Daznode
            </span>
          </h1>
          
          <p className="text-indigo-200 text-center mb-8">
            Inscription rapide par email - Aucun mot de passe requis
          </p>
          
          {/* Messages d'erreur et d'information */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          {info && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-300/30 text-green-200 px-4 py-3 rounded-xl text-sm">
              {info}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Votre prénom"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Votre nom"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="pubkey" className="block text-sm font-medium text-white mb-2">
                  Clé publique (optionnel)
                </label>
                <input
                  type="text"
                  id="pubkey"
                  name="pubkey"
                  value={formData.pubkey}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="02a1b2c3d4e5f6..."
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-indigo-300">
                  Votre clé publique Bitcoin/Lightning pour l'authentification avancée
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-4 rounded-xl text-lg shadow-2xl transform transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 hover:scale-105'
                } text-black`}
              >
{loading ? 'Envoi du code...' : 'Recevoir le code par email'}
              </button>
            </form>
          ) : (
            /* Étape de vérification */
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📧</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Vérifiez votre email
                </h2>
                <p className="text-indigo-200">
                  Nous avons envoyé un code de vérification à <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-white mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  required
                  disabled={loading}
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !verificationCode}
                className={`w-full font-bold py-4 rounded-xl text-lg shadow-2xl transform transition-all ${
                  loading || !verificationCode
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 hover:scale-105'
                } text-black`}
              >
                {loading ? 'Vérification...' : 'Vérifier et créer le compte'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setError(null);
                    setInfo(null);
                    setVerificationCode('');
                  }}
                  className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors text-sm"
                  disabled={loading}
                >
                  ← Modifier mes informations
                </button>
              </div>
            </form>
          )}
          
          {/* Informations sur l'essai gratuit */}
          <div className="mt-6 text-center text-indigo-200 text-sm">
            <p>
              <span className="text-yellow-300 font-bold">✓ Essai gratuit IA de 7 jours</span> • 
              Pas de carte bancaire requise • 
              Support 24/7
            </p>
          </div>
          
          {/* Lien de connexion */}
          <div className="mt-6 text-center">
            <p className="text-indigo-200">
              Déjà un compte ?{' '}
              <button
                onClick={() => router.push('/auth/login')}
                className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </GradientLayout>
  );
} 