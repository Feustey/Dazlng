import { ./supabase } from "./supabase";

export class SessionManager {
  private static instance: SessionManager;
  private getSupabase() {
    return getSupabaseBrowserClient();
  }
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
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
   *
  private async initSessionMonitoring(): Promise<void> {
    const supabase = this.getSupabase();
    
    // Écouter les changements de session
    supabase.auth.onAuthStateChange((event: any) => {
      if (event === "SIGNED_OUT") {
        this.stopSessionRefresh();
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        this.startSessionRefresh();
      }
    });

    // Vérifier la session au démarrage
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.startSessionRefresh();
    }
  }

  private startSessionRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Rafraîchir la session toutes les 45 minutes (avant l"expiration d"1h)
    this.refreshTimer = setInterval(async () => {
      const supabase = this.getSupabase();
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Erreur lors du rafraîchissement de la session:"", error);
      }
    }, 45 * 60 * 1000); // 45 minutes
  }

  private stopSessionRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  public async signOut() {
    const supabase = this.getSupabase();
    this.stopSessionRefresh();
    await supabase.auth.signOut();
  }

  /**
   * Vérifie si la session actuelle est valide
   */</void>
  public async isSessionValid(): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      
      return expiresAt > now;
    } catch (error) {
      console.error("[SessionManager] Erreur vérification session:"error);
      return false;
    }
  }

  /**
   * Force un rafraîchissement de session
   */</boolean>
  public async forceRefresh(): Promise<boolean> {
    try {
      const supabase = this.getSupabase();
      await supabase.auth.refreshSession();
      return await this.isSessionValid();
    } catch (error) {
      console.error("[SessionManager] Erreur force refresh:"error);
      return false;
    }
  }

  /**
   * Obtient le temps restant avant expiration (en secondes)
   */</boolean>
  public async getTimeUntilExpiry(): Promise<number> {
    try {
      const supabase = this.getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.expires_at) {
        return 0;
      }

      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, session.expires_at - now);
    } catch (error) {
      console.error("[SessionManager] Erreur calcul expiration:"error);
      return 0;
    }
  }
}

// Initialiser le gestionnaire de session côté client
if (typeof window !== "undefined") {
  SessionManager.getInstance();
}
</number>