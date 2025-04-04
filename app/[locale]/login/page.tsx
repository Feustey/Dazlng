"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/Logo";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Failed to send verification code:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-12 mb-8" />
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              {t("emailLabel")}
            </label>
            <p className="text-gray-600 mb-2">{t("emailDescription")}</p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? t("sending") : t("getCode")}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-gray-500">
              <span className="px-4 bg-white">{t("orContinueWith")}</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-lg">{t("loginWithGoogle")}</span>
          </button>

          <button
            type="button"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 18v-4h-3v1h-2v-1H9v1H7v-1H4v4h16zM7 0h10v16H7V0z" />
            </svg>
            <span className="text-lg">{t("loginWithNode")}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
