"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const AdminAuthPage: FC = () => {
  const { t } = useAdvancedTranslation("common");
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("admin@dazno.de");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si déjà authentifié
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          // Vérifier si c'est un admin (@dazno.de)
          if (data.user?.email?.includes("@dazno.de")) {
            router.push("/admin/dashboard");
          }
        }
      } catch (error) {
        console.log("Non authentifié");
      }
    };
    checkAuth();
  }, [router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Vérifier que c'est bien admin@dazno.de
    if (email !== "admin@dazno.de") {
      setError("Seul admin@dazno.de peut accéder à l'administration");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/otp/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          name: "Administrateur DazNode",
          source: "admin-auth"
        })
      });

      const data = await response.json();

      if (data.success) {
        setStep("code");
      } else {
        setError(data.error?.message || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/otp/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          code: code,
          name: "Administrateur DazNode"
        })
      });

      const data = await response.json();

      if (data.success) {
        // Rediriger vers le dashboard admin
        router.push("/admin/dashboard");
      } else {
        setError(data.error?.message || "Code invalide ou expiré");
      }
    } catch (error) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Administration DazNode</h1>
          <p className="text-gray-600">Accès réservé aux administrateurs</p>
        </div>

        {error && (
          <div className="mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email administrateur</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Envoyer le code OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code de vérification</label>
              <p className="text-xs text-gray-500 mb-2">Code envoyé à {email}</p>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? "Vérification..." : "Valider le code"}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={handleBackToEmail}
                disabled={loading}
              >
                Retour
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>DazNode Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
export const dynamic = "force-dynamic";
