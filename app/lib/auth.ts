import { getServerSession } from "next-auth/next";
import { authConfig } from "./auth-config";
import NextAuth from "next-auth";

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

export const authOptions = authConfig;

export const { auth, signIn, signOut } = NextAuth(authOptions);

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
