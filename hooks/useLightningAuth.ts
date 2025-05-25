import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface LightningAuthResult {
  isAuthenticated: boolean;
  publicKey?: string;
  error?: string;
}

// Interface WebLN étendue pour l'authentification
interface WebLNAuth {
  enable: () => Promise<void>;
  sendPayment: (paymentRequest: string) => Promise<{ preimage: string }>;
  signMessage: (message: string) => Promise<{
    message: string;
    signature: string;
    publicKey: string;
  }>;
}

export const useLightningAuth = (): {
  isAuthenticated: boolean;
  publicKey?: string;
  error?: string;
  isLoading: boolean;
  authenticateWithLightning: () => Promise<void>;
  logout: () => void;
} => {
  const [authState, setAuthState] = useState<LightningAuthResult>({
    isAuthenticated: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const authenticateWithLightning = useCallback(async () => {
    setIsLoading(true);
    setAuthState({ isAuthenticated: false });

    try {
      // Vérifier si WebLN est disponible avec signMessage
      if (!window.webln) {
        throw new Error('Extension Lightning non détectée. Veuillez installer Alby ou une autre extension compatible.');
      }

      const webln = window.webln as WebLNAuth;
      if (!webln.signMessage) {
        throw new Error('La fonction signMessage n\'est pas disponible dans votre wallet.');
      }

      // Activer WebLN
      await webln.enable();

      // Générer un nonce pour plus de sécurité
      const nonce = crypto.getRandomValues(new Uint8Array(16)).join('');
      const challenge = `Connexion à Daz3 - ${nonce} - ${new Date().toISOString()}`;
      
      // Demander la signature du message
      const signResult = await webln.signMessage(challenge);
      
      if (!signResult.signature) {
        throw new Error('Signature non reçue du wallet');
      }

      // Envoyer la signature au serveur pour vérification
      const response = await fetch('/api/auth/lightning/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: challenge,
          signature: signResult.signature,
          publicKey: signResult.publicKey,
          nonce
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de la vérification de la signature');
      }

      const { token } = await response.json();
      
      // Stocker le token JWT
      localStorage.setItem('jwt', token);
      
      setAuthState({
        isAuthenticated: true,
        publicKey: signResult.publicKey
      });

      // Redirection après connexion réussie
      router.push('/user/dashboard');

    } catch (error) {
      console.error('Erreur d\'authentification Lightning:', error);
      setAuthState({
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt');
    setAuthState({ isAuthenticated: false });
  }, []);

  return {
    ...authState,
    isLoading,
    authenticateWithLightning,
    logout
  };
}; 