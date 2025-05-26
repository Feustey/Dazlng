'use client';

import { useState, useRef, useEffect } from 'react';
import { AuthError, AuthErrorType, ValidationErrors } from '../../../types/errors';
import { toast } from 'react-hot-toast';

interface RegistrationFormData {
  prenom: string;
  nom: string;
  pubkey?: string;
}

interface OTPLoginState {
  email: string;
  code: string;
  step: number;
  loading: boolean;
  error: AuthError | null;
  validationErrors: ValidationErrors;
  needsRegistration: boolean;
  tempToken: string;
  registrationData: RegistrationFormData;
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
    needsRegistration: false,
    tempToken: '',
    registrationData: {
      prenom: '',
      nom: '',
      pubkey: ''
    },
    retryCount: 0
  });
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.step === 2 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [state.step]);

  const handleError = (error: any): AuthError => {
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

    return {
      type: AuthErrorType.SERVER,
      message: error.message || 'Une erreur est survenue',
      code: error.code,
      retry: true
    };
  };

  const validateRegistrationData = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!state.registrationData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis';
    }
    
    if (!state.registrationData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }

    if (state.registrationData.pubkey) {
      if (!/^[A-Za-z0-9+/=]{20,}$/.test(state.registrationData.pubkey)) {
        errors.pubkey = 'Format de clé publique invalide';
      }
    }

    return errors;
  };

  const handleSendCode = async (): Promise<void> => {
    if (!state.email) {
      setState(prev => ({ ...prev, error: { type: AuthErrorType.VALIDATION, message: 'Veuillez saisir votre email', details: { email: 'Email requis' } } }));
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
      
      if (res.ok) {
        setState(prev => ({ ...prev, step: 2 }));
      } else {
        throw {
          status: res.status,
          data,
          message: data.error || "Erreur lors de l'envoi du code"
        };
      }
    } catch (error) {
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
        throw {
          status: response.status,
          data,
          message: data.error
        };
      }

      if (data.needsRegistration) {
        setState(prev => ({
          ...prev,
          needsRegistration: true,
          tempToken: data.tempToken,
          loading: false
        }));
        toast.success('Code vérifié avec succès. Veuillez compléter votre inscription.');
        return;
      }

      localStorage.setItem('token', data.token);
      toast.success('Connexion réussie !');
      window.location.href = '/user/dashboard';

    } catch (err) {
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

  const handleRegistrationSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    try {
      const validationErrors = validateRegistrationData();
      if (Object.keys(validationErrors).length > 0) {
        setState(prev => ({ ...prev, validationErrors }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        validationErrors: {}
      }));

      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...state.registrationData,
          email: state.email,
          tempToken: state.tempToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          data,
          message: data.error
        };
      }

      localStorage.setItem('token', data.token);
      toast.success('Compte créé avec succès !');
      window.location.href = '/user/dashboard';

    } catch (err) {
      const error = handleError(err);
      setState(prev => ({ ...prev, error }));
      
      if (error.type === AuthErrorType.VALIDATION && error.details) {
        setState(prev => ({ 
          ...prev, 
          validationErrors: error.details as ValidationErrors
        }));
      }

      toast.error(error.message);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const ValidationError: React.FC<{ field: string }> = ({ field }) => {
    const error = state.validationErrors[field];
    return error ? (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    ) : null;
  };

  const ErrorMessage: React.FC = () => {
    const { error } = state;
    if (!error) return null;

    return (
      <div className={`p-4 rounded-md ${
        error.type === AuthErrorType.RATE_LIMIT 
          ? 'bg-yellow-50 text-yellow-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        <p className="font-medium">{error.message}</p>
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

  if (state.needsRegistration) {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Créez votre compte</h2>
        
        <ErrorMessage />

        <form onSubmit={handleRegistrationSubmit} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              required
              className={`mt-1 block w-full rounded-md shadow-sm ${
                state.validationErrors.prenom 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              value={state.registrationData.prenom}
              onChange={(e) => setState(prev => ({
                ...prev,
                registrationData: {
                  ...prev.registrationData,
                  prenom: e.target.value
                }
              }))}
            />
            <ValidationError field="prenom" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              required
              className={`mt-1 block w-full rounded-md shadow-sm ${
                state.validationErrors.nom 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              value={state.registrationData.nom}
              onChange={(e) => setState(prev => ({
                ...prev,
                registrationData: {
                  ...prev.registrationData,
                  nom: e.target.value
                }
              }))}
            />
            <ValidationError field="nom" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Clé publique (optionnel)
            </label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md shadow-sm ${
                state.validationErrors.pubkey 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              value={state.registrationData.pubkey || ''}
              onChange={(e) => setState(prev => ({
                ...prev,
                registrationData: {
                  ...prev.registrationData,
                  pubkey: e.target.value
                }
              }))}
            />
            <ValidationError field="pubkey" />
          </div>

          <button
            type="submit"
            disabled={state.loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {state.loading ? (
              <>
                <span className="animate-spin mr-2">⚪</span>
                Création en cours...
              </>
            ) : 'Créer mon compte'}
          </button>
        </form>
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