"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { useLocale } from 'next-intl';

export const dynamic = 'force-dynamic';
function VerifyRequestInner(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";
  const [resent, setResent] = useState(false);
  const locale = useLocale();

  const handleResend = (): void => {
    setResent(true);
    router.push(`/auth/login${email ? `?email=${encodeURIComponent(email)}` : ""}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vérification requise
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veuillez vérifier votre email pour continuer.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Un email de vérification a été envoyé à votre adresse email.
            </p>
            <Link
              href="/auth/login"
              locale={locale}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyRequestPage(): JSX.Element {
  return (
    <Suspense>
      <VerifyRequestInner />
    </Suspense>
  );
}

export default VerifyRequestPage; 