import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        pubkey: { label: "Public Key", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.pubkey) {
          return null;
        }

        // Ici, vous pouvez ajouter votre logique d'authentification
        // Pour l'instant, nous acceptons n'importe quelle combinaison
        return {
          id: "1",
          email: credentials.email,
          pubkey: credentials.pubkey,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
