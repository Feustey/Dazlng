"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyRequestInner(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";
  const [resent, setResent] = useState(false);

  const handleResend = (): void => {
    setResent(true);
    router.push(`/auth/login${email ? `?email=${encodeURIComponent(email)}` : ""}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700" tabIndex={0}>
        Vérification de votre email
      </h1>
      <div
        className="bg-indigo-50 text-indigo-800 px-4 py-3 rounded mb-4 border border-indigo-200"
        role="status"
        aria-live="polite"
      >
        <p>
          Un email de connexion vient de vous être envoyé.<br />
          <span className="font-semibold">Merci de vérifier votre boîte de réception</span> et cliquez sur le lien pour vous connecter.
        </p>
        <ul className="text-sm mt-2 list-disc list-inside text-indigo-700">
          <li>Vérifiez aussi vos spams ou courriers indésirables.</li>
          <li>Le lien est valable 24h.</li>
        </ul>
      </div>
      <button
        onClick={handleResend}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        disabled={resent}
        aria-busy={resent}
      >
        Renvoyer l'email
      </button>
      <a
        href="/auth/login"
        className="mt-4 text-indigo-600 hover:underline"
        tabIndex={0}
      >
        Retour à la connexion
      </a>
    </div>
};
}

function VerifyRequestPage(): JSX.Element {
  return (
    <Suspense>
      <VerifyRequestInner />
    </Suspense>
};
}

export default VerifyRequestPage; 