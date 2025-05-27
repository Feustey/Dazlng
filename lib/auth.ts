import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from "zod";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyLnurlAuth } from "@/lib/lnurl-auth";

// Client Supabase pour NextAuth.js
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Instance Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Rate limiting en mémoire (à remplacer par Redis en prod) ---
const emailRateLimit = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1h en ms

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const timestamps = emailRateLimit.get(email) || [];
  // Ne garder que les timestamps dans la fenêtre d'1h
  const recent = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  emailRateLimit.set(email, recent);
  return false;
}

// --- Validation stricte de l'email ---
const allowedEmailSchema = z.string().email().refine(email => {
  // Liste d'exemples d'emails jetables (à compléter)
  const blocklist = [
    "yopmail.com", "mailinator.com", "tempmail", "10minutemail", "guerrillamail"
  ];
  return !blocklist.some(domain => email.endsWith(domain));
}, { message: "Adresse email non autorisée." });

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM,
      // Optionnel : personnaliser l'email de connexion
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        // --- Validation stricte de l'email ---
        try {
          allowedEmailSchema.parse(email);
        } catch (err) {
          console.warn(`[SECURITY] Email refusé (validation): ${email}`);
          throw new Error("Adresse email invalide ou non autorisée.");
        }

        // --- Rate limiting ---
        if (isRateLimited(email)) {
          console.warn(`[SECURITY] Rate limit atteint pour: ${email}`);
          throw new Error("Trop de tentatives, réessayez plus tard.");
        }

        // --- Log tentative d'envoi ---
        console.info(`[AUTH] Envoi email de connexion à: ${email}`);

        try {
          await resend.emails.send({
            from: provider.from as string,
            to: email,
            subject: "Connexion à DazNode",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4F46E5;">Connexion à DazNode</h1>
                <p>Cliquez sur le lien ci-dessous pour vous connecter :</p>
                <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Se connecter
                </a>
                <p style="margin-top: 20px; color: #666;">
                  Ce lien expire dans 24 heures. Si vous n'avez pas demandé cette connexion, ignorez cet email.
                </p>
              </div>
            `,
          });
          // Log succès
          console.info(`[AUTH] Email envoyé avec succès à: ${email}`);
        } catch (error) {
          // Log échec
          console.error(`[AUTH] Erreur envoi email à ${email}:`, error);
          throw new Error("Impossible d'envoyer l'email de connexion");
        }
      },
    }),
    CredentialsProvider({
      id: "lnurl-auth",
      name: "LNURL-Auth",
      credentials: {
        pubkey: { label: "Clé publique", type: "text" },
        k1: { label: "k1", type: "text" },
        sig: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.pubkey || !credentials?.k1 || !credentials?.sig) {
          throw new Error("Données LNURL manquantes");
        }
        const valid = await verifyLnurlAuth(credentials.pubkey, credentials.k1, credentials.sig);
        if (!valid) return null;
        return {
          id: credentials.pubkey,
          name: "Utilisateur Lightning",
          email: null,
          pubkey: credentials.pubkey,
          lnurl: true,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user: _user }) {
      if (session.user?.email) {
        // Récupérer les données du profil depuis Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (profile) {
          session.user.id = profile.id;
          session.user.nom = profile.nom;
          session.user.prenom = profile.prenom;
          session.user.t4g_tokens = profile.t4g_tokens;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 