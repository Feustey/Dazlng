import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

export class RateLimiter {
  private supabase;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    
    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL est manquante dans les variables d\'environnement');
    }
    
    if (!supabaseAnonKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY est manquante dans les variables d\'environnement');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    this.config = {
      blockDurationMs: 3600000, // 1 heure par défaut
      ...config
    };
  }

  /**
   * Vérifie si une requête est autorisée
   */
  async isAllowed(req: NextRequest): Promise<boolean> {
    const key = this.getKey(req);

    try {
      // 1. Vérifier si l'IP est bloquée
      const { data: block } = await this.supabase
        .from('rate_limit_blocks')
        .select('expires_at')
        .eq('key', key)
        .single();

      if (block) {
        const expiresAt = new Date(block.expires_at);
        if (expiresAt > new Date()) {
          return false;
        }
        // Supprimer le bloc expiré
        await this.supabase
          .from('rate_limit_blocks')
          .delete()
          .eq('key', key);
      }

      // 2. Compter les requêtes dans la fenêtre
      const windowStart = new Date(Date.now() - this.config.windowMs);
      
      const { count } = await this.supabase
        .rpc('count_requests', {
          p_key: key,
          p_start: windowStart.toISOString()
        });

      // 3. Si limite dépassée, bloquer l'IP
      if (count && count >= this.config.maxRequests) {
        await this.blockKey(key);
        return false;
      }

      // 4. Enregistrer la nouvelle requête
      await this.supabase
        .from('rate_limits')
        .insert({ key });

      return true;

    } catch (error) {
      console.error('❌ RateLimiter - Erreur:', error);
      return true; // En cas d'erreur, autoriser la requête
    }
  }

  /**
   * Bloque une clé pour la durée configurée
   */
  private async blockKey(key: string) {
    const blockDuration = this.config.blockDurationMs || 3600000;
    const expiresAt = new Date(Date.now() + blockDuration);
    
    await this.supabase
      .from('rate_limit_blocks')
      .upsert({
        key,
        expires_at: expiresAt.toISOString()
      });
  }

  /**
   * Génère une clé unique pour la requête
   */
  private getKey(req: NextRequest): string {
    // Récupérer l'IP depuis les headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    const path = new URL(req.url).pathname;
    return `${ip}:${path}`;
  }
}

/**
 * Crée un middleware de rate limiting
 */
export function rateLimit(config: RateLimitConfig) {
  const limiter = new RateLimiter(config);

  return async function rateLimitMiddleware(req: NextRequest) {
    const allowed = await limiter.isAllowed(req);
    
    if (!allowed) {
      return new Response('Too Many Requests', { status: 429 });
    }
  };
}
