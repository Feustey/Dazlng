export const SESSION_CONFIG = {
  // Durée de vie de la session (24 heures)
  maxAge: 24 * 60 * 60,

  // Options de sécurité pour les cookies
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  },

  // Durée de vie du code de vérification (5 minutes)
  verificationCodeExpiry: 5 * 60,

  // Nombre maximum de tentatives de vérification
  maxVerificationAttempts: 3,

  // Durée du blocage après trop de tentatives (15 minutes)
  lockoutDuration: 15 * 60,

  // Intervalle de rafraîchissement de la session (1 heure)
  refreshInterval: 60 * 60,
};

export const getSessionExpiry = () => {
  return new Date(Date.now() + SESSION_CONFIG.maxAge * 1000);
};

export const getVerificationCodeExpiry = () => {
  return new Date(Date.now() + SESSION_CONFIG.verificationCodeExpiry * 1000);
};
