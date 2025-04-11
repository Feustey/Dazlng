import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabase";

const getRequiredEnvVar = (name: string, defaultValue: string = ""): string => {
  const value = process.env[name];
  if (!value && !defaultValue) {
    console.warn(`Warning: Missing ${name} environment variable`);
    return "";
  }
  return value || defaultValue;
};

const envVars = {
  NEXTAUTH_SECRET: getRequiredEnvVar("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: getRequiredEnvVar("NEXTAUTH_URL"),
} as const;

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Lightning",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email!,
            pubkey: user.user_metadata.pubkey || "",
            node_pubkey: user.user_metadata.node_pubkey || null,
            lightning_address: user.user_metadata.lightning_address || null,
            last_login_at: user.last_sign_in_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: envVars.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
