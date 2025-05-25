'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlbyLoginButton from '@/app/api/auth/AlbyLoginButton';

export default function LoginPage(): React.ReactElement {
  const [form, setForm] = useState({ email: '', code: '' });
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 2 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

  const handleSendCode = async (): Promise<void> => {
    setError(null);
    setInfo(null);
    if (!form.email) {
      setError('Veuillez saisir votre email');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    });
    setLoading(false);
    if (res.ok) {
      setStep(2);
      setInfo('Un code vient de vous être envoyé par email.');
    } else {
      setError("Erreur lors de l'envoi du code");
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    setError(null);
    setInfo(null);
    if (!form.email || !form.code) {
      setError('Veuillez saisir votre email et le code reçu');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, code: form.code })
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('jwt', data.token);
      if (form.email.trim().toLowerCase() === 'contact@dazno.de') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user');
      }
    } else {
      setError('Code invalide ou expiré');
    }
  };

  // --- Connexion par LNURL-auth (compatible Alby) ---
  const handleLightningLogin = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      if (!window.webln) {
        setError('Aucune extension Lightning/WebLN détectée. Installez Alby ou équivalent.');
        setLoading(false);
        return;
      }
      
      await window.webln.enable();
      
      // Générer un challenge unique pour cette session
      const challenge = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Créer l'URL LNURL-auth
      const domain = window.location.host;
      const authUrl = `${window.location.protocol}//${domain}/api/auth/lnurl-auth?challenge=${challenge}`;
      const lnurlAuth = `lightning:lnurl${btoa(authUrl).replace(/=/g, '')}`;
      
             // Essayer d'utiliser l'API LNURL-auth si disponible
       if (window.webln && 'lnurl' in window.webln) {
         try {
           const weblnLnurl = window.webln as any;
           await weblnLnurl.lnurl(lnurlAuth);
           
           // Attendre et vérifier l'authentification
           let attempts = 0;
           const maxAttempts = 30; // 30 secondes max
           
           while (attempts < maxAttempts) {
             await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
             
             const authCheck = await fetch(`/api/auth/check-lnurl-auth?challenge=${challenge}`);
             if (authCheck.ok) {
               const authData = await authCheck.json();
               if (authData.authenticated) {
                 // Générer le token
                 const tokenResponse = await fetch('/api/auth/lnurl-auth', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ challenge })
                 });
                 
                 if (tokenResponse.ok) {
                   const tokenData = await tokenResponse.json();
                   localStorage.setItem('jwt', tokenData.token);
                   router.push('/user');
                   return;
                 }
               }
             }
             attempts++;
           }
           
           setError('Délai d\'authentification expiré. Veuillez réessayer.');
         } catch (lnurlError) {
           console.warn('LNURL-auth échoué, essai de fallback:', lnurlError);
           // Fallback vers redirection manuelle
           window.location.href = lnurlAuth;
         }
       } else {
         // Pas de support LNURL, redirection manuelle
         setError(`Votre wallet ne supporte pas LNURL-auth automatique. Cliquez ici pour vous authentifier : ${lnurlAuth}`);
       }
      
    } catch (e) {
      if (e instanceof Error && e.message.includes('SignMessage is not supported')) {
        setError('Votre wallet Alby ne supporte pas l\'authentification par signature. Veuillez configurer une Master Key dans Alby ou utiliser l\'authentification par email.');
      } else {
        setError('Erreur lors de la connexion Lightning : ' + (e instanceof Error ? e.message : String(e)));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
          {step === 1
            ? 'Recevez votre code de connexion'
            : 'Entrez le code reçu par email'}
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={e => {
            e.preventDefault();
            step === 1 ? handleSendCode() : handleVerifyCode();
          }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="exemple@domaine.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  disabled={loading || step === 2}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
                </span>
              </div>
            </div>
            {step === 2 && (
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Code reçu
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Code reçu par email"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  disabled={loading}
                  ref={codeInputRef}
                />
                <button
                  type="button"
                  className="text-xs text-indigo-600 mt-2 underline"
                  onClick={() => {
                    setStep(1);
                    setForm({ ...form, code: '' });
                  }}
                  disabled={loading}
                >
                  Changer d'email
                </button>
              </div>
            )}
          </div>
          {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mt-2 text-sm">{error}</div>}
          {info && <div className="bg-green-100 text-green-700 px-3 py-2 rounded mt-2 text-sm">{info}</div>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading
                ? (step === 1 ? 'Envoi du code...' : 'Connexion...')
                : (step === 1 ? 'Recevoir le code' : 'Se connecter')}
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-center">
            <span className="text-gray-400 text-xs mr-2">ou</span>
            <AlbyLoginButton onClick={handleLightningLogin} />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <div className="flex items-center mb-1">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <strong>Authentification Lightning</strong>
            </div>
            <p>Si Alby affiche "SignMessage not supported", essayez :</p>
            <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
              <li>Configurer une Master Key dans Alby</li>
              <li>Utiliser un autre wallet compatible LNURL-auth</li>
              <li>Ou utiliser l'authentification par email ci-dessus</li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center mt-4">
          Votre email ne sera jamais partagé. <br />
          <span className="italic">Besoin d'aide ? Contactez-nous.</span>
        </div>
      </div>
    </div>
  );
}
