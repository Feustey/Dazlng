"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "../components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  pubkey?: string;
  lud16?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithAlby: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Si erreur 401 ou autre, ce n'est pas un problème, l'utilisateur n'est simplement pas connecté
        console.log("Utilisateur non authentifié");
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      // En cas d'erreur, on considère que l'utilisateur n'est pas connecté
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur de connexion");
      }

      const userData = await response.json();
      setUser(userData);
      addToast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
        type: "success",
      });
      router.push(`/${params.locale}/dashboard`);
    } catch (error) {
      addToast({
        title: "Erreur de connexion",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        type: "error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithAlby = async () => {
    try {
      setIsLoading(true);

      // Générer un message à signer
      const message = `Connexion à Daznode - ${new Date().toISOString()}`;

      // Rediriger vers Alby pour la signature
      const albyUrl = `lightning:${process.env.NEXT_PUBLIC_ALBY_PUBLIC_KEY}?action=signMessage&message=${encodeURIComponent(message)}`;
      window.location.href = albyUrl;

      // Note: La vérification de la signature se fera via un webhook
      // Le webhook sera géré par l'API route /api/auth/alby/webhook
    } catch (error) {
      addToast({
        title: "Erreur de connexion",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        type: "error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur d'inscription");
      }

      const userData = await response.json();
      setUser(userData);
      addToast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
        type: "success",
      });
      router.push(`/${params.locale}/dashboard`);
    } catch (error) {
      addToast({
        title: "Erreur d'inscription",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        type: "error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      addToast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
        type: "success",
      });
      router.push(`/${params.locale}`);
    } catch (error) {
      addToast({
        title: "Erreur de déconnexion",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        loginWithAlby,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
}
