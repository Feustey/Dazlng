"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAuth(): JSX.Element {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const router = useRouter();

  const ADMIN_EMAIL = "admin@dazno.de";

  // Envoyer automatiquement le code OTP au chargement de la page
  useEffect(() => {
    sendOTPCode();
  }, []);

  const sendOTPCode = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch("/api/otp/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Code OTP envoyé à ${ADMIN_EMAIL}`);
        setCodeSent(true);
      } else {
        setError(data.error?.message || "Erreur lors de l'envoi du code");
      }
    } catch (err) {
      setError("Erreur lors de l'envoi du code OTP");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (): Promise<void> => {
    if (!code.trim()) {
      setError("Veuillez saisir le code OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/otp/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Rediriger vers le dashboard admin
        router.push("/admin/dashboard");
      } else {
        setError(data.error?.message || "Code OTP invalide");
      }
    } catch (err) {
      setError("Erreur lors de la vérification du code");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    verifyCode();
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      verifyCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Administration DazNode</h1>
            <p className="text-gray-600">Code OTP envoyé automatiquement à {ADMIN_EMAIL}</p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Formulaire de vérification */}
          {codeSent && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyPress={handleKeyPress}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Vérification...
                  </div>
                ) : (
                  "Accéder à l'administration"
                )}
              </button>
            </form>
          )}

          {/* Bouton pour renvoyer le code */}
          {codeSent && (
            <div className="mt-6 text-center">
              <button
                onClick={sendOTPCode}
                disabled={isLoading}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium disabled:opacity-50"
              >
                Renvoyer le code
              </button>
            </div>
          )}

          {/* Loading initial */}
          {!codeSent && isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
                <span className="text-gray-600">Envoi du code OTP...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Retour à{" "}
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              DazNode
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 