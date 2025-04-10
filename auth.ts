// Spécifier que nous utilisons le runtime Node.js et non Edge
export const runtime = "nodejs";

import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import { compare } from "bcryptjs";

// Configuration du fuseau horaire
export const timeZone = "Europe/Paris";

interface UserSession {
  id: string;
  pubkey: string;
  nodePubkey: string | null;
  lightningAddress: string | null;
  name: string | null;
  email: string | null;
}

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserSession {}
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();
          const user = (await User.findOne({
            email: credentials.email,
          })) as IUser | null;

          if (!user || !user.password) {
            return null;
          }

          const isValid = await compare(
            credentials.password as string,
            user.password as string
          );

          if (!isValid) {
            return null;
          }

          // Vérifier que _id est bien une instance d'ObjectId avant de l'utiliser
          const userId =
            user._id instanceof mongoose.Types.ObjectId
              ? user._id.toString()
              : typeof user._id === "object" &&
                  user._id !== null &&
                  "_id" in user._id
                ? user._id.toString()
                : String(user._id);

          return {
            id: userId,
            pubkey: user.pubkey || "default_pubkey",
            nodePubkey: user.nodePubkey || null,
            lightningAddress: user.lightningAddress || null,
            name: user.name || null,
            email: user.email || null,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userSession = user as UserSession;
        token.id = userSession.id;
        token.pubkey = userSession.pubkey;
        token.nodePubkey = userSession.nodePubkey;
        token.lightningAddress = userSession.lightningAddress;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.pubkey = token.pubkey;
        session.user.nodePubkey = token.nodePubkey;
        session.user.lightningAddress = token.lightningAddress;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
