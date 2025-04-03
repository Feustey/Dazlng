"use client";

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">DazLng</h1>
      <p className="text-xl">Bienvenue sur la page d'accueil</p>
    </div>
  );
}
