// Stockage temporaire en mémoire pour les codes OTP
// En production, utiliser Redis ou une base de données appropriée
interface OTPEntry {
  code: string;
  expiresAt: number;
  email: string;
}

// Stockage global en mémoire
declare global {
  // eslint-disable-next-line no-var
  var otpStorage: Map<string, OTPEntry> | undefined;
}

if (!global.otpStorage) {
  global.otpStorage = new Map();
}

const otpStorage = global.otpStorage;

export class OTPService {
  /**
   * Génère un code OTP à 6 chiffres
   */
  private generateOTP(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /**
   * Crée une nouvelle tentative OTP en mémoire
   */
  async createOTPAttempt(email: string): Promise<string> {
    // Nettoyer les anciens codes pour cet email
    for (const [key, entry] of otpStorage.entries()) {
      if (entry.email === email) {
        otpStorage.delete(key);
      }
    }

    // Nettoyer les codes expirés
    this.cleanupExpiredCodes();

    const code = this.generateOTP();
    const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes
    const key = `${email}_${Date.now()}`;

    otpStorage.set(key, {
      code,
      expiresAt,
      email
    });

    console.log('[OTP-SERVICE] Code créé en mémoire:', { 
      email, 
      code: `${code.substring(0, 2)}****`,
      expiresAt: new Date(expiresAt).toISOString()
    });

    return code;
  }

  /**
   * Vérifie un code OTP
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    // Normaliser le code
    const normalizedCode = String(code).trim().replace(/\s+/g, '');

    // Nettoyer les codes expirés
    this.cleanupExpiredCodes();

    // Chercher le code pour cet email
    for (const [key, entry] of otpStorage.entries()) {
      if (entry.email === email && entry.code === normalizedCode) {
        // Vérifier l'expiration
        if (entry.expiresAt < Date.now()) {
          otpStorage.delete(key);
          console.log('[OTP-SERVICE] Code expiré supprimé:', email);
          return false;
        }

        // Supprimer le code après usage
        otpStorage.delete(key);
        console.log('[OTP-SERVICE] Code validé et supprimé:', email);
        return true;
      }
    }

    console.log('[OTP-SERVICE] Code non trouvé ou invalide:', email);
    return false;
  }

  /**
   * Supprime tous les codes pour un email
   */
  async clearOTPForEmail(email: string): Promise<void> {
    for (const [key, entry] of otpStorage.entries()) {
      if (entry.email === email) {
        otpStorage.delete(key);
      }
    }
  }

  /**
   * Nettoie tous les codes expirés
   */
  async cleanupExpiredCodes(): Promise<void> {
    const now = Date.now();
    for (const [key, entry] of otpStorage.entries()) {
      if (entry.expiresAt < now) {
        otpStorage.delete(key);
      }
    }
  }
} 