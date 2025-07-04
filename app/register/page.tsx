"use client"

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const { t } = useAdvancedTranslation("register");

  return (
    <Suspense fallback={<div>{t("common.chargement")}</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlEmail = searchParams?.get("email") || "";
  const plan = searchParams?.get("plan") || "";
  const fromConversion = searchParams?.get("from") === "conversion";
  
  const [step, setStep] = useState<"email" | "code" | "profile">("email");
  const [email, setEmail] = useState(urlEmail);
  const [code, setCode] = useState('');
  const [profile, setProfile] = useState({
    prenom: '',
    nom: ''
  });
  const [tempToken, setTempToken] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Étape 1 : Envoi du code OTP
  const handleSendCode = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/otp/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: `${profile.prenom} ${profile.nom}`.trim() || "Nouvel utilisateur"
        })
      });

      const data = await response.json();

      if (data.success) {
        setStep("code");
      } else {
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setPending(false);
    }
  };

  // Étape 2 : Vérification du code OTP
  const handleVerifyCode = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/otp/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, 
          code,
          name: `${profile.prenom} ${profile.nom}`.trim() || "Nouvel utilisateur"
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.needsRegistration) {
          setTempToken(data.tempToken);
          setStep("profile");
        } else {
          // Utilisateur existant, redirection
          router.push("/user/dashboard");
        }
      } else {
        setError(data.error || "Code invalide");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setPending(false);
    }
  };

  // Étape 3 : Création du profil
  const handleCreateProfile = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          prenom: profile.prenom,
          nom: profile.nom, 
          tempToken
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirection avec confirmation d'inscription
        router.push(`/?signup=success`);
      } else {
        setError(data.error || "Erreur lors de la création du compte");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Image
              src="/assets/images/logo-daznode-white.svg"
              alt="DazNode"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>

        {/* Titre dynamique */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {step === "email" && "Créer votre compte"}
          {step === "code" && "Vérification"}
          {step === "profile" && "Finaliser votre profil"}
        </h1>

        {/* Sous-titre */}
        <p className="text-gray-600 text-center mb-6">
          {step === "email" && "Rejoignez la communauté DazNode"}
          {step === "code" && `Code envoyé à ${email}`}
          {step === "profile" && "Quelques informations pour terminer"}
          {fromConversion && step === "email" && (
            <span className="block text-blue-600 font-medium mt-2">
              ✨ Offre spéciale disponible
            </span>
          )}
        </p>

        {/* Indicateur d'étapes */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${step === "email" ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === "code" ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === "profile" ? "bg-blue-600" : "bg-gray-300"}`}></div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire Étape 1 : Email */}
        {step === "email" && (
          <form onSubmit={handleSendCode}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="votre@email.com"
                required
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Envoi en cours..." : "Recevoir le code"}
            </button>
          </form>
        )}

        {/* Formulaire Étape 2 : Code OTP */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              disabled={pending || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Vérification..." : "Vérifier le code"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full mt-3 text-blue-600 hover:text-blue-700"
            >
              Retour
            </button>
          </form>
        )}

        {/* Formulaire Étape 3 : Profil */}
        {step === "profile" && (
          <form onSubmit={handleCreateProfile}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={profile.prenom}
                  onChange={(e) => setProfile({...profile, prenom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Prénom"
                  required
                  disabled={pending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={profile.nom}
                  onChange={(e) => setProfile({...profile, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nom"
                  required
                  disabled={pending}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Création..." : "Créer mon compte"}
            </button>
            <button
              type="button"
              onClick={() => setStep("code")}
              className="w-full mt-3 text-blue-600 hover:text-blue-700"
            >
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
}