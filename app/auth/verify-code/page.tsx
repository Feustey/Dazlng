"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from '@/lib/supabase';

function VerifyCodeForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (verifyError) {
      setError('Code invalide ou expiré.');
    } else {
      setSuccess(true);
      router.push('/user/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700" tabIndex={0}>
        Saisissez votre code de connexion
      </h1>
      
      {email && (
        <p className="text-gray-600 mb-4">
          Code envoyé à : <strong>{email}</strong>
        </p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4" role="status" aria-live="polite">
          Code vérifié, connexion en cours...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80" aria-label="Formulaire de vérification OTP">
          <input
            type="text"
            placeholder="Code reçu par email"
            required
            className="border p-2 rounded tracking-widest text-center"
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={pending}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={pending}
          >
            {pending ? "Vérification..." : "Valider le code"}
          </button>
        </form>
      )}

      <a href="/auth/login" className="mt-4 text-indigo-600 hover:underline" tabIndex={0}>
        Retour à la connexion
      </a>
    </div>
  );
}

export default function VerifyCodePage(): JSX.Element {
  return (
    <Suspense>
      <VerifyCodeForm />
    </Suspense>
  );
} 