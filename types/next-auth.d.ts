import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nom?: string;
      prenom?: string;
      t4g_tokens?: number;
      email?: string | null;
      pubkey?: string;
      lnurl?: boolean;
    };
  }
  interface User {
    id: string;
    nom?: string;
    prenom?: string;
    t4g_tokens?: number;
    email?: string | null;
    pubkey?: string;
    lnurl?: boolean;
  }
} 