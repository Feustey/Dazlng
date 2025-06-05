'use client'

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function LoginPage(): JSX.Element {
  const supabase = createSupabaseBrowserClient();

  return (
    <Suspense fallback={<div>Chargement...</div>}>
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/assets/images/logo-daznode.svg"
        alt="Logo DazNode"
        width={64}
        height={64}
        className="mb-4"
        priority
      />
      <h1 className="text-2xl font-bold mb-4" tabIndex={0}>Connexion par Email</h1>
      {error && (
        <div
          className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {success ? (
        <div
          className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4"
          role="status"
          aria-live="polite"
        >
          Un code a été envoyé à votre adresse email.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-80"
          aria-label="Formulaire de connexion par email"
        >
          <label htmlFor="email" className="sr-only">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Votre email"
            required
            className="border p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={pending}
            aria-required="true"
            aria-label="Adresse email"
            autoComplete="email"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Envoi en cours..." : "Recevoir le code"}
          </button>
        </form>
      )}
      <p className="text-xs text-gray-500 mt-4" tabIndex={0}>
        Votre email ne sera jamais partagé.<br />
        <span className="italic">Besoin d'aide ? Contactez-nous.</span>
      </p>
    </div>
  );
}
