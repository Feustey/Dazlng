'use client'

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage(): React.FC {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RegisterPageContent />
    </Suspense>
};
}

function RegisterPageContent(): React.FC {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlEmail = searchParams?.get("email") || "";
  const plan = searchParams?.get("plan") || "";
  const fromConversion = searchParams?.get("from") === "conversion";
  
  const [step, setStep] = useState<'email' | 'code' | 'profile'>('email');
  const [email, setEmail] = useState(urlEmail);
  const [code, setCode] = useState('');
  const [profile, setProfile] = useState({
    prenom: '',
    nom: ''
  });
  const [tempToken, setTempToken] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Étape 1 : Envoi du code OTP
  const handleSendCode = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/otp/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          name: `${profile.prenom} ${profile.nom}`.trim() || 'Nouvel utilisateur'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('code');
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setPending(false);
    }
  };

  // Étape 2 : Vérification du code OTP
  const handleVerifyCode = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/otp/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code,
          name: `${profile.prenom} ${profile.nom}`.trim() || 'Nouvel utilisateur'
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.needsRegistration) {
          setTempToken(data.tempToken);
          setStep('profile');
        } else {
          // Utilisateur existant, redirection
          router.push('/user/dashboard');
        }
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setPending(false);
    }
  };

  // Étape 3 : Création du profil
  const handleCreateProfile = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          prenom: profile.prenom,
          nom: profile.nom,
          tempToken
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirection avec confirmation d'inscription
        router.push(`/user/dashboard?welcome=true${plan ? `&plan=${plan}` : ''}`);
      } else {
        setError(data.error || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Logo DazNode"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>

        {/* Titre dynamique */}
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {step === 'email' && 'Créer votre compte'}
          {step === 'code' && 'Vérification'}
          {step === 'profile' && 'Finaliser votre profil'}
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-gray-600 mb-6">
          {step === 'email' && 'Rejoignez la communauté DazNode'}
          {step === 'code' && `Code envoyé à ${email}`}
          {step === 'profile' && 'Quelques informations pour terminer'}
          {fromConversion && step === 'email' && (
            <span className="block text-indigo-600 text-sm mt-1">
              ✨ Offre spéciale disponible
            </span>
          )}
        </p>

        {/* Indicateur d'étapes */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full ${step === 'email' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'code' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'profile' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Formulaire Étape 1 : Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="votre@email.com"
                required
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Envoi en cours...' : 'Recevoir le code'}
            </button>
          </form>
        )}

        {/* Formulaire Étape 2 : Code OTP */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code de vérification
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e: any) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={pending || code.length !== 6}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? 'Vérification...' : 'Vérifier le code'}
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Retour
              </button>
            </div>
          </form>
        )}

        {/* Formulaire Étape 3 : Profil */}
        {step === 'profile' && (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  id="prenom"
                  type="text"
                  value={profile.prenom}
                  onChange={(e: any) => setProfile({ ...profile, prenom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Votre prénom"
                  required
                  disabled={pending}
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  value={profile.nom}
                  onChange={(e: any) => setProfile({ ...profile, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Votre nom"
                  required
                  disabled={pending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={pending || !profile.prenom || !profile.nom}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? 'Création...' : 'Créer mon compte'}
              </button>
              <button
                type="button"
                onClick={() => setStep('code')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Retour
              </button>
            </div>
          </form>
        )}

        {/* Lien de connexion */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>

        {/* Plan sélectionné */}
        {plan && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-700 text-center">
              🎯 Plan sélectionné : <strong>{plan}</strong>
            </p>
          </div>
        )}

        {/* Note confidentialité */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Vos données sont protégées et ne seront jamais partagées.<br />
          En créant un compte, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
};
}
