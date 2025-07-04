"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export default function Header(): JSX.Element {
  const { t } = useAdvancedTranslation("admin");
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Déconnecter via Supabase
      const response = await fetch("/api/auth/logout", {
        method: "POST"
      });
      
      if (response.ok) {
        // Rediriger vers la page d'accueil
        router.push("/");
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header>
      <div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{t("admin.daznode_admin")}</h1>
          <p className="text-sm text-gray-600">{t("admin.panneau_dadministration")}</p>
        </div>
        
        <div>
          <div>
            admin@dazno.de
          </div>
          
          <button onClick={handleLogout}>
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </button>
        </div>
      </div>
    </header>
  );
}

export const dynamic = "force-dynamic";
