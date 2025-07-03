"use client";
import React from 'react';
import { useEffect } from "react";

// import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Une erreur est survenue
              </h1>
              <p className="text-gray-600 mb-6">
                Désolé, quelque chose s'est mal passé. Veuillez réessayer.
              </p>
              <button
                onClick={reset}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
