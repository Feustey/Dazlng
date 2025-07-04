"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
function VerifyCodeForm(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });

      if (verifyError) {
        setError('Code invalide ou expiré.');
      } else if (data?.user) {
        setSuccess(true);
        
        // ✅ CORRECTIF : Laisser Supabase gérer la session
        // Attendre que la session soit établie
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utiliser router.push au lieu de window.location.href
        router.push('/user/dashboard');
        router.refresh(); // Force un refresh pour que le middleware détecte la session
      } else {
        setError('Erreur lors de la vérification du code.');
      }
    } catch (error) {
      setError('Une erreur inattendue s\'est produite.');
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
            alt="auth.authauthlogo_daznode"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Vérification
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-gray-600 mb-6">
          {email ? `Code envoyé à ${email}` : 'Saisissez votre code de connexion'}
        </p>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Message de succès */}
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            Code vérifié, connexion en cours...
          </div>
        ) : (
          /* Formulaire */
          <form onSubmit={handleSubmit} className="space-y-4">
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
                inputMode="numeric"
                pattern="[0-9]{6}"
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={pending || code.length !== 6}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? "Vérification..." : "Valider le code"}
              </button>
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}

        {/* Note confidentialité */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Le code expire dans 10 minutes.<br />
          <span className="italic">{t('auth.besoin_daide_contacteznous')}</span>
        </p>
      </div>
    </div>
  );
}

export default function VerifyCodePage(): JSX.Element {
  return (
    <Suspense fallback={<div>{t('auth.chargement')}</div>}>
      <VerifyCodeForm />
    </Suspense>
  );
}
