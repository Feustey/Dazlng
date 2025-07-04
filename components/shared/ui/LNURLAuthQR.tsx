"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface LNURLAuthQRProps {
  challenge: string;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

export const LNURLAuthQR: React.FC<LNURLAuthQRProps> = ({ challenge, onSuccess, onError }) => {
  const [lnurlAuth, setLnurlAuth] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Générer l'URL LNURL-auth
    const domain = window.location.host;
    const authUrl = `${window.location.protocol}//${domain}/api/auth/lnurl-auth?challenge=${challenge}`;
    const lnurlEncoded = `lnurl${btoa(authUrl).replace(/=/g, '').toLowerCase()}`;
    setLnurlAuth(lnurlEncoded);

    // Commencer à vérifier l'authentification
    setIsChecking(true);

    const checkAuthStatus = async (): Promise<void> => {
      let attempts = 0;
      const maxAttempts = 60; // 1 minute max

      while (attempts < maxAttempts) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
          
          const response = await fetch(`/api/auth/check-lnurl-auth?challenge=${challenge}`);
          if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
              // Générer le token
              const tokenResponse = await fetch('/api/auth/lnurl-auth', {
                method: 'POST',
                headers: { "LNURLAuthQR.lnurlauthqrlnurlauthqrcontentt": 'application/json' },
                body: JSON.stringify({ challenge })
              });
              
              if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                onSuccess(tokenData.token);
                return;
              }
            }
          }
          attempts++;
        } catch (error) {
          console.error('Erreur vérification auth:', error);
        }
      }

      if (attempts >= maxAttempts) {
        onError('Délai d\'authentification expiré');
      }
    };

    checkAuthStatus();
  }, [challenge, onSuccess, onError]);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(lnurlAuth).then(() => {
      alert('LNURL copié dans le presse-papiers !');
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center max-w-sm mx-auto">
      <h3 className="text-lg font-semibold mb-4">{t('LNURLAuthQR.authentification_lightning')}</h3>
      
      <div className="mb-4">
        {lnurlAuth && (
          <QRCodeSVG 
            value={lnurlAuth.toUpperCase()} 
            size={200} 
            className="mx-auto"
          />
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Scannez ce QR code avec votre wallet Lightning compatible LNURL-auth
      </p>

      <button
        onClick={copyToClipboard}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition"
      >
        Copier le code LNURL
      </button>

      <div className="mt-4 text-xs text-gray-500">
        Wallets compatibles : Zeus, BlueWallet, Phoenix, Breez, etc.
      </div>

      {isChecking && (
        <div className="mt-3 flex items-center justify-center text-sm text-blue-600">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          En attente d'authentification...
        </div>
      )}
    </div>
  );
}

export default LNURLAuthQR;
