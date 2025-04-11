import type { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { Session } from "next-auth";
import { supabase, signInWithPassword } from "./supabase";
import { Database } from "./supabase.types";

// Spécifier que nous utilisons le runtime Node.js et non Edge
export const runtime = "nodejs";

// Définition des fonctions d'environnement
const getOptionalEnvVar = (name: string): string | undefined => {
  return process.env[name];
};

const getRequiredEnvVar = (name: string, defaultValue: string = ""): string => {
  const value = process.env[name];
  if (!value && !defaultValue) {
    console.warn(`Warning: Missing ${name} environment variable`);
    return "";
  }
  return value || defaultValue;
};

type UserData = Database["public"]["Tables"]["users"]["Row"];

interface CustomUser {
  id: string;
  email: string;
  name: string;
  pubkey: string;
  node_pubkey: string | null;
  lightning_address: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

declare module "next-auth" {
  interface User extends CustomUser {}

  interface Session {
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser {}
}

// Récupérer les variables d'environnement de façon plus tolérante
const envVars = {
  NEXTAUTH_SECRET: getRequiredEnvVar("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: getRequiredEnvVar("NEXTAUTH_URL"),
} as const;

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          !email ||
          !password ||
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          throw new Error("Email et mot de passe requis");
        }

        try {
          // Utiliser la fonction signInWithPassword de Supabase
          const result = await signInWithPassword(email, password);

          if (!result.user) {
            throw new Error("Aucun utilisateur trouvé");
          }

          // Récupérer les informations supplémentaires de l'utilisateur
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", result.user.id)
            .single();

          if (userError || !userData) {
            throw new Error(
              "Erreur lors de la récupération des données utilisateur"
            );
          }

          return userData as CustomUser;
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.pubkey = user.pubkey;
        token.node_pubkey = user.node_pubkey;
        token.lightning_address = user.lightning_address;
        token.last_login_at = user.last_login_at;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.pubkey = token.pubkey;
        session.user.node_pubkey = token.node_pubkey;
        session.user.lightning_address = token.lightning_address;
        session.user.last_login_at = token.last_login_at;
        session.user.created_at = token.created_at;
        session.user.updated_at = token.updated_at;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: envVars.NEXTAUTH_SECRET,
};

export const { auth, signIn, signOut } = NextAuth(authOptions);
