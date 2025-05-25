'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OTPLogin(): React.ReactElement {
  const [form, setForm] = useState({ email: '', code: '', name: '' });
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
    
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        setInfo('Un code vient de vous être envoyé par email (valide 15 minutes).');
      } else if (res.status === 429) {
        setError(`${data.error} Réessayez dans quelques minutes.`);
      } else {
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
    }
    
    setLoading(false);
  };

  const handleVerifyCode = async (): Promise<void> => {
    setError(null);
    setInfo(null);
    if (!form.email || !form.code) {
      setError('Veuillez saisir votre email et le code reçu');
      return;
    }
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: form.email, 
          code: form.code,
          name: form.name.trim() || undefined
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('jwt', data.token);
        if (form.email.trim().toLowerCase() === 'contact@dazno.de') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user');
        }
      } else if (res.status === 429) {
        setError(`${data.error} Réessayez dans quelques minutes.`);
      } else {
        setError(data.error || 'Code invalide ou expiré');
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.");
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {step === 1
            ? 'Connexion par Email'
            : 'Entrez le code reçu'}
        </h2>
        <p className="text-gray-600 mb-6">
          {step === 1
            ? 'Recevez un code de connexion sécurisé par email'
            : 'Saisissez le code que vous avez reçu par email'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          step === 1 ? handleSendCode() : handleVerifyCode();
        }}
      >
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
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
              </svg>
            </span>
          </div>
        </div>

        {step === 1 && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom (optionnel)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Votre nom"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Si non renseigné, nous utiliserons la première partie de votre email
            </p>
          </div>
        )}

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
                setError(null);
                setInfo(null);
              }}
              disabled={loading}
            >
              Changer d'email
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mt-2 text-sm">
            {error}
          </div>
        )}
        
        {info && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded mt-2 text-sm">
            {info}
          </div>
        )}

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
      </form>

      <div className="text-xs text-gray-400 text-center">
        Votre email ne sera jamais partagé. <br />
        <span className="italic">Besoin d'aide ? Contactez-nous.</span>
      </div>
    </div>
  );
} 