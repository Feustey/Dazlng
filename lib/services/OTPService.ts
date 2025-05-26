import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

interface EmailTrackingData {
  email: string;
  first_seen_at?: string;
  last_seen_at?: string;
  total_logins?: number;
  conversion_status?: string;
  marketing_consent?: boolean;
  source?: string;
  notes?: string;
}

interface ConversionAnalysis {
  shouldPromptForAccount: boolean;
  loginCount: number;
  daysSinceFirstLogin: number;
  conversionStatus: string;
}

export class OTPService {
  private getClient(): SupabaseClient {
    // Utilise le client admin si disponible, sinon fallback sur le client public
    return supabaseAdmin || supabase;
  }

  /**
   * Génère un code OTP à 6 chiffres
   */
  private generateOTP(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /**
   * Crée une nouvelle tentative OTP avec tracking complet
   */
  async createOTPAttempt(email: string, source: string = 'otp_login', _userAgent?: string): Promise<string> {
    const client = this.getClient();
    try {
      // 1. Nettoyer les codes expirés
      try {
        await this.cleanupExpiredCodes();
      } catch (cleanupError) {
        console.warn('[OTP-SERVICE] Échec nettoyage codes expirés:', cleanupError);
        // Continue même si le nettoyage échoue
      }
      
      // 2. Désactiver les codes existants non utilisés pour cet email
      const { error: updateError } = await client
        .from('otp_codes')
        .update({ used: true })
        .eq('email', email)
        .eq('used', false);
        
      if (updateError) {
        console.warn('[OTP-SERVICE] Échec désactivation codes existants:', {
          code: updateError.code,
          message: updateError.message,
          email: email
        });
        // Continue même si la désactivation échoue
      }

      // 3. Générer nouveau code
      const code = this.generateOTP();
      const expiresAtMs = Date.now() + (15 * 60 * 1000); // 15 minutes

      // 4. Créer le nouveau code OTP en base
      const { error: otpError } = await client
        .from('otp_codes')
        .insert({
          email,
          code,
          expires_at: expiresAtMs,
          used: false,
          attempts: 0
        });

      if (otpError) {
        console.error('[OTP-SERVICE] Erreur création code:', {
          code: otpError.code,
          message: otpError.message,
          details: otpError.details,
          hint: otpError.hint,
          email: email
        });
        
        // Gestion spécifique des erreurs
        if (otpError.code === '42501') {
          throw new Error('Permissions insuffisantes pour créer le code OTP. Vérifiez les politiques RLS.');
        } else if (otpError.code === '23505') {
          throw new Error('Conflit de données lors de la création du code OTP. Réessayez dans quelques secondes.');
        } else if (otpError.code === '42P01') {
          throw new Error('Table otp_codes introuvable. Vérifiez la configuration de la base de données.');
        } else {
          throw new Error(`Erreur création code OTP: ${otpError.message || 'Erreur inconnue'}`);
        }
      }

      // 5. Mettre à jour ou créer le tracking email
      await this.updateEmailTracking(email, source, 'login_attempt');

      console.log('[OTP-SERVICE] Code créé en base:', { 
        email, 
        code: `${code.substring(0, 2)}****`,
        expiresAt: new Date(expiresAtMs).toISOString(),
        source
      });

      return code;

    } catch (error) {
      console.error('[OTP-SERVICE] Erreur createOTPAttempt:', error);
      throw error;
    }
  }

  /**
   * Vérifie un code OTP avec analytics
   */
  async verifyOTP(email: string, code: string): Promise<{
    isValid: boolean;
    conversionAnalysis?: ConversionAnalysis;
  }> {
    const client = this.getClient();
    try {
      const normalizedCode = String(code).trim().replace(/\s+/g, '');

      // 1. Chercher le code en base
      const { data: otpEntry, error: fetchError } = await client
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', normalizedCode)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('[OTP-SERVICE] Erreur fetch code:', fetchError);
        return { isValid: false };
      }

      if (!otpEntry) {
        console.log('[OTP-SERVICE] Code non trouvé:', email);
        return { isValid: false };
      }

      // 2. Vérifier l'expiration
      if (otpEntry.expires_at < Date.now()) {
        await client
          .from('otp_codes')
          .update({ used: true })
          .eq('id', otpEntry.id);
        
        console.log('[OTP-SERVICE] Code expiré:', email);
        return { isValid: false };
      }

      // 3. Marquer le code comme utilisé
      await client
        .from('otp_codes')
        .update({ 
          used: true,
          attempts: otpEntry.attempts + 1
        })
        .eq('id', otpEntry.id);

      // 4. Mettre à jour le tracking avec connexion réussie
      await this.updateEmailTracking(email, 'otp_login', 'successful_login');

      // 5. Analyser pour conversion
      const conversionAnalysis = await this.analyzeForConversion(email);

      console.log('[OTP-SERVICE] Code validé avec succès:', { 
        email, 
        conversionAnalysis 
      });

      return { 
        isValid: true, 
        conversionAnalysis 
      };

    } catch (error) {
      console.error('[OTP-SERVICE] Erreur verifyOTP:', error);
      return { isValid: false };
    }
  }

