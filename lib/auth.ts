import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Client Supabase pour NextAuth.js
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Instance Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
        } catch (error) {
          console.error('Erreur envoi email Resend:', error);
          throw new Error('Impossible d\'envoyer l\'email de connexion');
        }
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
          (session.user as any).id = profile.id;
          (session.user as any).nom = profile.nom;
          (session.user as any).prenom = profile.prenom;
          (session.user as any).t4g_tokens = profile.t4g_tokens;
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