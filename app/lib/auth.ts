import type { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "jsonwebtoken";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import GoogleProvider from "next-auth/providers/google";
import AlbyProvider from "./providers/alby";
import type { Adapter } from "next-auth/adapters";
import { connectToDatabase } from "@/app/lib/mongodb";
import { compare } from "bcryptjs";
import { User } from "@/app/models/User";

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

// Récupérer les variables d'environnement de façon plus tolérante
const envVars = {
  GOOGLE_CLIENT_ID:
    getOptionalEnvVar("GOOGLE_CLIENT_ID") || "dummy-google-client-id",
  GOOGLE_CLIENT_SECRET:
    getOptionalEnvVar("GOOGLE_CLIENT_SECRET") || "dummy-google-client-secret",
  ALBY_CLIENT_ID: getOptionalEnvVar("ALBY_CLIENT_ID") || "dummy-alby-client-id",
  ALBY_CLIENT_SECRET:
    getOptionalEnvVar("ALBY_CLIENT_SECRET") || "dummy-alby-client-secret",
} as const;

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
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

        const user = await User.findOne({ email });

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
    AlbyProvider({
      clientId: envVars.ALBY_CLIENT_ID,
      clientSecret: envVars.ALBY_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || "";
        token.pubkey = user.pubkey || "";
        token.nodePubkey = user.nodePubkey || null;
        token.lightningAddress = user.lightningAddress || null;
        token.name = user.name || null;
        token.email = user.email || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userObject: any = {
          id: token.id,
          pubkey: token.pubkey,
        };

        if (token.nodePubkey !== undefined)
          userObject.nodePubkey = token.nodePubkey;
        if (token.lightningAddress !== undefined)
          userObject.lightningAddress = token.lightningAddress;
        if (token.name !== undefined) userObject.name = token.name;
        if (token.email !== undefined) userObject.email = token.email;

        session.user = userObject;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
