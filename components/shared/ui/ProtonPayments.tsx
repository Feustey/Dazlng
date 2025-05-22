'use client';

import { useState, useEffect, useMemo } from 'react';
import ProtonWebSDK from '@proton/web-sdk';
// import type { ProtonSession as _ } from '@proton/web-sdk'

interface ProtonPaymentProps {
  amount: number; // Montant en XPR
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
  productName: string;
}

type _EndpointConfig = {
  url: string;
  method: string;
}

type ProtonSession = {
  auth: { actor: string };
  transact: (args: unknown, opts: unknown) => Promise<{ processed?: unknown; transaction_id?: string }>;
};

const ProtonPayment: React.FC<ProtonPaymentProps> = ({ amount, productName, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<unknown>(null);
  const [session, setSession] = useState<ProtonSession | null>(null);
  const [status, setStatus] = useState<'pending' | 'success'>('pending');
  const [_receiverAccount] = useState<string>('dazpayreceive');

  const appIdentifier = 'dazpay.app';
  const chainId = '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0'; // Proton Mainnet
  const endpoints = useMemo(() => ['https://proton.greymass.com', 'https://proton.eoscafeblock.com'], []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Vérifier s'il y a une session active
        const { link: localLink, session: localSession } = await ProtonWebSDK({
          linkOptions: {
            endpoints,
            chainId,
            restoreSession: true,
          },
          transportOptions: {
            requestAccount: appIdentifier
          },
          selectorOptions: {
            appName: "DazPay",
            appLogo: "/assets/images/logo.png",
            customStyleOptions: {
              modalBackgroundColor: "#F4F7FA",
              logoBackgroundColor: "white",
              isLogoRound: true,
              optionBackgroundColor: "white",
              optionFontColor: "black",
              primaryFontColor: "black",
              secondaryFontColor: "#6B727F",
              linkColor: "#752EEB"
            }
          }
        });

        if (localLink && localSession) {
          setLink(localLink);
          setSession(localSession as unknown as ProtonSession);
        }
      } catch (err) {
        setError(`Erreur de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
    fetchData()
  }, [endpoints])

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { link: localLink, session: localSession } = await ProtonWebSDK({
        linkOptions: {
          endpoints,
          chainId,
          restoreSession: false,
        },
        transportOptions: {
          requestAccount: appIdentifier
        },
        selectorOptions: {
          appName: "DazPay",
          appLogo: "/assets/images/logo.png",
          customStyleOptions: {
            modalBackgroundColor: "#F4F7FA",
            logoBackgroundColor: "white",
            isLogoRound: true,
            optionBackgroundColor: "white",
            optionFontColor: "black",
            primaryFontColor: "black",
            secondaryFontColor: "#6B727F",
            linkColor: "#752EEB"
          }
        }
      });

      if (localLink && localSession) {
        setLink(localLink);
        setSession(localSession as unknown as ProtonSession);
      } else {
        throw new Error('Connexion annulée ou échouée');
      }
    } catch (err) {
      setError(`Erreur de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (link && session && typeof appIdentifier === 'string' && typeof session.auth === 'object' && typeof chainId === 'string') {
      await (link as { removeSession: (appIdentifier: string, auth: { actor: string }, chainId: string) => Promise<void> }).removeSession(appIdentifier, session.auth, chainId);
    }
    setSession(null);
    setLink(null);
  };

  const processPayment = async (): Promise<void> => {
    if (!session) {
      await login();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Formater le montant avec 4 décimales (format XPR)
      const formattedAmount = (+amount).toFixed(4);

      // Créer la transaction
      const result = await session.transact({
        actions: [{
          account: "eosio.token",
          name: "transfer",
          data: {
            from: session.auth.actor,
            to: _receiverAccount,
            quantity: `${formattedAmount} XPR`,
            memo: `Paiement pour ${productName}`
          },
          authorization: [session.auth]
        }]
      }, {
        broadcast: true
      });

      if (result && result.processed) {
        setStatus('success');
        if (onSuccess && typeof result.transaction_id === 'string') {
          onSuccess(result.transaction_id);
        }
      }
    } catch (err) {
      setError(`Erreur de paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/90 rounded-2xl shadow-2xl max-w-md mx-auto">
        <div className="w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 mb-2">Paiement réussi</h3>
        <p className="text-gray-700 mb-4 text-center">
          Votre paiement de {amount} XPR a été traité avec succès.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/90 rounded-2xl shadow-2xl max-w-md mx-auto">
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 mb-2">Paiement Proton</h3>
      <p className="text-gray-700 mb-4 text-center">
        Payez avec votre wallet Proton pour {productName}
      </p>
      
      <div className="mb-4 w-full bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Montant :</span>
          <span className="font-bold">{amount} XPR</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">Destinataire :</span>
          <span className="font-mono text-sm">{_receiverAccount}</span>
        </div>
      </div>

      {error && (
        <div className="w-full mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        className="w-full px-5 py-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white font-bold rounded-lg shadow-md hover:scale-105 transition mb-3 disabled:opacity-50 disabled:hover:scale-100"
        onClick={processPayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Traitement en cours...
          </span>
        ) : (
          session ? "Payer avec Proton Wallet" : "Se connecter à Proton Wallet"
        )}
      </button>

      {session && (
        <div className="text-sm text-gray-600 mb-2">
          Connecté en tant que: <span className="font-medium">{session.auth.actor}</span>
        </div>
      )}

      {session && (
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={logout}
          disabled={isLoading}
        >
          Déconnexion
        </button>
      )}

      {onCancel && (
        <button
          className="mt-4 px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-300 transition"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </button>
      )}
    </div>
  );
};

export default ProtonPayment;