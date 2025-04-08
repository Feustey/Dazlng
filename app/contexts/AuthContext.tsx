"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  email: string;
  pubkey: string;
  nostrAccount: string;
  newsletterSubscription: boolean;
  avatar?: string;
  name?: string;
  bio?: string;
  pronouns?: string;
  organization?: string;
  location?: string;
  displayLocalTime?: boolean;
  website?: string;
  twitter?: string;
  linkedin?: string;
  social3?: string;
  social4?: string;
}

export interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verify: (email: string, code: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur de connexion");
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur d'inscription");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  };

  const verify = async (email: string, code: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur de vérification");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur de mise à jour");
      }

      const data = await response.json();
      setUser({ ...user, ...data.user });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        verify,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
