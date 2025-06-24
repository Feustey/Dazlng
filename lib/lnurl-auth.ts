import * as secp from "@noble/secp256k1";

export async function verifyLnurlAuth(pubkey: string, k1: string, sig: string): Promise<boolean> {
  try {
    // Vérifie la signature LNURL-Auth (ECDSA)
    const pub = pubkey.startsWith("0x") ? pubkey.slice(2) : pubkey;
    const signature = sig.startsWith("0x") ? sig.slice(2) : sig;
    const message = k1.startsWith("0x") ? k1.slice(2) : k1;
    return secp.verify(signature, message, pub);
  } catch (e) {
    return false;
  }
}
