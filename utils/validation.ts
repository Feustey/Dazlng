export const validateLightningPubkey = (pubkey: string): boolean => {
  // La clé doit commencer par 02 ou 03 et avoir une longueur totale de 66 caractères
  const pubkeyRegex = /^(02|03)[0-9a-fA-F]{64}$/;
  return pubkeyRegex.test(pubkey);
};

export const getPubkeyError = (pubkey: string): string | null => {
  if (!pubkey) return "La clé publique est requise";
  if (!validateLightningPubkey(pubkey)) {
    return "La clé publique doit commencer par 02 ou 03 et contenir 66 caractères hexadécimaux";
  }
  return null;
}; 