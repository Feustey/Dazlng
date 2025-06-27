import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { CROSS_DOMAIN_CONFIG } from '../supabase-config';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';

export interface CrossDomainUser {
  id: string;
  email: string;
  name?: string;
}

export interface SessionVerificationResponse {
  authenticated: boolean;
  user?: CrossDomainUser;
  error?: string;
}

/**
 * Service de gestion des sessions cross-domain pour Token For Good
 */
export class CrossDomainSessionService {
  
  /**
   * Crée un client Supabase avec configuration cross-domain
   */
  static createSupabaseClient() {
    const cookieStore = cookies();
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Configuration cross-domain pour les cookies
            cookieStore.set({ 
              name, 
              value, 
              ...CROSS_DOMAIN_CONFIG.COOKIE_CONFIG,
              ...options 
            });
          },
          remove(name: string, options: any) {
            cookieStore.set({ 
              name, 
              value: '', 
              ...CROSS_DOMAIN_CONFIG.COOKIE_CONFIG,
              ...options 
            });
          },
        },
      }
    );
  }

  /**
   * Vérifie si l'utilisateur est authentifié et retourne ses informations
   */
  static async verifySession(): Promise<SessionVerificationResponse> {
    try {
      const supabase = this.createSupabaseClient();
      
      // Récupérer la session actuelle
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return {
          authenticated: false,
          error: 'Aucune session active'
        };
      }

      // Récupérer les informations utilisateur depuis la table profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, nom, prenom')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        return {
          authenticated: false,
          error: 'Profil utilisateur non trouvé'
        };
      }

      const user: CrossDomainUser = {
        id: profile.id,
        email: profile.email,
        name: profile.nom && profile.prenom ? `${profile.prenom} ${profile.nom}` : undefined,
      };

      return {
        authenticated: true,
        user
      };

    } catch (error) {
      console.error('❌ Erreur vérification session cross-domain:', error);
      return {
        authenticated: false,
        error: 'Erreur lors de la vérification de la session'
      };
    }
  }

  /**
   * Vérifie un token Bearer et retourne les informations utilisateur
   */
  static async verifyBearerToken(authHeader: string): Promise<SessionVerificationResponse> {
    try {
      if (!authHeader.startsWith('Bearer ')) {
        return {
          authenticated: false,
          error: 'Format Bearer token invalide'
        };
      }

      const token = authHeader.substring(7);
      const user = this.verifyTokenForGood(token);

      if (!user) {
        return {
          authenticated: false,
          error: 'Token invalide ou expiré'
        };
      }

      return {
        authenticated: true,
        user
      };

    } catch (error) {
      console.error('❌ Erreur vérification Bearer token:', error);
      return {
        authenticated: false,
        error: 'Erreur lors de la vérification du token'
      };
    }
  }

  /**
   * Génère un token JWT pour Token For Good
   */
  static generateTokenForGood(user: CrossDomainUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      iss: 'dazeno.de',
      aud: 'token-for-good.com',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 heure
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  /**
   * Vérifie un token JWT de Token For Good
   */
  static verifyTokenForGood(token: string): CrossDomainUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Vérifier que le token est destiné à Token For Good
      if (decoded.aud !== 'token-for-good.com') {
        return null;
      }

      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };
    } catch (error) {
      console.error('❌ Erreur vérification token Token For Good:', error);
      return null;
    }
  }

  /**
   * Crée une URL de redirection vers Token For Good avec token
   */
  static createTokenForGoodRedirect(user: CrossDomainUser): string {
    const token = this.generateTokenForGood(user);
    return `https://app.token-for-good.com/login?token=${encodeURIComponent(token)}`;
  }

  /**
   * Configure les headers CORS pour Token For Good
   */
  static getCorsHeaders(): Record<string, string> {
    return {
      'Access-Control-Allow-Origin': CROSS_DOMAIN_CONFIG.CORS_CONFIG.origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': CROSS_DOMAIN_CONFIG.CORS_CONFIG.methods.join(', '),
      'Access-Control-Allow-Headers': CROSS_DOMAIN_CONFIG.CORS_CONFIG.allowedHeaders.join(', ')
    };
  }
} 