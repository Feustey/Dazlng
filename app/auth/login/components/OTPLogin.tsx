'use client';

import { useState, useRef, useEffect } from 'react';
import { AuthError, AuthErrorType, ValidationErrors } from '../../../types/errors';
import { toast } from 'react-hot-toast';

interface OTPLoginState {
  email: string;
  code: string;
  step: number;
  loading: boolean;
  error: AuthError | null;
  validationErrors: ValidationErrors;
  retryCount: number;
}

const OTPLogin: React.FC = () => {
  const [state, setState] = useState<OTPLoginState>({
    email: '',
    code: '',
    step: 1,
    loading: false,
    error: null,
    validationErrors: {},
    retryCount: 0
  });
  
  // Ajouter un état pour l'hydratation
  const [isClient, setIsClient] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (state.step === 2 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [state.step]);

  const handleError = (error: any): AuthError => {
    console.error('Error details:', error);
    
    if (!navigator.onLine) {
      return {
        type: AuthErrorType.NETWORK,
        message: 'Pas de connexion internet',
        retry: true
      };
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        type: AuthErrorType.NETWORK,
        message: 'Impossible de contacter le serveur',
        retry: true
      };
    }

    if (error.status === 429) {
      return {
        type: AuthErrorType.RATE_LIMIT,
        message: 'Trop de tentatives, veuillez patienter',
        retryAfter: parseInt(error.headers?.get('Retry-After') || '300'),
        retry: false
      };
    }

    if (error.status === 400) {
      return {
        type: AuthErrorType.VALIDATION,
        message: 'Données invalides',
        details: error.data?.details || {},
        retry: true
      };
    }

    // S'assurer que le message est toujours une string
    const message = typeof error.message === 'string' 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Une erreur est survenue';

    return {
      type: AuthErrorType.SERVER,
      message,
      code: error.code,
      retry: true
    };
  };

  const handleSendCode = async (): Promise<void> => {
    if (!state.email) {
      setState(prev => ({ 
        ...prev, 
        error: { 
          type: AuthErrorType.VALIDATION, 
          message: 'Veuillez saisir votre email', 
          details: { email: 'Email requis' } 
        } 
      }));
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email })
      });
      
      const data = await res.json();
      console.log('Send code response:', data);
      
      if (res.ok) {
        setState(prev => ({ ...prev, step: 2 }));
        toast.success('Code envoyé avec succès !');
      } else {
        const errorMessage = data.error || data.message || `Erreur ${res.status}`;
        throw {
          status: res.status,
          data,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Send code error:', error);
      const err = handleError(error);
      setState(prev => ({ ...prev, error: err, retryCount: err.retry ? prev.retryCount + 1 : prev.retryCount }));
      toast.error(err.message);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!state.code.trim()) {
        throw {
          type: AuthErrorType.VALIDATION,
          message: 'Le code est requis',
          details: { code: 'Code requis' }
        };
      }

      const response = await fetch('/api/otp/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: state.email, 
          code: state.code 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || `Erreur ${response.status}`;
        throw {
          status: response.status,
          data,
          message: errorMessage
        };
      }

      // Redirection directe après succès
      localStorage.setItem('token', data.token);
      toast.success('Connexion réussie !');
      window.location.href = '/user/dashboard';

    } catch (err) {
      console.error('Verify code error:', err);
      const error = handleError(err);
      setState(prev => ({ 
        ...prev, 
        error,
        retryCount: error.retry ? prev.retryCount + 1 : prev.retryCount
      }));

      toast.error(error.message);

      if (error.retry && state.retryCount < 3) {
        setTimeout(() => {
          handleVerifyCode();
        }, 2000);
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const ErrorMessage: React.FC = () => {
    const { error } = state;
    if (!error) return null;

    // S'assurer que le message est toujours une string
    const errorMessage = typeof error.message === 'string' 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Une erreur est survenue';

    return (
      <div className={`p-4 rounded-md ${
        error.type === AuthErrorType.RATE_LIMIT 
          ? 'bg-yellow-50 text-yellow-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        <p className="font-medium">{errorMessage}</p>
        {error.retryAfter && (
          <p className="text-sm mt-1">
            Réessayez dans {Math.ceil(error.retryAfter / 60)} minutes
          </p>
        )}
        {error.retry && state.retryCount < 3 && (
          <p className="text-sm mt-1">
            Nouvelle tentative automatique dans quelques secondes...
          </p>
        )}
      </div>
    );
  };

  // Attendre que le composant soit hydraté pour éviter les erreurs d'hydratation
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion par Email
          </h2>
          <p className="text-gray-600 mb-6">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {state.step === 1
            ? 'Connexion par Email'
            : 'Entrez le code reçu'}
        </h2>
        <p className="text-gray-600 mb-6">
          {state.step === 1
            ? 'Recevez un code de connexion sécurisé par email'
            : 'Saisissez le code que vous avez reçu par email'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          state.step === 1 ? handleSendCode() : handleVerifyCode();
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
              value={state.email}
              onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
              disabled={state.loading || state.step === 2}
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
              </svg>
            </span>
          </div>
        </div>

        {state.step === 2 && (
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
              value={state.code}
              onChange={e => setState(prev => ({ ...prev, code: e.target.value }))}
              disabled={state.loading}
              ref={codeInputRef}
            />
            <button
              type="button"
              className="text-xs text-indigo-600 mt-2 underline"
              onClick={() => {
                setState(prev => ({ ...prev, step: 1, code: '' }));
              }}
              disabled={state.loading}
            >
              Changer d'email
            </button>
          </div>
        )}

        <ErrorMessage />

        <button
          type="submit"
          disabled={state.loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition ${
            state.loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {state.loading
            ? (state.step === 1 ? 'Envoi du code...' : 'Connexion...')
            : (state.step === 1 ? 'Recevoir le code' : 'Se connecter')}
        </button>
      </form>

      <div className="text-xs text-gray-400 text-center">
        Votre email ne sera jamais partagé. <br />
        <span className="italic">Besoin d'aide ? Contactez-nous.</span>
      </div>
    </div>
  );
};

export default OTPLogin; 