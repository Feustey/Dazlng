'use client'

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function LoginPage(): JSX.Element {
  const supabase = getSupabaseBrowserClient();

  return (
    <Suspense fallback={<div>{t('auth.chargement')}</div>}>
      <LoginPageContent supabase={supabase} />
    </Suspense>
  );
}

function LoginPageContent({ supabase }: { supabase: any }): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlError = searchParams?.get("error");
  const urlEmail = searchParams?.get("email") || "";
  const [email, setEmail] = useState(urlEmail);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(urlError ? decodeURIComponent(urlError) : null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/user/dashboard`
        }
      });

      if (result?.error) {
        setError("Erreur lors de l'envoi du code");
      } else {
        setSuccess(true);
        // ✅ CORRECTIF : Rediriger vers verify-code avec router
        setTimeout(() => {
          router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
        }, 1000);
      }
    } catch (err) {
      setError("Erreur réseau.");
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
          Connexion par Email
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-gray-600 mb-6">
          Recevez un code de connexion sécurisé
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
            Un code a été envoyé à votre adresse email.
          </div>
        ) : (
          /* Formulaire */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="auth.authauthvotreemailcom"
                required
                disabled={pending}
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? "Envoi en cours..." : "Recevoir le code"}
            </button>
          </form>
        )}

        {/* Lien d'inscription */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Créer un compte
            </button>
          </p>
        </div>

        {/* Note confidentialité */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Votre email ne sera jamais partagé.<br />
          <span className="italic">{t('auth.besoin_daide_contacteznous')}</span>
        </p>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
