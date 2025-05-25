import { supabase } from '@/lib/supabase';

export class OTPService {
  /**
   * Génère un code OTP à 6 chiffres
   */
  private generateOTP(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /**
   * Crée une nouvelle tentative OTP dans la base de données
   */
  async createOTPAttempt(email: string): Promise<string> {
    // Nettoyer les anciens codes pour cet email
    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', email);

    // Nettoyer les codes expirés
    await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', Date.now());

    const code = this.generateOTP();
    const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes

    const { error } = await supabase
      .from('otp_codes')
      .insert({
        id: `${email}_${Date.now()}`,
        email,
        code,
        expires_at: expiresAt
      });

    if (error) {
      console.error('[OTP-SERVICE] Erreur création code:', error);
      throw new Error('Erreur lors de la création du code OTP');
    }

    return code;
  }

  /**
   * Vérifie un code OTP
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    // Normaliser le code
    const normalizedCode = String(code).trim().replace(/\s+/g, '');

    // Nettoyer les codes expirés
    await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', Date.now());

    // Récupérer le code
    const { data: otpEntry, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', normalizedCode)
      .single();

    if (error || !otpEntry) {
      return false;
    }

    // Vérifier l'expiration
    if (otpEntry.expires_at < Date.now()) {
      await supabase.from('otp_codes').delete().eq('id', otpEntry.id);
      return false;
    }

    // Supprimer le code après usage
    await supabase.from('otp_codes').delete().eq('id', otpEntry.id);
    return true;
  }

  /**
   * Supprime tous les codes pour un email
   */
  async clearOTPForEmail(email: string): Promise<void> {
    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', email);
  }

  /**
   * Nettoie tous les codes expirés
   */
  async cleanupExpiredCodes(): Promise<void> {
    await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', Date.now());
  }
} 