"use client";

// Imports de bibliothèques tierces
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion Lightning Network
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Revenus</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-green-500"
            >
              <path d="M7 17L17 7M17 7H8M17 7V16" />
            </svg>
          </div>
          <div className="text-2xl font-bold">€24,765</div>
          <p className="text-xs text-green-500">
            +12.2% depuis le mois dernier
          </p>
        </div>
      </div>
    </div>
  );
}
