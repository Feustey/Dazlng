import type { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "jsonwebtoken";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import GoogleProvider from "next-auth/providers/google";
import type { Adapter } from "next-auth/adapters";
import { connectToDatabase } from "@/app/lib/mongodb";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import { MongoClient } from "mongodb";
import { Session } from "next-auth";

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

interface LNURLSession {
  id: string;
  pubkey: string;
  nodePubkey: string | null;
  lightningAddress: string | null;
  name: string | null;
  email: string | null;
}

interface AlbyProfile {
  id: string;
  name: string;
  email: string;
  lightning_address: string;
  nodes: Array<{
    pubkey: string;
  }>;
}

declare module "next-auth" {
  interface User {
    id?: string;
    pubkey?: string;
    nodePubkey?: string | null;
    lightningAddress?: string | null;
    name?: string | null;
    email?: string | null;
  }

  interface Session {
    user: {
      id: string;
      pubkey: string;
      nodePubkey: string | null;
      lightningAddress: string | null;
      name: string | null;
      email: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    pubkey: string;
    nodePubkey: string | null;
    lightningAddress: string | null;
    name: string | null;
    email: string | null;
  }
}

// Récupérer les variables d'environnement de façon plus tolérante
const envVars = {
  GOOGLE_CLIENT_ID:
    getOptionalEnvVar("GOOGLE_CLIENT_ID") || "dummy-google-client-id",
  GOOGLE_CLIENT_SECRET:
    getOptionalEnvVar("GOOGLE_CLIENT_SECRET") || "dummy-google-client-secret",
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

        await connectToDatabase();

        // Utiliser directement le modèle MongoDB
        const db = (await clientPromise).db();
        const user = await db.collection("users").findOne({ email });

        if (!user || !user.password) {
          throw new Error("Aucun utilisateur trouvé avec cet email");
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        const userSession: LNURLSession = {
          id: user._id.toString(),
          pubkey: user.pubkey || "default_pubkey",
          nodePubkey: user.nodePubkey || null,
          lightningAddress: user.lightningAddress || null,
          name: user.name || null,
          email: user.email || null,
        };

        return userSession;
      },
    }),
    GoogleProvider({
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
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
  secret: process.env.NEXTAUTH_SECRET,
};
