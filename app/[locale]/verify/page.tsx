"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/components/Logo";
import { useTranslations } from "next-intl";

export default function VerifyPage() {
  const t = useTranslations("Verify");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value is entered
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Submit automatically when all digits are filled
      if (index === 5 && value !== "") {
        const verificationCode = [...newCode.slice(0, 5), value].join("");
        handleVerification(verificationCode);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async (verificationCode: string) => {
    if (verificationCode.length !== 6 || !email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify code");
      }

      // Redirection après vérification réussie
      router.push("/");
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(
        error instanceof Error ? error.message : "Failed to verify code"
      );
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    await handleVerification(verificationCode);
  };

  const handleResend = async () => {
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
        throw new Error(data.error || "Failed to resend code");
      }

      // Réinitialiser le formulaire
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Error resending code:", error);
      setError(
        error instanceof Error ? error.message : "Failed to resend code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full flex items-center mb-8">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div className="flex-grow flex justify-center">
              <Logo className="h-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-gray-600 text-center">{t("description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-4 text-center">
              {t("codeLabel")}
            </label>
            <div className="flex justify-between mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ))}
            </div>
            {error && (
              <p className="text-center text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              {t("noCode")}{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-pink-500 hover:text-pink-600 font-medium disabled:text-pink-300 disabled:cursor-not-allowed"
              >
                {t("resend")}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
