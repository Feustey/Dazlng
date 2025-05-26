'use client';

import { useState } from 'react';
import OTPLogin from './components/OTPLogin';
import LightningLogin from './components/LightningLogin';
import WalletLogin from './components/WalletLogin';
import AlgorandWalletLogin from './components/AlgorandWalletLogin';

type LoginMethod = 'otp' | 'lightning' | 'wallet' | 'algorand' | null;

export default function LoginPage(): React.ReactElement {
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>('otp');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {selectedMethod === 'otp' ? (
          <div className="space-y-6">
            {/* Section OTP par défaut */}
            <OTPLogin />
            
            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Section Web3 */}
            <div className="space-y-4">
              <h3 className="text-center text-lg font-medium text-gray-900">
                Connectez-vous en Web 3 :
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedMethod('lightning')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl group-hover:scale-110 transition-transform">⚡</div>
                    <div className="text-left flex-1">
                      <h4 className="font-medium text-gray-900">Lightning Network</h4>
                      <p className="text-xs text-gray-500">Via Alby ou autre wallet Lightning</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedMethod('wallet')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl group-hover:scale-110 transition-transform">👛</div>
                    <div className="text-left flex-1">
                      <h4 className="font-medium text-gray-900">Wallet / Node</h4>
                      <p className="text-xs text-gray-500">Connexion via votre node Lightning</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedMethod('algorand')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl group-hover:scale-110 transition-transform">🔗</div>
                    <div className="text-left flex-1">
                      <h4 className="font-medium text-gray-900">Algorand Wallet</h4>
                      <p className="text-xs text-gray-500">Pera, Defly, Exodus et autres wallets</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="text-center text-xs text-gray-500">
                <p>Première connexion ? Votre compte sera créé automatiquement</p>
                <p className="mt-1">Besoin d'aide ? <a href="/contact" className="text-indigo-600 hover:text-indigo-500">Contactez-nous</a></p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedMethod('otp')}
              className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux options de connexion
            </button>
            
            {selectedMethod === 'lightning' && <LightningLogin />}
            {selectedMethod === 'wallet' && <WalletLogin />}
            {selectedMethod === 'algorand' && <AlgorandWalletLogin />}
          </div>
        )}
      </div>
    </div>
  );
}
