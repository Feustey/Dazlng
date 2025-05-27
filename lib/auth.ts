import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/utils/email';
import { z } from "zod";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyLnurlAuth } from "@/lib/lnurl-auth";

// Client Supabase pour NextAuth.js
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      from: process.env.EMAIL_FROM || 'contact@dazno.de',
      // ✅ INTÉGRER VOTRE LOGIQUE OTP
      sendVerificationRequest: async ({ identifier: email, url: _url, provider: _provider }) => {
        console.log("[NEXTAUTH-OTP] Envoi code OTP à:", email);

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

        try {
          // Nettoyage des anciens codes expirés
          console.log("[NEXTAUTH-OTP] Suppression des anciens codes expirés");
          await supabase.from('otp_codes').delete().lt('expires_at', Date.now());

          // Générer un code OTP à 6 chiffres
          const code = String(Math.floor(100000 + Math.random() * 900000));
          const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
          console.log("[NEXTAUTH-OTP] Code OTP généré:", code);

          // Désactiver les anciens codes non utilisés pour cet email
          console.log("[NEXTAUTH-OTP] Désactivation des anciens codes non utilisés");
          await supabase.from('otp_codes').update({ used: true }).eq('email', email).eq('used', false);

          // Insérer le nouveau code
          console.log("[NEXTAUTH-OTP] Insertion du nouveau code OTP");
          const { error: insertError } = await supabase.from('otp_codes').insert([{
            email,
            code,
            expires_at: expiresAt,
            used: false,
            attempts: 0
          }]);

          if (insertError) {
            console.error("[NEXTAUTH-OTP] Erreur insertion:", insertError);
            throw new Error('Erreur lors de la création du code OTP');
          }

          // Envoyer l'email avec le code OTP
          console.log("[NEXTAUTH-OTP] Envoi de l'email OTP à", email);
          await sendEmail({
            to: email,
            subject: 'Votre code de connexion DazNode',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4F46E5;">Connexion à DazNode</h1>
                <p>Votre code de connexion est :</p>
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${code}</span>
                </div>
                <p>Ce code expire dans 15 minutes.</p>
                <p style="color: #666; font-size: 14px;">
                  Si vous n'avez pas demandé cette connexion, ignorez cet email.
                </p>
              </div>
            `
          });

          console.log("[NEXTAUTH-OTP] Code envoyé avec succès");
        } catch (error) {
          console.error("[NEXTAUTH-OTP] Erreur:", error);
          throw new Error("Impossible d'envoyer le code de connexion");
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
    verifyRequest: '/auth/verify-code',
    error: '/auth/error'
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 