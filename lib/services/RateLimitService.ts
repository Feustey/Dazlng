import { getSupabaseAdminClient } from '@/lib/supabase';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export class RateLimitService {
  private defaultConfig: RateLimitConfig = {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000 // 15 minutes
  };

  /**
   * Vérifie si une action est autorisée selon les limites de taux
   */
  async checkRateLimit(
    identifier: string, 
    config: Partial<RateLimitConfig> = {}
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const windowStart = now - finalConfig.windowMs;

    // Nettoyer les anciennes tentatives
    await this.cleanupOldAttempts(identifier, windowStart);

    // Compter les tentatives récentes
    const { data: attempts, error } = await getSupabaseAdminClient()
      .from('rate_limit_attempts')
      .select('created_at')
      .eq('identifier', identifier)
      .gte('created_at', windowStart);

    if (error) {
      console.error('[RATE-LIMIT] Erreur lecture tentatives:', error);
      // En cas d'erreur, on autorise par défaut
      return {
        allowed: true,
        remaining: finalConfig.maxAttempts,
        resetTime: new Date(now + finalConfig.windowMs)
      };
    }

    const currentAttempts = attempts?.length || 0;
    const remaining = Math.max(0, finalConfig.maxAttempts - currentAttempts);
    const allowed = currentAttempts < finalConfig.maxAttempts;

    if (allowed) {
      // Enregistrer cette tentative
      await getSupabaseAdminClient()
        .from('rate_limit_attempts')
        .insert({
          identifier,
          created_at: now
        });
    }

    return {
      allowed,
      remaining: allowed ? remaining - 1 : remaining,
      resetTime: new Date(now + finalConfig.windowMs)
    };
  }

  /**
   * Nettoie les anciennes tentatives
   */
  private async cleanupOldAttempts(identifier: string, windowStart: number): Promise<void> {
    await getSupabaseAdminClient()
      .from('rate_limit_attempts')
      .delete()
      .eq('identifier', identifier)
      .lt('created_at', windowStart);
  }

  /**
   * Nettoie toutes les tentatives expirées
   */
  async cleanupExpiredAttempts(): Promise<void> {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 heures
    await getSupabaseAdminClient()
      .from('rate_limit_attempts')
      .delete()
      .lt('created_at', cutoff);
  }
} 