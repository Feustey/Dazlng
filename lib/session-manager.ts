import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SUPABASE_SESSION_CONFIG } from './supabase-config';

export class SessionManager {
  private static instance: SessionManager;
  private supabase = createClientComponentClient();
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initSessionMonitoring();
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initialise la surveillance de session avec auto-refresh
   */
  private async initSessionMonitoring(): Promise<void> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (session) {
        this.scheduleRefresh(session.expires_at || 0);
      }

      // Écouter les changements de session
      this.supabase.auth.onAuthStateChange((event, session) => {
        console.log('[SessionManager] Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          this.scheduleRefresh(session.expires_at || 0);
        } else if (event === 'SIGNED_OUT') {
          this.clearRefreshTimer();
        }
      });
    } catch (error) {
      console.error('[SessionManager] Erreur initialisation:', error);
    }
  }

  /**
   * Programme le rafraîchissement automatique de la session
   */
  private scheduleRefresh(expiresAt: number): void {
    this.clearRefreshTimer();

    const now = Math.floor(Date.now() / 1000);
    const refreshTime = expiresAt - SUPABASE_SESSION_CONFIG.AUTO_REFRESH_BEFORE_EXPIRY;
    const timeUntilRefresh = (refreshTime - now) * 1000;

    if (timeUntilRefresh > 0) {
      console.log(`[SessionManager] Refresh programmé dans ${Math.floor(timeUntilRefresh / 1000)}s`);
      
      this.refreshTimer = setTimeout(async () => {
        await this.refreshSession();
      }, timeUntilRefresh);
    } else {
      // La session expire bientôt, rafraîchir immédiatement
      this.refreshSession();
    }
  }

  /**
   * Rafraîchit la session utilisateur
   */
  private async refreshSession(): Promise<void> {
    try {
      console.log('[SessionManager] Rafraîchissement de la session...');
      
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) {
        console.error('[SessionManager] Erreur refresh:', error);
        this.handleSessionExpired();
        return;
      }

      if (data.session) {
        console.log('[SessionManager] Session rafraîchie avec succès');
        this.scheduleRefresh(data.session.expires_at || 0);
      }
    } catch (error) {
      console.error('[SessionManager] Erreur lors du refresh:', error);
      this.handleSessionExpired();
    }
  }

  /**
   * Gère l'expiration de session
   */
  private handleSessionExpired(): void {
    console.log('[SessionManager] Session expirée, redirection vers login');
    this.clearRefreshTimer();
    
    // Rediriger vers la page de connexion
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
    }
  }

  /**
   * Nettoie le timer de rafraîchissement
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Vérifie si la session actuelle est valide
   */
  public async isSessionValid(): Promise<boolean> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      
      return expiresAt > now;
    } catch (error) {
      console.error('[SessionManager] Erreur vérification session:', error);
      return false;
    }
  }

  /**
   * Force un rafraîchissement de session
   */
  public async forceRefresh(): Promise<boolean> {
    try {
      await this.refreshSession();
      return await this.isSessionValid();
    } catch (error) {
      console.error('[SessionManager] Erreur force refresh:', error);
      return false;
    }
  }

  /**
   * Obtient le temps restant avant expiration (en secondes)
   */
  public async getTimeUntilExpiry(): Promise<number> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session?.expires_at) {
        return 0;
      }

      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, session.expires_at - now);
    } catch (error) {
      console.error('[SessionManager] Erreur calcul expiration:', error);
      return 0;
    }
  }
}

// Initialiser le gestionnaire de session côté client
if (typeof window !== 'undefined') {
  SessionManager.getInstance();
} 