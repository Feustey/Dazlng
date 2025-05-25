'use client';

import { useState } from 'react';
import OTPLogin from './components/OTPLogin';
import LightningLogin from './components/LightningLogin';
import WalletLogin from './components/WalletLogin';

type LoginMethod = 'otp' | 'lightning' | 'wallet' | null;

export default function LoginPage(): React.ReactElement {
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {!selectedMethod ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Connexion à Daz3
              </h2>
              <p className="text-gray-600">
                Choisissez votre méthode de connexion préférée
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMethod('otp')}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl group-hover:scale-110 transition-transform">📧</div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900">Email OTP</h3>
                    <p className="text-sm text-gray-500">Connexion sécurisée par code email</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('lightning')}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl group-hover:scale-110 transition-transform">⚡</div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900">Lightning Network</h3>
                    <p className="text-sm text-gray-500">Via Alby ou autre wallet Lightning</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('wallet')}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl group-hover:scale-110 transition-transform">👛</div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900">Wallet / Node</h3>
                    <p className="text-sm text-gray-500">Connexion via votre node Lightning</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-center text-xs text-gray-500">
                <p>Première connexion ? Votre compte sera créé automatiquement</p>
                <p className="mt-1">Besoin d'aide ? <a href="/contact" className="text-indigo-600 hover:text-indigo-500">Contactez-nous</a></p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedMethod(null)}
              className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux options de connexion
            </button>
            
            {selectedMethod === 'otp' && <OTPLogin />}
            {selectedMethod === 'lightning' && <LightningLogin />}
            {selectedMethod === 'wallet' && <WalletLogin />}
          </div>
        )}
      </div>
    </div>
  );
}
