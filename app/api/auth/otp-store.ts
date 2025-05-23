// Stockage temporaire en mémoire (à remplacer par Redis ou DB en prod)
export const otpStore = new Map<string, { code: string; expires: number }>(); 