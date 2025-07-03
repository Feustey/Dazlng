'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

type AdminAuthPageProps = Record<string, never>

const AdminAuthPage: FC<AdminAuthPageProps> = () => {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('admin@dazno.de');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si déjà authentifié
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          // Vérifier si c'est un admin (@dazno.de)
          if (data.user?.email?.includes('@dazno.de')) {
            router.push('/admin/dashboard');
          }
        }
      } catch (error) {
        console.log('Non authentifié');
      }
    };
    checkAuth();
  }, [router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Vérifier que c'est bien admin@dazno.de
    if (email !== 'admin@dazno.de') {
      setError('Seul admin@dazno.de peut accéder à l\'administration');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/otp/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: 'Administrateur DazNode',
          source: 'admin-auth'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('code');
      } else {
        setError(data.error?.message || 'Erreur lors de l\'envoi du code');
      }
    } catch (error) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/otp/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code,
          name: 'Administrateur DazNode'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Rediriger vers le dashboard admin
        router.push('/admin/dashboard');
      } else {
        setError(data.error?.message || 'Code invalide ou expiré');
      }
    } catch (error) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration DazNode
          </h1>
          <p className="text-gray-600">
            Accès réservé aux administrateurs
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email administrateur
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le code OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Code envoyé à {email}
              </p>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e: any) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Vérification...' : 'Valider le code'}
              </button>

              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Retour
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            DazNode Admin Panel v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage; export const dynamic = "force-dynamic";
