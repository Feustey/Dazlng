"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyCodeForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEmail = searchParams?.get("email") || "";
  const [email, setEmail] = useState(urlEmail);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error?.message || "Code invalide ou expiré.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/user");
        }, 1500);
      }
    } catch (err) {
      setError("Erreur réseau.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700" tabIndex={0}>
        Saisissez votre code de connexion
      </h1>
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
          <label htmlFor="email" className="sr-only">Adresse email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Votre email"
            required
            className="border p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={pending || !!urlEmail}
            aria-required="true"
            aria-label="Adresse email"
            autoComplete="email"
          />
          <label htmlFor="code" className="sr-only">Code reçu</label>
          <input
            id="code"
            type="text"
            name="code"
            placeholder="Code reçu par email"
            required
            className="border p-2 rounded tracking-widest text-center"
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={pending}
            aria-required="true"
            aria-label="Code OTP"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={pending}
            aria-busy={pending}
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