  /**
   * Met à jour le tracking des emails avec métadonnées
   */
  private async updateEmailTracking(
    email: string, 
    source: string, 
    action: 'login_attempt' | 'successful_login' | 'account_creation'
  ): Promise<void> {
    try {
      // 1. Vérifier si l'email existe déjà
      const { data: existingTracking } = await supabase
        .from('user_email_tracking')
        .select('*')
        .eq('email', email)
        .single();

      const now = new Date().toISOString();

      if (existingTracking) {
        // Mise à jour existant
        const updateData: Partial<EmailTrackingData> = {
          last_seen_at: now
        };

        if (action === 'successful_login') {
          updateData.total_logins = (existingTracking.total_logins || 0) + 1;
          
          // Analyser pour conversion automatique
          const daysSinceFirst = Math.floor(
            (Date.now() - new Date(existingTracking.first_seen_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Si plus de 3 connexions ou plus de 7 jours, proposer conversion
          if ((existingTracking.total_logins >= 2 && daysSinceFirst >= 7) || 
              (existingTracking.total_logins >= 4)) {
            updateData.conversion_status = 'conversion_candidate';
            updateData.notes = `Auto-détecté: ${existingTracking.total_logins + 1} connexions sur ${daysSinceFirst} jours`;
          }
        } else if (action === 'account_creation') {
          updateData.conversion_status = 'converted';
        }

        await supabase
          .from('user_email_tracking')
          .update(updateData)
          .eq('email', email);

      } else {
        // Création nouveau tracking
        const newTracking: EmailTrackingData = {
          email,
          first_seen_at: now,
          last_seen_at: now,
          total_logins: action === 'successful_login' ? 1 : 0,
          conversion_status: 'otp_only',
          marketing_consent: false,
          source,
          notes: `Premier contact via ${source}`
        };

        const { error: insertError } = await supabase
          .from('user_email_tracking')
          .insert(newTracking);
          
        if (insertError) {
          console.error('[OTP-SERVICE] Erreur création tracking:', {
            code: insertError.code,
            message: insertError.message,
            email: email
          });
          // Ne pas faire échouer le processus principal
        }
      }

      console.log('[OTP-SERVICE] Tracking mis à jour:', { email, action, source });

    } catch (error) {
      console.error('[OTP-SERVICE] Erreur updateEmailTracking:', error);
      // Ne pas faire échouer le processus principal si le tracking échoue
    }
  }

  /**
   * Analyse les données pour déterminer si proposer la conversion
   */
  private async analyzeForConversion(email: string): Promise<ConversionAnalysis> {
    try {
      const { data: tracking } = await supabase
        .from('user_email_tracking')
        .select('*')
        .eq('email', email)
        .single();

      if (!tracking) {
        return {
          shouldPromptForAccount: false,
          loginCount: 0,
          daysSinceFirstLogin: 0,
          conversionStatus: 'new'
        };
      }

      const daysSinceFirstLogin = Math.floor(
        (Date.now() - new Date(tracking.first_seen_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      const loginCount = tracking.total_logins || 0;

      // Critères de conversion :
      // - Plus de 3 connexions OU plus de 7 jours d'utilisation
      // - Pas encore converti
      const shouldPromptForAccount = 
        tracking.conversion_status === 'otp_only' && 
        ((loginCount >= 3) || (daysSinceFirstLogin >= 7 && loginCount >= 2));

      return {
        shouldPromptForAccount,
        loginCount,
        daysSinceFirstLogin,
        conversionStatus: tracking.conversion_status
      };

    } catch (error) {
      console.error('[OTP-SERVICE] Erreur analyzeForConversion:', error);
      return {
        shouldPromptForAccount: false,
        loginCount: 0,
        daysSinceFirstLogin: 0,
        conversionStatus: 'error'
      };
    }
  }

  /**
   * Marque un utilisateur comme converti (création de compte complet)
   */
  async markAsConverted(email: string, notes?: string): Promise<void> {
    try {
      await supabase
        .from('user_email_tracking')
        .update({
          conversion_status: 'converted',
          notes: notes || 'Compte complet créé',
          last_seen_at: new Date().toISOString()
        })
        .eq('email', email);

      console.log('[OTP-SERVICE] Utilisateur marqué comme converti:', email);
    } catch (error) {
      console.error('[OTP-SERVICE] Erreur markAsConverted:', error);
    }
  }

  /**
   * Récupère les statistiques de tracking pour un email
   */
  async getEmailStats(email: string): Promise<EmailTrackingData | null> {
    try {
      const { data } = await supabase
        .from('user_email_tracking')
        .select('*')
        .eq('email', email)
        .single();

      return data;
    } catch (error) {
      console.error('[OTP-SERVICE] Erreur getEmailStats:', error);
      return null;
    }
  }

  /**
   * Nettoie tous les codes expirés
   */
  async cleanupExpiredCodes(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('otp_codes')
        .delete({ count: 'exact' })
        .lt('expires_at', Date.now());

      if (error) {
        console.error('[OTP-SERVICE] Erreur cleanup:', error);
        return 0;
      }

      const deletedCount = count || 0;
      if (deletedCount > 0) {
        console.log(`[OTP-SERVICE] ${deletedCount} codes expirés supprimés`);
      }

      return deletedCount;
    } catch (error) {
      console.error('[OTP-SERVICE] Erreur cleanupExpiredCodes:', error);
      return 0;
    }
  }

  /**
   * Supprime tous les codes pour un email
   */
  async clearOTPForEmail(email: string): Promise<void> {
    try {
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('email', email)
        .eq('used', false);

      console.log('[OTP-SERVICE] Codes supprimés pour:', email);
    } catch (error) {
      console.error('[OTP-SERVICE] Erreur clearOTPForEmail:', error);
    }
  }
} 